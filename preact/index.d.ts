import { Dispatch } from "..";

declare namespace useStoreon {
  export type StoreData<T extends PropertyKey> = {
    dispatch: Dispatch;
  } & {
    [P in T]: unknown;
  }
}

declare function useStoreon<T extends PropertyKey>(...keys: T[]): useStoreon.StoreData<T>;

export = useStoreon;
