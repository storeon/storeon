import { Dispatch } from '..'

declare namespace useStoreon {
  export type StoreData<State extends object = {}, EventsMap = any> = {
    dispatch: Dispatch<EventsMap>
  } & State
}

/**
 * Hook to use Storeon in functional React component.
 *
 * ```js
 * import useStoreon from 'storeon/react'
 * const Counter = () => {
 *   const { dispatch, count } = useStoreon('count')
 *   return <div>
 *     {count}
 *     <button onClick={() => dispatch('inc')}
 *   </div>
 * }
 * ```
 *
 * @param keys List of state’s field.
 * @returns The selected part of the state.
 */
declare function useStoreon<State extends object = {}, EventsMap = any>(
  ...keys: (keyof State)[]
): useStoreon.StoreData<State, EventsMap>

export = useStoreon
