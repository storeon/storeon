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

let storeonLogger = store => {
  store.on('@dispatch', (state, data) => {
    if (data[0] === '@changed') {
      let keys = Object.keys(data[1]).join(', ')
      print('changed', keys, state)
    } else {
      print('action', String(data[0]), data[1])
    }
  })
}

let storeonDevtools = options => {
  let isStore = options && options.on && options.dispatch && options.get

  let module = store => {
    let extension
    try {
      extension =
        window.__REDUX_DEVTOOLS_EXTENSION__ ||
        window.top.__REDUX_DEVTOOLS_EXTENSION__
    } catch {}
    if (!extension) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          'Please install Redux devtools extension\n' +
            'http://extension.remotedev.io/'
        )
      }
      return
    }

    let ReduxTool = extension.connect(isStore ? {} : options)
    store.on('@init', () => {
      ReduxTool.subscribe(message => {
        if (message.type === 'DISPATCH' && message.state) {
          store.dispatch('UPDATE_FROM_DEVTOOLS', JSON.parse(message.state))
        }
      })
      ReduxTool.init(store.get())
    })

    let prev = ''
    store.on('@dispatch', (state, data) => {
      let event = String(data[0])
      if (event !== 'UPDATE_FROM_DEVTOOLS' && prev !== 'UPDATE_FROM_DEVTOOLS') {
        if (event[0] !== '@' && (!data[2] || data[2].length === 0)) {
          throw new Error('Unknown Storeon event ' + event)
        }
        if (event !== '@changed' || Object.keys(data[1]).length) {
          ReduxTool.send({ type: event, payload: data[1] }, state)
        }
      }
      prev = event
    })

    store.on('UPDATE_FROM_DEVTOOLS', (state, data) => {
      let newState = {}
      let key
      for (key in state) {
        newState[key] = undefined
      }
      for (key in data) {
        newState[key] = data[key]
      }
      return newState
    })
  }

  return isStore ? module(options) : module
}

module.exports = { storeonDevtools, storeonLogger }
