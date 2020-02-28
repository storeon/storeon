let useCallback = require('react').useCallback
let Fragment = require('react').Fragment
let render = require('react-dom').render
let h = require('react').createElement

let StoreContext = require('../../react/context')
let createStore = require('../../')
let useStoreon = require('../../react')
let devtools = require('../../devtools')
let logger = require('../../devtools/logger')

function counter1 (store) {
  store.on('@init', () => ({ count1: 0 }))
  store.on('inc1', state => ({ count1: state.count1 + 1 }))
}

function counter2 (store) {
  store.on('@init', () => ({ count2: 0 }))
  store.on('inc2', state => ({ count2: state.count2 + 1 }))
}

function tracker (text) {
  let hue = Math.round(255 * Math.random())
  return h('div', {
    className: 'tracker',
    style: { backgroundColor: `hsla(${ hue }, 50%, 50%, 0.2)` }
  }, text)
}

function Button1 () {
  let { dispatch } = useStoreon()()
  let onClick = useCallback(() => {
    dispatch('inc1')
  })
  return h('button', { onClick }, 'Increase counter 1')
}

function Button2 () {
  let { dispatch } = useStoreon()()
  let onClick = useCallback(() => {
    dispatch('inc2')
  })
  return h('button', { onClick }, 'Increase counter 2')
}

function Tracker1 () {
  let { count1 } = useStoreon()('count1')
  return tracker(`Counter 1: ${ count1 }`)
}

function Tracker2 () {
  let { count2 } = useStoreon()('count2')
  return tracker(`Counter 2: ${ count2 }`)
}

function Tracker12 () {
  let { count1, count2 } = useStoreon()('count1', 'count2')
  return tracker(`Counter 1: ${ count1 }, counter 2: ${ count2 }`)
}

function App () {
  return h(Fragment, null,
    h('div', { className: 'buttons' },
      h(Button1),
      h(Button2)
    ),
    h(Tracker1),
    h(Tracker2),
    h(Tracker12))
}

let store = createStore([counter1, counter2, logger, devtools()])

render(
  h(StoreContext.Provider, { value: store }, h(App)),
  document.querySelector('main')
)
