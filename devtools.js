var createStore = require('.')

function devtools (modules) {
  var extension =
    window.__REDUX_DEVTOOLS_EXTENSION__ ||
    window.top.__REDUX_DEVTOOLS_EXTENSION__

  if (!extension) {
    console.warn('Please install Redux devtools extension')
    return createStore(modules)
  }

  var ReduxTool = extension.connect()

  var store = createStore(modules.concat(createLogger(ReduxTool)))

  ReduxTool.subscribe(function (message) {
    if (message.type === 'DISPATCH' && message.state) {
      store.dispatch('UPDATE_FROM_DEVTOOLS', JSON.parse(message.state))
    }
  })
  ReduxTool.init(store.get())

  return store
}

function createLogger (ReduxTool) {
  var prevMessage = ''
  function logger (store) {
    store.on('@dispatch', function (state, data) {
      if (
        data[0] !== 'UPDATE_FROM_DEVTOOLS' &&
        prevMessage !== 'UPDATE_FROM_DEVTOOLS'
      ) {
        if (data[0] !== '@changed' || Object.keys(data[1]).length) {
          ReduxTool.send({ type: data[0], payload: data[1] }, state)
        }
      }
      prevMessage = data[0]
    })

    store.on('UPDATE_FROM_DEVTOOLS', function (state, data) {
      var newState = {}
      var key
      for (key in state) {
        newState[key] = undefined
      }
      for (key in data) {
        newState[key] = data[key]
      }
      return newState
    })
  }

  return logger
}

module.exports = devtools
