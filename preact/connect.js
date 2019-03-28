var Preact = require('preact')
var hooks = require('preact/hooks')

var StoreContext = Preact.createContext('storeon')

module.exports = function connect () {
  var keys = [].slice.call(arguments, 0, arguments.length - 1)
  var Component = arguments[arguments.length - 1]

  return function (originProps) {
    var store = hooks.useContext(StoreContext)
    var rerender = hooks.useState()[1]
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

    hooks.useEffect(function () {
      return store.on('@changed', update)
    }, [])

    for (var i in originProps) {
      if (!(i in props)) props[i] = originProps[i]
    }
    props.dispatch = store.dispatch
    return Preact.h(Component, props)
  }
}
