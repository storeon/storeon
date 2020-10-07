import { Context, ComponentType, FunctionComponent } from 'react'

import { StoreonStore, StoreonDispatch } from '../index.js'

export namespace useStoreon {
  export type StoreData<State extends object = {}, EventsMap = any> = {
    dispatch: StoreonDispatch<EventsMap>
  } & State
}

/**
 * Hook to use Storeon in functional React component.
 *
 * ```js
 * import { useStoreon } from 'storeon/react'
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
export function useStoreon<State extends object = {}, EventsMap = any> (
  ...keys: (keyof State)[]
): useStoreon.StoreData<State, EventsMap>

/**
 * Higher-order function to let user create their own custom hooks in case of server-side rendering
 *
 * ```js
 * // Parent component
 * import { CreateContext } from 'react'
 * import { customContext } from 'storeon/react'
 *
 * const CustomContext = CreateContext(storeon)
 *
 * export const useStoreon = customContext(CustomContext)
 *
 * const Component = props => {
 *   return (
 *     <CustomContext>
 *       {props.children}
 *     </CustomContext>
 *   )
 * }
 * ```
 *
 * ```js
 * // Children component
 * import { useStoreon } from './parent'
 *
 * const Counter = () => {
 *   const { dispatch, count } = useStoreon('count')
 *   return <div>
 *     {count}
 *     <button onClick={() => dispatch('inc')}
 *   </div>
 * }
 * ```
 *
 * @param context User's owned React context
 * @returns useStoreon hooks that attatched to User's React context
 */
export function customContext<State extends object = {}, EventsMap = any> (
  context: Context<StoreonStore<State, EventsMap>>
): (...keys: (keyof State)[]) => useStoreon.StoreData<State, EventsMap>

/**
 * Context to put store for `connect` decorator.
 *
 * ```js
 * import { StoreContext } from 'storeon/react'
 * render(
 *   <StoreContext.Provider value={store}><App /></StoreContext.Provider>,
 *   document.body
 * )
 * ```
 */
export const StoreContext: Context<StoreonStore>

declare namespace connectStoreon {
  export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

  export type ConnectedComponent<ComponentProps> = FunctionComponent<
    Partial<Omit<ComponentProps, 'dispatch'>>
  >
}

/**
 * Connect React components to the store.
 *
 * ```js
 * import { connectStoreon } from 'storeon/react/connect'
 * const Counter = ({ count, dispatch }) => {
 *   return <div>
 *     {count}
 *     <button onClick={() => dispatch('inc')}
 *   </div>
 * }
 * export default connect('count', Counter)
 * ```
 *
 * @returns Wrapped component.
 */
export function connectStoreon<ComponentProps> (
  ...keysOrComponent: (PropertyKey | ComponentType<ComponentProps>)[]
): connectStoreon.ConnectedComponent<ComponentProps>
