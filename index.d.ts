declare namespace createStore {
  export type Dispatch = (event: PropertyKey, data?: unknown) => void;

  export interface Store<State = unknown> {
    readonly on: (
      event: PropertyKey,
      handler: (state: Readonly<State>, data: unknown) => Partial<State> | Promise<void> | null
    ) => () => void;
    readonly dispatch: Dispatch;
    readonly get: () => State;
  }

  export type Module<State> = (store: Store<State>) => void;
}

declare function createStore<State>(
  modules: Array<createStore.Module<State> | false>
): createStore.Store<State>;

export = createStore;
