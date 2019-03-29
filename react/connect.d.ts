import { ComponentType, FunctionComponent } from "react";

import { Dispatch, Store } from "..";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type MapStateToProps<T> = {
  (store: any): T;
};

// Removes dispatch from the props requirements and mark everything else optional
type ConnectedComponent<ComponentProps> = FunctionComponent<
  Partial<Omit<ComponentProps, "dispatch">>
>;

// As the number of keys is indefinite and keys are not inferrable as types,
// it is upto the user to have the component as last parameter
export default function connect<ComponentProps>(
  ...keysORcomponent: Array<string | ComponentType<ComponentProps>>
): ConnectedComponent<ComponentProps>;
