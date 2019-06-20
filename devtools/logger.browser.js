var print
if (typeof navigator === 'undefined' || navigator.product === 'ReactNative') {
  print = function (type, name, opts) {
    if (opts) {
      console.log(type + ' ' + name, opts)
    } else {
      console.log(type + ' ' + name)
    }
  }
} else {
  var STYLE = 'color: #008100'
  var BOLD = 'color: #008100; font-weight: bold'
  print = function (type, name, opts) {
    if (opts) {
      console.log('%c' + type + ' %c' + name, STYLE, BOLD, opts)
    } else {
      console.log('%c' + type + ' %c' + name, STYLE, BOLD)
    }
  }
}

module.exports = function (store) {
  store.on('@dispatch', function (state, data) {
    if (data[0] === '@changed') {
      var keys = Object.keys(data[1]).join(', ')
      print('changed', keys, state)
    } else if (data[1]) {
      print('action', String(data[0]), data[1])
    } else {
      print('action', String(data[0]))
    }
  })
}
