declare namespace createStore {
  export type Dispatch<EventsDataTypesMap = any> = <Event extends keyof EventsDataTypesMap>(
      event: Event, ...data: (EventsDataTypesMap[Event] extends (never | undefined) ? [never?] : [EventsDataTypesMap[Event]])) => void;

  export interface Store<State = unknown, EventsDataTypesMap extends StoreonEvents<State> = any> {
    readonly on: <Event extends keyof EventsDataTypesMap>(
      event: Event,
      handler: (state: Readonly<State>, data: EventsDataTypesMap[Event]) => Partial<State> | Promise<void> | null | void
    ) => () => void;
    readonly dispatch: Dispatch<EventsDataTypesMap>;
    readonly get: () => State;
  }

  export type Module<State, EventsDataTypesMap extends StoreonEvents<State> = any> = (store: Store<State, EventsDataTypesMap>) => void;

  export interface StoreonEvents<State> {
    '@init': never;
    '@changed': Partial<State>;
  }
}

declare function createStore<State, EventsDataTypesMap extends createStore.StoreonEvents<State> = any>(
  modules: Array<createStore.Module<State, EventsDataTypesMap> | false>
): createStore.Store<State, EventsDataTypesMap>;

export = createStore;
