export type Dispatch = {
  (event: string, data?: any): void;
};

export interface Store<T> {
  on: (
    event: string,
    handler: (state: Readonly<T>, data: any) => Partial<T> | Promise<any> | void
  ) => () => void;
  dispatch: Dispatch;
  get: () => T;
}

export type Module<T> = false | { (store: Store<T>): void };

declare function createStore<T>(modules: Array<Module<T>>): Store<T>;

export default createStore;
