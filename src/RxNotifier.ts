import { ILogger } from '@penguinhouse/stoolie';
import pg, { PoolClient } from 'pg';
import Pool from 'pg-pool';
import * as Rx from 'rxjs';
import * as RxOp from 'rxjs/operators';
import PgNotifier from './PgNotifier';
import { IRxNotifier } from './types';

type ConsumerMap = {
  [key: string]: Rx.ConnectableObservable<any>;
};

export default class RxNotifier implements IRxNotifier {
  private connected: boolean;
  private client: PoolClient | undefined;
  private notifier: PgNotifier | undefined;
  private readonly consumerMap: ConsumerMap;
  private logger: ILogger;
  private pool: Pool<pg.Client>;

  constructor(pool: Pool<pg.Client>, logger: ILogger) {
    this.pool = pool;
    this.consumerMap = {};
    this.logger = logger.withCategory('RxNotifier');
    this.connected = false;
  }

  async connect() {
    this.client = await this.pool.connect();

    if (this.client) {
      this.notifier = new PgNotifier(this.client);
      this.connected = true;
    }

    return this.connected;
  }

  async disconnect() {
    if (this.connected && this.client) {
      this.client.release();
      await this.pool.end();
      this.connected = false;
    }
  }

  on(channel: string) {
    if (this.connected && this.notifier) {
      this.logger.withFields({ channel }).debug('Consumer requested.');

      if (this.consumerMap[channel]) {
        this.logger.debug('Existing consumer found');

        return this.consumerMap[channel];
      }

      this.logger.debug('Creating new consumer');

      const consumer = this.notifier.channel(channel).pipe(RxOp.publish());

      this.consumerMap[channel] = consumer as Rx.ConnectableObservable<any>;

      return consumer as Rx.ConnectableObservable<any>;
    }

    const error = new Error('Notifier is not connected.');
    this.logger
      .withError(error)
      .error('Notifier must be connected.')
      .withFields({ c: this.connected, n: this.notifier });

    throw error;
  }

  notify(channel: string, message: any) {
    if (this.connected && this.notifier) {
      return this.notifier.notify(channel, message);
    }

    const error = new Error('Notifier is not connected.');
    this.logger.withError(error).error('Notifier must be connected.');

    throw error;
  }
}
