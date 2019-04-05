/**
 * Redux DevTools module for Storeon.
 *
 * @param {Store} store The store.
 * @returns {undefined}
 *
 * @example
 * const store = createStore([
 *   process.env.NODE_ENV !== 'production' && require('storeon/devtools')
 * ])
 *
 * @name devtools
 * @function
 */
function devtools (store) {
  var extension =
    window.__REDUX_DEVTOOLS_EXTENSION__ ||
    window.top.__REDUX_DEVTOOLS_EXTENSION__

  if (!extension) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'Please install Redux devtools extension\n' +
        'http://extension.remotedev.io/'
      )
    }
    return
  }

  var ReduxTool = extension.connect()
  store.on('@init', function () {
    ReduxTool.subscribe(function (message) {
      if (message.type === 'DISPATCH' && message.state) {
        store.dispatch('UPDATE_FROM_DEVTOOLS', JSON.parse(message.state))
      }
    })
    ReduxTool.init(store.get())
  })

  var prev = ''
  store.on('@dispatch', function (state, data) {
    var event = data[0]
    if (event !== 'UPDATE_FROM_DEVTOOLS' && prev !== 'UPDATE_FROM_DEVTOOLS') {
      if (event !== '@changed' || Object.keys(data[1]).length) {
        ReduxTool.send({ type: event, payload: data[1] }, state)
      }
    }
    prev = event
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
