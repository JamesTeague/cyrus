jest.mock('pg-pool');
jest.mock('./PgNotifier');

import { NullLog } from '@penguinhouse/stoolie';
import Pool from 'pg-pool';
import * as Rx from 'rxjs';
import PgNotifier from './PgNotifier';
import RxNotifier from './RxNotifier';

describe('RxNotifier', () => {
  let notifier;
  let pool;
  const mockedNotify = jest.fn().mockName('notify');
  const mockedChannel = jest
    .fn()
    .mockReturnValue(Rx.of())
    .mockName('channel');

  beforeEach(() => {
    (PgNotifier as jest.Mock).mockClear();
    ((Pool as any) as jest.Mock).mockClear();

    (PgNotifier as jest.Mock).mockImplementation(() => ({
      channel: mockedChannel,
      notify: mockedNotify,
    }));
    ((Pool as any) as jest.Mock).mockImplementation(() => ({
      connect: jest.fn().mockReturnValue({}),
      end: jest.fn(),
    }));

    pool = new Pool();
  });

  it('does not connect if there is no database', () => {
    ((Pool as any) as jest.Mock).mockImplementationOnce(() => ({
      connect: jest.fn(),
    }));

    notifier = new RxNotifier(new Pool(), NullLog);

    return notifier.connect().then(success => {
      expect(success).toBeFalsy();
      expect(notifier.connected).toBeFalsy();
    });
  });

  it('returns true when connected to database', () => {
    notifier = new RxNotifier(pool, NullLog);

    return notifier.connect().then(success => {
      expect(success).toBeTruthy();
      expect(notifier.connected).toBeTruthy();
    });
  });

  it('disconnects when connected', async () => {
    const spy = jest.spyOn(pool, 'end');
    notifier = new RxNotifier(pool, NullLog);

    await notifier.connect();
    await notifier.disconnect();

    expect(spy).toHaveBeenCalled();
    expect(notifier.connected).toBeFalsy();
  });

  it('disconnects when not connected', async () => {
    const spy = jest.spyOn(pool, 'end');
    notifier = new RxNotifier(pool, NullLog);

    await notifier.disconnect();

    expect(spy).toHaveBeenCalledTimes(0);
    expect(notifier.connected).toBeFalsy();
  });

  it('calls channel and returns a connectable observable', () => {
    const notifySpy = jest.spyOn(new PgNotifier(pool.connect()), 'channel');
    notifier = new RxNotifier(pool, NullLog);

    return notifier.connect().then(() => {
      const observable = notifier.on('test');

      expect(observable.connect).toBeDefined();
      expect(notifySpy).toHaveBeenCalledWith('test');
    });
  });

  it('logs when a consumer is found and returns consumer', () => {
    notifier = new RxNotifier(pool, NullLog);

    return notifier.connect().then(() => {
      notifier.on('test');

      const loggerSpy = jest.spyOn(NullLog, 'debug');
      const consumer = notifier.on('test');

      expect(loggerSpy).toHaveBeenCalledWith('Existing consumer found');
      expect(consumer).toBeInstanceOf(Rx.Observable);
      expect(consumer.connect).toBeDefined();
    });
  });

  it('logs when creating a new consumer and returns consumer', () => {
    const loggerSpy = jest.spyOn(NullLog, 'debug');

    notifier = new RxNotifier(pool, NullLog);

    return notifier.connect().then(() => {
      const consumer = notifier.on('spies');

      expect(loggerSpy).toHaveBeenCalledWith('Creating new consumer');
      expect(consumer).toBeInstanceOf(Rx.Observable);
      expect(consumer.connect).toBeDefined();
    });
  });

  it('calls notify to postgres', () => {
    const notifySpy = jest.spyOn(new PgNotifier(pool.connect()), 'notify');

    notifier = new RxNotifier(pool, NullLog);

    return notifier.connect().then(() => {
      notifier.notify('test', 'test');

      expect(notifySpy).toHaveBeenCalledWith('test', 'test');
    });
  });
});
