let print

if (typeof navigator !== 'undefined' && navigator.product !== 'ReactNative') {
  print = (type, name, opts) => {
    if (typeof opts !== 'undefined') {
      console.log(
        '%c' + type + ' %c' + name,
        'color: #070',
        'color: #070; font-weight: 700',
        opts
      )
    } else {
      console.log(
        '%c' + type + ' %c' + name,
        'color: #070',
        'color: #070; font-weight: 700'
      )
    }
  }
} else {
  print = (type, name, opts) => {
    if (typeof opts !== 'undefined') {
      console.log(type, name, opts)
    } else {
      console.log(type, name)
    }
  }
}

module.exports = store => {
  store.on('@dispatch', (state, data) => {
    if (data[0] === '@changed') {
      let keys = Object.keys(data[1]).join(', ')
      print('changed', keys, state)
    } else {
      print('action', String(data[0]), data[1])
    }
  })
}
