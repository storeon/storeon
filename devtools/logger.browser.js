const print = function(type, name, opts) {
  const isReactNative = typeof navigator === 'undefined' || navigator.product === 'ReactNative';
  const STYLE = 'color: #008100'
  const BOLD = `${STYLE}; font-weight: bold'`
  const msg = !isReactNative ? `${type} ${name}` : `%c${type} %c${name}`

  if (isReactNative) {
    console.log(msg, opts ? opts : '')
  } else {
    console.log(msg, STYLE, BOLD, opts ? opts : '')
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
