var createStore = require('../')
var devtools = require('../devtools')

function DEVTOOL_MOCK () {
  var store
  var subscribeCb
  var actions = []

  var ReduxTool = {
    init: function (state) {
      store = state
    },
    send: function (action, state) {
      actions.push(action)
      store = state
    },
    subscribe: function (cb) {
      subscribeCb = cb
    }
  }

  function dispatchState (message) {
    if (subscribeCb) subscribeCb(message)
  }

  return {
    connect: function () {
      return ReduxTool
    },
    store: function () {
      return store
    },
    devToolDispatch: dispatchState,
    actions: function () {
      return actions
    }
  }
}

function counter (store) {
  store.on('@init', function () {
    return { count: 0, started: true }
  })
  store.on('inc', function (state, value) {
    return { count: state.count + value }
  })
}

beforeEach(function () {
  global.__REDUX_DEVTOOLS_EXTENSION__ = DEVTOOL_MOCK()
})

afterEach(function () {
  global.__REDUX_DEVTOOLS_EXTENSION__ = undefined
  jest.restoreAllMocks()
})

it('initiates with data from store', function () {
  var store = createStore([counter, devtools()])
  var getDevtoolStore = global.__REDUX_DEVTOOLS_EXTENSION__.store

  expect(getDevtoolStore()).toEqual(store.get())
})

it('get state updates from store', function () {
  var store = createStore([counter, devtools()])
  var getDevtoolStore = global.__REDUX_DEVTOOLS_EXTENSION__.store

  expect(getDevtoolStore()).toEqual(store.get())
  store.dispatch('inc', 2)

  expect(getDevtoolStore()).toEqual(store.get())
})

it('get events from store', function () {
  var store = createStore([counter, devtools()])
  var getDevtoolsActions = global.__REDUX_DEVTOOLS_EXTENSION__.actions

  var initialState = {
    count: 0,
    started: true
  }

  var initialActions = [
    {
      payload: undefined,
      type: '@init'
    },
    {
      payload: initialState,
      type: '@changed'
    }
  ]

  expect(getDevtoolsActions()).toEqual(initialActions)

  var event = {
    action: 'inc',
    payload: 5
  }
  store.dispatch(event.action, event.payload)

  var newActions = initialActions.concat([
    {
      payload: event.payload,
      type: event.action
    },
    {
      payload: {
        count: event.payload
      },
      type: '@changed'
    }
  ])

  expect(getDevtoolsActions()).toEqual(newActions)
})

it('able to change store value', function () {
  var store = createStore([counter, devtools()])
  var devToolDispatch = global.__REDUX_DEVTOOLS_EXTENSION__.devToolDispatch

  expect(store.get()).toEqual({ count: 0, started: true })

  var newState = {
    count: 10,
    started: false
  }

  devToolDispatch({ type: 'DISPATCH', state: JSON.stringify(newState) })

  expect(store.get()).toEqual(newState)
})

it('shows warning when devtool is not installed', function () {
  var spy = jest.fn()
  jest.spyOn(console, 'warn').mockImplementation(spy)
  global.__REDUX_DEVTOOLS_EXTENSION__ = null

  createStore([counter, devtools()])

  expect(spy).toHaveBeenCalledWith(
    'Please install Redux devtools extension\n' +
    'http://extension.remotedev.io/'
  )
})
