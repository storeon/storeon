import { Dispatch } from '..'

declare namespace useStoreon {
  export type StoreData<State extends object = {}, EventsMap = any, StateKeys extends (keyof State)[] = [keyof State]> = {
    dispatch: Dispatch<EventsMap>
  } & Pick<State, StateKeys[number]>
}

/**
 * Hook to use Storeon in functional React component.
 *
 * ```js
 * import useStoreon from 'storeon/react'
 * const Counter = () => {
 *   const { dispatch, count } = useStoreon()('count')
 *   return <div>
 *     {count}
 *     <button onClick={() => dispatch('inc')} />
 *   </div>
 * }
 * ```
 * Hook to use Storeon in functional React component with Typescript.
 *
 * ```ts
 * import useStoreon from 'storeon/react'
 * import { State, Events } from './store'
 * const Counter = () => {
 *   const { dispatch, count } = useStoreon<State, Events>()('count')
 *   return <div>
 *     {count}
 *     <button onClick={() => dispatch('inc')} />
 *   </div>
 * }
 * ```
 *
 * @param keys List of state’s field.
 * @returns The selected part of the state.
 */
declare function useStoreon<State extends object = {}, EventsMap = any>():
  <StateKeys extends (keyof State)[]>(...args: StateKeys) =>
    useStoreon.StoreData<State, EventsMap, StateKeys[][number]>;

export = useStoreon
