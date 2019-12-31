import { ILogger } from '@penguinhouse/stoolie';
import pg from 'pg';
import Pool from 'pg-pool';
import * as Rx from 'rxjs';
import * as RxOp from 'rxjs/operators';
import PgNotifier from './PgNotifier';
import { IRxNotifier } from './types';

type ConsumerMap = {
  [key: string]: Rx.ConnectableObservable<any>;
}

export default class RxNotifier implements IRxNotifier {
  private notifier: PgNotifier;
  private readonly consumerMap: ConsumerMap;
  private logger: ILogger;

  constructor(pool: Pool<pg.Client>, logger: ILogger) {
    this.notifier = new PgNotifier(pool);
    this.consumerMap = {};
    this.logger = logger.withCategory('RxNotifier');
  }

  on(channel: string) {
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

  notify(channel: string, message: any) {
    return this.notifier.notify(channel, message);
  }
}
