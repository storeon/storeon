let createStore = require('../')
let logger = require('../devtools/logger.browser')

let STYLE = 'color: #070'
let BOLD = 'color: #070; font-weight: 700'

function counter (store) {
  store.on('@init', () => ({ count: 0, started: true }))
  store.on('inc', (state, value) => ({ count: state.count + value }))
}

it('prints dispatches', () => {
  jest.spyOn(console, 'log').mockImplementation(() => true)
  let store = createStore([counter, logger])
  store.dispatch('inc', 2)
  expect(console.log.mock.calls).toEqual([
    ['%caction %c@init', STYLE, BOLD],
    ['%cchanged %ccount, started', STYLE, BOLD, { count: 0, started: true }],
    ['%caction %cinc', STYLE, BOLD, 2],
    ['%cchanged %ccount', STYLE, BOLD, { count: 2, started: true }]
  ])
})
