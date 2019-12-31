import Pool from 'pg-pool';
import MemoryNotifier from './MemoryNotifier';
import PgNotifier from './PgNotifier';
jest.mock('./MemoryNotifier');

describe('PgNotifier', () => {
  let pgNotifier;
  const pool = new Pool();

  beforeEach(() => {
    pgNotifier = new PgNotifier(pool);
  });

  it('calls notifier to create channel', () => {
    const memoryNotifierInstance = (MemoryNotifier as any as jest.Mock).mock.instances[0];

    pgNotifier.channel('test');

    expect(memoryNotifierInstance.channel).toHaveBeenCalledWith('test');
  });

  it('sends NOTIFY command as query', () => {
    const spy = jest.spyOn(pool, 'query');

    pgNotifier.notify('test', 'message');

    expect(spy).toHaveBeenCalledWith('NOTIFY \"test\", \'message\'');
  });
});
