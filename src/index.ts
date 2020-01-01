import stoolie, { LogLevel } from '@penguinhouse/stoolie';
import Pool from 'pg-pool';
import RxNotifier from './RxNotifier';
import { IRxNotifier, PlatformOptions } from './types';

function cyrus(platformOptions: PlatformOptions) {
  const { appName, ...options } = platformOptions;

  const logger = stoolie(appName, LogLevel.DEBUG)
    .withCategory('Publish-Subscribe')
    .withType('Postgres');

  const pool = new Pool(options);

  return new RxNotifier(pool, logger);
}

export default cyrus;
export { IRxNotifier };
