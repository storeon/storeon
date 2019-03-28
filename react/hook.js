var React = require('react')

var StoreContext = require('./context')

/**
 * Hook to use Storeon in functional React component.
 *
 * @param {...string} fields List of state’s field.
 *
 * @return {object} The selected part of the state.
 *
 * @example
 * import useStoreon from 'storeon/react/hook'
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
  var rerender = React.useState()[1]
  var state = store.get()

  React.useEffect(function () {
    return store.on('@changed', function (_, changed) {
      var changesInKeys = keys.some(function (key) {
        return key in changed
      })
      if (changesInKeys) rerender({ })
    })
  }, [])

  var data = { }
  keys.forEach(function (key) {
    data[key] = state[key]
  })
  data.dispatch = store.dispatch
  return data
}
