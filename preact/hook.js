var hooks = require('preact/hooks')

var StoreContext = require('./context')

module.exports = function () {
  var keys = [].slice.call(arguments)

  var store = hooks.useContext(StoreContext)
  var rerender = hooks.useState()[1]
  var state = store.get()

  hooks.useEffect(function () {
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
