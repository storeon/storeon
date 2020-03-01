import { ComponentType, FunctionComponent } from 'react'

declare namespace connect {
  export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

  export type ConnectedComponent<ComponentProps> = FunctionComponent<
    Partial<Omit<ComponentProps, "dispatch">>
  >
}

/**
 * Connect React components to the store.
 *
 * ```js
 * import connect from 'storeon/react/connect'
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
declare function connect<ComponentProps>(
  ...keysOrComponent: Array<PropertyKey | ComponentType<ComponentProps>>
): connect.ConnectedComponent<ComponentProps>

export = connect
