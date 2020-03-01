import { Context } from 'react'
import { Store } from '../..'

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
declare const StoreContext: Context<Store>

export = StoreContext
