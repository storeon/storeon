import { Dispatch } from "..";

type StoreData = {
  dispatch: Dispatch;
  [x: string]: any;
};

declare function useStoreon(...keys: string[]): StoreData;

export default useStoreon;
