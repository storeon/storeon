import { Dispatch } from "..";

declare namespace useStoreon {
  export type StoreData<State extends object = {}> = {
    dispatch: Dispatch;
  } & State
}

declare function useStoreon<State extends object = {}>(
  ...keys: (keyof State)[]
): useStoreon.StoreData<State>;

export = useStoreon;
