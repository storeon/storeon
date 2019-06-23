Object.defineProperty(navigator, 'product', {
  get: function () {
    return 'ReactNative'
  }
})

var createStore = require('../')

function counter (store) {
  store.on('@init', function () {
    return { count: 0, started: true }
  })
  store.on('inc', function (state, value) {
    return { count: state.count + value }
  })
}

it('prints dispatches', function () {
  // mock first as console.log is default method to log
  jest.spyOn(console, 'log').mockImplementation(function () { })
  // then import logger with console.log
  var logger = require('../devtools/logger.browser')
  var store = createStore([counter, logger])
  store.dispatch('inc', 2)
  expect(console.log.mock.calls).toEqual([
    ['action', '@init'],
    ['changed', 'count, started', { count: 0, started: true }],
    ['action', 'inc', 2],
    ['changed', 'count', { count: 2, started: true }]
  ])
})
