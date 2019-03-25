function devtools (store) {
  var extension =
    window.__REDUX_DEVTOOLS_EXTENSION__ ||
    window.top.__REDUX_DEVTOOLS_EXTENSION__

  if (!extension) {
    console.warn('Please install Redux devtools extension')
    return
  }
  var prevMessage = ''

  var ReduxTool = extension.connect()

  store.on('@init', function () {
    ReduxTool.subscribe(function (message) {
      if (message.type === 'DISPATCH' && message.state) {
        store.dispatch('UPDATE_FROM_DEVTOOLS', JSON.parse(message.state))
      }
    })
    ReduxTool.init(store.get())
  })

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

module.exports = devtools
