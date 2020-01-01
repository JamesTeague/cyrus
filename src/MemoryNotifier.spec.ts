import * as Rx from 'rxjs';
import * as RxOp from 'rxjs/operators';
import MemoryNotifier from './MemoryNotifier';

describe('MemoryNotifier', () => {
  let memoryNotifier;

  beforeEach(() => {
    memoryNotifier = new MemoryNotifier(jest.fn(), jest.fn());
  });

  it('returns a new observable', done => {
    const observable = memoryNotifier.channel('test');

    expect(observable).toBeInstanceOf(Rx.Observable);
    observable.subscribe(data => {
      expect(data).toBe('ready');
      done();
    });
  });

  it('emits a message to the subscriber', done => {
    const observable = memoryNotifier.channel('test');

    observable.pipe(RxOp.skip(1)).subscribe(data => {
      expect(data).toEqual({ payload: 'test' });
      done();
    });

    memoryNotifier.notify('test', { payload: 'test' });
  });
});
