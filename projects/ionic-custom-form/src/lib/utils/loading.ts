import { LoadingController } from '@ionic/angular';
import { from, merge, Observable, of, Subscription, throwError } from 'rxjs';
import {
  catchError,
  flatMap,
  map,
  mergeAll,
  mergeMap,
  tap,
  switchMap,
} from 'rxjs/operators';
import { Mutex } from './mutex';
import { inject } from './inject';

export interface LoadingContext {
  dismiss?: () => void;
  active?: boolean;
  message?: string;
  subscription?: Subscription;
}

let loadingEl: HTMLIonLoadingElement | null = null;
const loadingElMutex = new Mutex();

const loadingQueue: LoadingContext[] = [];
const loadingQueueMutex = new Mutex();

const loadingElement = (): Promise<HTMLIonLoadingElement> =>
  loadingElMutex.runExclusive(() => {
    if (loadingEl != null) {
      return Promise.resolve(loadingEl);
    }
    return inject(LoadingController)
      .then((ctrl) =>
        ctrl.create({
          cssClass: 'loading-brbcard',
          spinner: 'dots',
        })
      )
      .then((loading) => (loadingEl = loading))
      .then(() => loadingEl as HTMLIonLoadingElement);
  });

const loadingFunction = (
  subOrMessage?: string | Subscription,
  message?: string
): Promise<LoadingContext> => {
  if (typeof subOrMessage === 'string') {
    message = subOrMessage;
    subOrMessage = undefined;
  }

  return Promise.resolve()
    .then(() => loadingElement())
    .then((loading) =>
      enqueueAndPresentFunction(loading, message, subOrMessage as Subscription)
    );
};

const enqueueAndPresentFunction = async (
  loading: HTMLIonLoadingElement,
  message: string | undefined,
  sub: Subscription
): Promise<LoadingContext> => {
  const present = loadingQueue.length === 0;

  const ctx = {
    message,
    sub,
    active: present,
    dismiss: () => nextFunction(loading, ctx),
  };

  loadingQueue.push(ctx);
  if (sub) {
    sub.add(() => ctx.dismiss());
  }
  loading.message = message;
  if (present) {
    return loading.present().then(() => ctx);
  } else {
    return Promise.resolve(ctx);
  }
};

const freeze = (time: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, time);
  });
};

const nextFunction = (loading: HTMLIonLoadingElement, ctx: LoadingContext) =>
  loadingQueueMutex.runExclusive(async () => {
    if (!ctx.active) {
      const i = loadingQueue.findIndex((c) => c === ctx);
      loadingQueue.splice(i);
      if (loadingQueue.length === 0) {
        loadingEl = null;
        await freeze(100);
        return loading.dismiss();
      }
      await freeze(100);
      return Promise.resolve(true);
    }

    const current = loadingQueue.shift();
    const next = loadingQueue[0];
    const dismiss = !next;
    if (current) {
      current.active = false;
    }
    if (dismiss) {
      loadingEl = null;
      await freeze(100);
      return loading.dismiss();
    }
    if (next) {
      loading.message = next.message;
      next.active = true;
    }
    return Promise.resolve(true);
  });

const obs = <T>(observable: Observable<T>): Observable<T> => {
  const l = loadingFunction() as any;
  return from(l).pipe(
    mergeMap((loading) => {
      return of(loading);
    }),
    flatMap((loading) => {
      return observable.pipe(
        map((a) => {
          return a;
        }),
        catchError((err) => {
          // @ts-ignore
          loading.dismiss();
          return throwError(err);
        }),
        tap(() => {
          // @ts-ignore
          return loading.dismiss();
        })
      );
    })
  ) as any;
};

export { loadingFunction as loading, obs as observe };
