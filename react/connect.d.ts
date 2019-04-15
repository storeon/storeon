import { ComponentType, FunctionComponent } from "react";

declare namespace connect {
  export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

  // Removes dispatch from the props requirements and mark everything else optional
  export type ConnectedComponent<ComponentProps> = FunctionComponent<
    Partial<Omit<ComponentProps, "dispatch">>
  >;
}

// As the number of keys is indefinite and keys are not inferrable as types,
// it is upto the user to have the component as last parameter
declare function connect<ComponentProps>(
  ...keysOrComponent: Array<PropertyKey | ComponentType<ComponentProps>>
): connect.ConnectedComponent<ComponentProps>;

export = connect;
