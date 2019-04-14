declare namespace createStore {
  export type Dispatch = {
    (event: PropertyKey, data?: unknown): void;
  };

  export interface Store<T = unknown> {
    readonly on: (
      event: PropertyKey,
      handler: (state: Readonly<T>, data: unknown) => Partial<T> | Promise<void> | null
    ) => () => void;
    readonly dispatch: Dispatch;
    readonly get: () => T;
  }

  export type Module<T> = (store: Store<T>) => void;
}

declare function createStore<T>(modules: Array<createStore.Module<T> | false>): createStore.Store<T>;

export = createStore;
