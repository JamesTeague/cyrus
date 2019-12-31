jest.mock('pg-pool');
jest.mock('./PgNotifier');

import cyrus from './index';
import RxNotifier from './RxNotifier';

describe('Cyrus', () => {
  it('initializes library', () => {
    const notifier = cyrus({ appName: 'index.spec.ts' });

    expect(notifier).toBeInstanceOf(RxNotifier);
    expect(notifier.on).toBeDefined();
    expect(notifier.notify).toBeDefined();
  });
});
