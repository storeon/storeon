import { AnyComponent, FunctionalComponent } from 'preact'

declare namespace connect {
  export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
  export type ConnectedComponent<ComponentProps> = FunctionalComponent<
    Partial<Omit<ComponentProps, "dispatch">>
  >
}
/**
 * Connect Preact components to the store.
 *
 * ```js
 * import connect from 'storeon/preact/connect'
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
  ...keysOrComponent: Array<PropertyKey | AnyComponent<ComponentProps>>
): connect.ConnectedComponent<ComponentProps>

export = connect
