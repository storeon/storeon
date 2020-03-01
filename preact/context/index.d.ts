import { PreactContext } from 'preact'
import { Store } from '../..'

/**
 * Context to put store for `connect` decorator.
 *
 * ```js
 * import { StoreContext } from 'storeon/preact'
 * render(
 *   <StoreContext.Provider value={store}><App /></StoreContext.Provider>,
 *   document.body
 * )
 * ```
 */
declare const StoreContext: PreactContext<Store>

export = StoreContext
