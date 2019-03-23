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
var StoreContext = React.createContext('storeon')

module.exports = function connect () {
  var keys = [].slice.call(arguments, 0, arguments.length - 1)
  var Component = arguments[arguments.length - 1]

  return function (originProps) {
    var store = React.useContext(StoreContext)
    var rerender = React.useState()[1]
    var state = store.get()

    var props = { }
    keys.forEach(function (key) {
      props[key] = state[key]
    })
    function update (_, changed) {
      var changesInKeys = keys.some(function (key) {
        return key in changed
      })
      if (changesInKeys) rerender({ })
    }

    React.useEffect(function () {
      return store.on('@changed', update)
    }, [])

    for (var i in originProps) {
      if (!(i in props)) props[i] = originProps[i]
    }
    props.dispatch = store.dispatch
    return React.createElement(Component, props)
  }
}

module.exports.StoreContext = StoreContext

/**
* Connect React/Preact components to the store.
*
* @param {converter|...string} fields List of state’s field or function
*                                     to map state to props.
* @param {function} Component React/Preact component.
*
* @return {function} Wrapped component
*
* @example
* import connect from 'storeon/react' // or 'storeon/preact'
* const Counter = ({ count, dispatch }) => {
*   return <div>
*     {count}
*     <button onClick={() => dispatch('inc')}
*   </div>
* }
* export default connect('count', React.memo(Counter))
*
* @name connect
* @function
*/

/**
* @callback converter
* @param {object} state The store state.
* @return {object} Props for component.
*/
