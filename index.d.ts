export type Dispatch = {
  (event: PropertyKey, data?: any): void;
};

export interface Store<T> {
  on: (
    event: PropertyKey,
    handler: (state: Readonly<T>, data: any) => Partial<T> | Promise<void> | null
  ) => () => void;
  dispatch: Dispatch;
  get: () => T;
}

export type Module<T> = false | { (store: Store<T>): void };

declare function createStore<T>(modules: Array<Module<T>>): Store<T>;

export default createStore;
