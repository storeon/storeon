Object.defineProperty(global, 'navigator', { undefined })

let createStore = require('../')
let logger = require('../devtools/logger')

function counter (store) {
  store.on('@init', () => ({ count: 0, started: true }))
  store.on('inc', (state, value = 1) => ({ count: state.count + value }))
}

it('prints dispatches', () => {
  jest.spyOn(console, 'log').mockImplementation(() => true)
  let store = createStore([counter, logger])
  store.dispatch('inc', 2)
  store.dispatch('inc', 0)
  store.dispatch('inc')
  expect(console.log.mock.calls).toEqual([
    ['action', '@init'],
    ['changed', 'count, started', { count: 0, started: true }],
    ['action', 'inc', 2],
    ['changed', 'count', { count: 2, started: true }],
    ['action', 'inc', 0],
    ['changed', 'count', { count: 2, started: true }],
    ['action', 'inc'],
    ['changed', 'count', { count: 3, started: true }]
  ])
})
