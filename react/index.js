var React = require('react')

var StoreContext = require('./context')

var useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

/**
 * Hook to use Storeon in functional React component.
 *
 * @param {...string} fields List of state’s field.
 *
 * @return {object} The selected part of the state.
 *
 * @example
 * import useStoreon from 'storeon/react'
 * const Counter = () => {
 *   const { dispatch, count } = useStoreon('count')
 *   return <div>
 *     {count}
 *     <button onClick={() => dispatch('inc')}
 *   </div>
 * }
 *
 * @name useStoreon
 */
module.exports = function () {
  var keys = [].slice.call(arguments)

  var store = React.useContext(StoreContext)
  if (process.env.NODE_ENV !== 'production' && !store) {
    throw new Error(
      'Could not find storeon context value.' +
      'Please ensure the component is wrapped in a <StoreContext.Provider>'
    )
  }

  var rerender = React.useState({ })

  useIsomorphicLayoutEffect(function () {
    return store.on('@changed', function (_, changed) {
      var changesInKeys = keys.some(function (key) {
        return key in changed
      })
      if (changesInKeys) rerender[1]({ })
    })
  }, [])

  return React.useMemo(function () {
    var state = store.get()
    var data = { }
    keys.forEach(function (key) {
      data[key] = state[key]
    })
    data.dispatch = store.dispatch
    return data
  }, [rerender[0]])
}
