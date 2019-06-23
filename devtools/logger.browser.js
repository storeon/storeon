var print = console.log
if (typeof navigator !== 'undefined' && navigator.product !== 'ReactNative') {
  print = function (type, name, opts) {
    console.log(
      '%c' + type + ' %c' + name,
      'color: #070',
      'color: #070; font-weight: 700',
      arguments.length === 2 ? '' : opts
    )
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
