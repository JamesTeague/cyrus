jest.mock('pg-pool');

import Pool from 'pg-pool';
import MemoryNotifier from './MemoryNotifier';
import PgNotifier from './PgNotifier';
jest.mock('./MemoryNotifier');

describe('PgNotifier', () => {
  let pgNotifier;
  let pool;

  beforeEach(() => {
    ((Pool as any) as jest.Mock).mockClear();
    ((Pool as any) as jest.Mock).mockImplementation(() => ({
      on: jest.fn(),
      query: jest.fn(),
    }));

    pool = new Pool();
    pgNotifier = new PgNotifier(pool);
  });

  it('calls notifier to create channel', () => {
    const memoryNotifierInstance = ((MemoryNotifier as any) as jest.Mock).mock
      .instances[0];

    pgNotifier.channel('test');

    expect(memoryNotifierInstance.channel).toHaveBeenCalledWith('test');
  });

  it('sends NOTIFY command as query', () => {
    const spy = jest.spyOn(pool, 'query');

    pgNotifier.notify('test', 'message');

    expect(spy).toHaveBeenCalledWith('NOTIFY "test", \'message\'');
  });
});
