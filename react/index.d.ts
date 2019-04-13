import { Dispatch } from "..";

type StoreData = {
  dispatch: Dispatch;
  [x: string]: any;
};

declare function useStoreon(...keys: PropertyKey[]): StoreData;

export default useStoreon;
