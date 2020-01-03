var hooks = require('preact/hooks')

var StoreContext = require('./context')

var useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? hooks.useLayoutEffect : hooks.useEffect

module.exports = function () {
  var keys = [].slice.call(arguments)

  var store = hooks.useContext(StoreContext)
  if (process.env.NODE_ENV !== 'production' && !store) {
    throw new Error(
      'Could not find storeon context value.' +
      'Please ensure the component is wrapped in a <StoreContext.Provider>'
    )
  }

  var rerender = hooks.useState({ })

  useIsomorphicLayoutEffect(function () {
    return store.on('@changed', function (_, changed) {
      var changesInKeys = keys.some(function (key) {
        return key in changed
      })
      if (changesInKeys) rerender[1]({ })
    })
  }, [])

  return hooks.useMemo(function () {
    var state = store.get()
    var data = { }
    keys.forEach(function (key) {
      data[key] = state[key]
    })
    data.dispatch = store.dispatch
    return data
  }, [rerender[0]])
}
