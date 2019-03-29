var Preact = require('preact')

var useStoreon = require('./')

module.exports = function connect () {
  var keys = [].slice.call(arguments, 0, arguments.length - 1)
  var Component = arguments[arguments.length - 1]

  return function (originProps) {
    var props = useStoreon.apply(null, keys)
    for (var i in originProps) {
      if (!(i in props)) props[i] = originProps[i]
    }
    return Preact.h(Component, props)
  }
}
