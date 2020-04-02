import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

type PromiseFunction = (key: string) => Promise<any>;

export default class MemoryNotifier {
  private readonly onListen: PromiseFunction;
  private readonly onUnlisten: PromiseFunction;
  private readonly subjectMap: Map<string, Subject<any>>;

  constructor(onListen: PromiseFunction, onUnlisten: PromiseFunction) {
    this.onListen = onListen;
    this.onUnlisten = onUnlisten;
    this.subjectMap = new Map();
  }

  channel(key): Observable<any> {
    const mappedSubject = this.subjectMap.get(key);

    if (!mappedSubject) {
      const subject = new Subject();

      this.subjectMap.set(
        key,
        subject.pipe(
          finalize(() => {
            if (subject.observers.length === 1) {
              return this.onUnlisten(key);
            }
          })
        ) as Subject<any>
      );

      this.onListen(key).catch(error => subject.error(error));
    }

    return this.subjectMap.get(key) as Observable<any>;
  }

  notify(channel, message) {
    const subject = this.subjectMap.get(channel);

    if (subject) {
      subject.next(message || '');
    }
  }
}
