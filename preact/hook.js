var hooks = require('preact/hooks')

var StoreContext = require('./context')

module.exports = function () {
  var keys = [].slice.call(arguments)

  var store = hooks.useContext(StoreContext)
  var rerender = hooks.useState({ })

  hooks.useEffect(function () {
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
