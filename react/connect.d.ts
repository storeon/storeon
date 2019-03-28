import { ComponentType, FunctionComponent, Context } from "react";

import { Dispatch, Store } from ".";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type MapStateToProps<T> = {
  (store: any): T;
};

// Removes injected props and dispatch from the prop requirements.
type ConnectedComponent<ComponentProps, PropsFromStore> = FunctionComponent<
  Omit<ComponentProps, keyof PropsFromStore | "dispatch">
>;

export declare function connect<InjectedProps, ComponentProps>(
  mapStateToProps: MapStateToProps<InjectedProps>,
  component: ComponentType<ComponentProps>
): ConnectedComponent<ComponentProps, InjectedProps>;

// As the number of keys is indefinite and keys are not inferrable as types,
// it is upto the user to have the component as last parameter and
// mark all injected props as optional in the component
export declare function connect<ComponentProps>(
  ...keysORcomponent: Array<string | ComponentType<ComponentProps>>
): ConnectedComponent<ComponentProps, {}>;

export const StoreContext: Context<Store<any>>;
