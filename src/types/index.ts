import * as Rx from 'rxjs';

export interface IRxNotifier {
  on(key: string): Rx.ConnectableObservable<any>;
  notify(channel: string, message: any): Promise<void>;
}
