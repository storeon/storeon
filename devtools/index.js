module.exports = options => {
  let isStore = options && options.on && options.dispatch && options.get

  let module = store => {
    let extension
    try {
      extension = window.__REDUX_DEVTOOLS_EXTENSION__ ||
        window.top.__REDUX_DEVTOOLS_EXTENSION__
    } catch (e) {}
    if (!extension) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          'Please install Redux devtools extension\n' +
          'http://extension.remotedev.io/'
        )
      }
      return
    }

    let ReduxTool = extension.connect(isStore ? { } : options)
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
      let newState = { }
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
