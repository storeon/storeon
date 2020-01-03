type DataTypes<Map, Key extends keyof Map> =
    Map extends never ? [any?] : (Map[Key] extends (never | undefined) ? [never?] : [Map[Key]])

declare namespace createStore {
  export type Dispatch<Events> = (<Event extends keyof Events>(
    event: Event, ...data: DataTypes<Partial<Events>, Event>) => void) & {___events: Events};

  export type DispatchEvent<State, Events, Event extends keyof Events = keyof Events> =
    [Event, Events[Event], Array<StoreonEventHandler<State, Events, Event>>];

  export type StoreonEventHandler<State, Events, Event extends keyof (Events & StoreonEvents<State, Events>)> =
    (state: Readonly<State>, data: (Events & StoreonEvents<State, Events>)[Event]) => Partial<State> | Promise<void> | null | void;

  export interface Store<State = unknown, Events = any> {
    readonly on: <Event extends keyof (Events & StoreonEvents<State, Events>)>(
      event: Event,
      handler: StoreonEventHandler<State, Events, Event>
    ) => () => void;
    readonly dispatch: Dispatch<Events & DispatchableStoreonEvents<State>>;
    readonly get: () => State;
  }

  export type Module<State, Events = any> = (store: Store<State, Events>) => void;

  export interface DispatchableStoreonEvents<State> {
    '@init': never;
    '@changed': State;
  }

  export interface StoreonEvents<State, Events = any> extends DispatchableStoreonEvents<State>{
     '@dispatch': DispatchEvent<State, Events & DispatchableStoreonEvents<State>>;
  }
}

declare function createStore<State, Events = any>(
    modules: Array<createStore.Module<State, Events> | false>
): createStore.Store<State, Events>;

export = createStore;
