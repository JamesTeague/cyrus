jest.mock('pg-pool');
jest.mock('rxnotifier/pg_notifier');

import Pool from 'pg-pool';
import cyrus from './index';
import RxNotifier from './RxNotifier';

describe('Cyrus', () => {
  it('initialize library', () => {
    const notifier = cyrus(new Pool());

    expect(notifier).toBeInstanceOf(RxNotifier);
    expect(notifier.on).toBeDefined();
    expect(notifier.notify).toBeDefined();
  });
});
