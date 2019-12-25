import { ILogger, NullLog } from '@penguinhouse/stoolie';
import { Pool } from 'pg-pool';
import RxNotifier from './RxNotifier';

const cyrus = (pool: Pool, logger: ILogger = NullLog ) => new RxNotifier(pool, logger);

export default cyrus;
