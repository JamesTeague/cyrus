import { Observable, Subject } from 'rxjs';
import MemoryNotifier from './MemoryNotifier';

describe('MemoryNotifier', () => {
  let memoryNotifier;

  beforeEach(() => {
    memoryNotifier = new MemoryNotifier(
      jest.fn().mockResolvedValue(true),
      jest.fn().mockResolvedValue(true)
    );
  });

  it('returns a new observable', () => {
    const observable$ = memoryNotifier.channel('test');

    expect(observable$).toBeInstanceOf(Observable);
    expect(observable$).toBeInstanceOf(Subject);
  });

  it('calls onListen when key is unused', () => {
    const onListenSpy = jest.fn().mockResolvedValue(true);

    memoryNotifier = new MemoryNotifier(
      onListenSpy,
      jest.fn().mockResolvedValue(true)
    );

    memoryNotifier.channel('test');
    memoryNotifier.channel('test');

    expect(onListenSpy).toHaveBeenCalledTimes(1);
  });

  it('errors if onListen rejects', done => {
    const onListenSpy = jest.fn().mockRejectedValue(false);
    const errorSpy = jest.fn().mockImplementation(() => {
      expect(onListenSpy).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
      done();
    });

    memoryNotifier = new MemoryNotifier(
      onListenSpy,
      jest.fn().mockResolvedValue(true)
    );

    const observable$ = memoryNotifier.channel('test');

    observable$.subscribe({
      error: errorSpy,
    });
  });

  it('calls unListen when all subscribes have unsubscribed', () => {
    const onUnlistenSpy = jest.fn().mockResolvedValue(true);

    memoryNotifier = new MemoryNotifier(
      jest.fn().mockResolvedValue(true),
      onUnlistenSpy
    );

    const observable$ = memoryNotifier.channel('test');

    const subscriber1 = observable$.subscribe();
    const subscriber2 = observable$.subscribe();

    subscriber1.unsubscribe();
    subscriber2.unsubscribe();

    expect(onUnlistenSpy).toHaveBeenCalledTimes(1);
  });

  it('emits a message to the subscriber', done => {
    const observable$ = memoryNotifier.channel('test');

    observable$.subscribe(data => {
      expect(data).toEqual({ payload: 'test' });
      done();
    });

    memoryNotifier.notify('test', { payload: 'test' });
  });

  it('is multicasted', done => {
    let calls = 0;
    const callLimit = 2;
    const emittedData: any[] = [];

    const recordData = (data: any) => {
      calls++;
      emittedData.push(data);

      if (calls === callLimit) {
        expect(emittedData).toHaveLength(2);
        expect(emittedData[0]).toMatchObject(emittedData[1]);
        done();
      }
    };

    const observable$ = memoryNotifier.channel('test');

    observable$.subscribe(recordData);
    observable$.subscribe(recordData);

    memoryNotifier.notify('test', { payload: 'test' });
  });
});
