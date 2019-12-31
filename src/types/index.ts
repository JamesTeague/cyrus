import pg from 'pg';
import * as Rx from 'rxjs';

export interface IRxNotifier {
  on(key: string): Rx.ConnectableObservable<any>;
  notify(channel: string, message: any): Promise<pg.QueryResult>;
}

export type PlatformOptions = {
  appName: string;
  user?: string;
  password?: string;
  host?: string;

  port?: number;
  database?: string;
}
