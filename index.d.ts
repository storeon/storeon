type DataTypes<Map, Key extends keyof Map> =
    Map extends never
      ? [any?]
      : (Map[Key] extends (never | undefined) ? [never?] : [Map[Key]])

declare namespace createStore {
  export type Dispatch<Events> = (<Event extends keyof Events>(
    event: Event, ...data: DataTypes<Partial<Events>, Event>
  ) => void) & {___events: Events}

  export type DispatchEvent<
    State, Events, Event extends keyof Events = keyof Events
  > = [Event, Events[Event], Array<StoreonEventHandler<State, Events, Event>>]

  export type StoreonEventHandler<
    State, Events, Event extends keyof (Events & StoreonEvents<State, Events>)
  > = (
    state: Readonly<State>,
    data: (Events & StoreonEvents<State, Events>)[Event]
  ) => Partial<State> | Promise<void> | null | void

  /**
   * Store with application state and event listeners.
   */
  export class Store<State = unknown, Events = any> {
    /**
     * Add event listener.
     *
     * @param event The event name.
     * @param handler The event listener.
     * @returns The function to remove listener.
     */
    on <Event extends keyof (Events & StoreonEvents<State, Events>)>(
      event: Event,
      handler: StoreonEventHandler<State, Events, Event>
    ): () => void

    /**
     * Return current state. You can use this method only to read state.
     * Any state changes should be in event listeners.
     *
     * @returns The current state.
     */
    get(): State

    /**
     * Emit event.
     *
     * @param event The event name.
     * @param data Any additional data for the event.
     * @returns The current state.
     */
    dispatch: Dispatch<Events & DispatchableEvents<State>>
  }

  export type Module<State, Events = any> =
    (store: Store<State, Events>) => void

  export interface DispatchableEvents<State> {
    '@init': never
    '@changed': State
  }

  export interface StoreonEvents<State, Events = any> extends DispatchableEvents<State>{
    '@dispatch': DispatchEvent<State, Events & DispatchableEvents<State>>
  }
}

/**
 * Initialize new store and apply all modules to the store.
 *
 * ```js
 * import createStore from 'storeon'
 * let increment = store => {
 *   store.on('@init', () => ({ count: 0 }))
 *   store.on('inc', ({ count }) => ({ count: count + 1 }))
 * }
 * const store = createStore([increment])
 * store.get().count //=> 0
 * store.dispatch('inc')
 * store.get().count //=> 1
 * ```
 *
 * @param modules Functions which will set initial state define reducer
 *                and subscribe to all system events.
 * @returns The new store.
 */
declare function createStore<State, Events = any>(
  modules: Array<createStore.Module<State, Events> | false>
): createStore.Store<State, Events>

export = createStore
