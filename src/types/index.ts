import { QueryResult } from 'pg';
import { ConnectableObservable } from 'rxjs';

export interface IRxNotifier {
  on(key: string): ConnectableObservable<any>;
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  notify(channel: string, message: any): Promise<QueryResult>;
}

export type PlatformOptions = {
  appName: string;
  user?: string;
  password?: string;
  host?: string;

  port?: number;
  database?: string;
};
