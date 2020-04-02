import { Client, PoolClient } from 'pg';
import Pool from 'pg-pool';
import { ConnectableObservable } from 'rxjs';
import { publish } from 'rxjs/operators';
import { ILogger } from 'stoolie';
import PgNotifier from './PgNotifier';
import { IRxNotifier } from './types';

export default class RxNotifier implements IRxNotifier {
  private connected: boolean;
  private client: PoolClient | undefined;
  private notifier: PgNotifier | undefined;
  private readonly consumerMap: Map<string, ConnectableObservable<any>>;
  private logger: ILogger;
  private pool: Pool<Client>;

  constructor(pool: Pool<Client>, logger: ILogger) {
    this.pool = pool;
    this.consumerMap = new Map();
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

      const observable$ = this.consumerMap.get(channel);

      if (observable$) {
        this.logger.debug('Existing consumer found');

        return observable$;
      }

      this.logger.debug('Creating new consumer');

      const connectable$ = this.notifier
        .channel(channel)
        .pipe(publish()) as ConnectableObservable<any>;

      this.consumerMap.set(channel, connectable$);

      return connectable$ as ConnectableObservable<any>;
    }

    const error = new Error(
      'Notifier is not connected. Did you forget to call connect?'
    );
    this.logger
      .withError(error)
      .error('Notifier must be connected.')
      .withFields({ isConnected: this.connected, notifier: this.notifier });

    throw error;
  }

  notify(channel: string, message: any) {
    if (this.connected && this.notifier) {
      return this.notifier.notify(channel, message);
    }

    const error = new Error(
      'Notifier is not connected. Did you forget to call connect?'
    );
    this.logger.withError(error).error('Notifier must be connected.');

    throw error;
  }
}
