jest.mock('pg-pool');
jest.mock('rxnotifier/pg_notifier');

import { NullLog } from '@penguinhouse/stoolie';
import Pool from 'pg-pool';
import * as Rx from 'rxjs';
import PgNotifier from 'rxnotifier/pg_notifier';
import RxNotifier from './index';

describe('RxNotifier', () => {
  const mockedNotify = jest.fn().mockName('notify');
  const mockedChannel = jest.fn().mockReturnValue(Rx.of())
    .mockName('channel');
  PgNotifier.mockImplementation(() => ({
    channel: mockedChannel,
    notify: mockedNotify,
  }));
  const notifier = new RxNotifier(new Pool(), NullLog);

  it('calls channel and returns a connectable observable', () => {
    const notifySpy = jest.spyOn(new PgNotifier(), 'channel');
    const observable = notifier.on('test');

    expect(observable.connect).toBeDefined();
    expect(notifySpy).toHaveBeenCalledWith('test');
  });

  it('logs when a consumer is found and returns consumer', () => {
    const loggerSpy = jest.spyOn(NullLog, 'debug');

    const consumer = notifier.on('test');

    expect(loggerSpy).toHaveBeenCalledWith('Existing consumer found');
    expect(consumer).toBeInstanceOf(Rx.Observable);
    expect(consumer.connect).toBeDefined();
  });

  it('logs when creating a new consumer and returns consumer', () => {
    const loggerSpy = jest.spyOn(NullLog, 'debug');

    const consumer = notifier.on('spies');

    expect(loggerSpy).toHaveBeenCalledWith('Creating new consumer');
    expect(consumer).toBeInstanceOf(Rx.Observable);
    expect(consumer.connect).toBeDefined();
  });

  it('calls notify to postgres', () => {
    const notifySpy = jest.spyOn(new PgNotifier(), 'notify');

    notifier.notify('test', 'test');

    expect(notifySpy).toHaveBeenCalledWith('test', 'test');
  });
});
