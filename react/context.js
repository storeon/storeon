var React = require('react')

/**
 * Context to put store for `connect` decorator.
 *
 * @example
 * import { StoreContext } from 'storeon/react'
 * render(
 *   <StoreContext.Provider value={store}><App /></StoreContext.Provider>,
 *   document.body
 * )
 *
 * @name StoreContext
 * @type {Context}
 */
module.exports = React.createContext('storeon')
