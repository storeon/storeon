import { Dispatch } from "..";

declare namespace useStoreon {
  export type StoreData<State extends object = {}, EventsDataTypesMap = any> = {
    dispatch: Dispatch<EventsDataTypesMap>;
  } & State
}

declare function useStoreon<State extends object = {}, EventsDataTypesMap = any>(
  ...keys: (keyof State)[]
): useStoreon.StoreData<State, EventsDataTypesMap>;

export = useStoreon;
