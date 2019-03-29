var useCallback = require('react').useCallback
var Fragment = require('react').Fragment
var render = require('react-dom').render
var h = require('react').createElement

var StoreContext = require('../../react/context')
var createStore = require('../../')
var devtools = require('../../devtools')
var connect = require('../../react/connect')
var logger = require('../../devtools/logger')

function counter1 (store) {
  store.on('@init', function () {
    return { count1: 0 }
  })
  store.on('inc1', function (state) {
    return { count1: state.count1 + 1 }
  })
}

function counter2 (store) {
  store.on('@init', function () {
    return { count2: 0 }
  })
  store.on('inc2', function (state) {
    return { count2: state.count2 + 1 }
  })
}

function Tracker (props) {
  var hue = Math.round(255 * Math.random())
  var style = { backgroundColor: 'hsla(' + hue + ', 50%, 50%, 0.2)' }
  return h('div', { className: 'tracker', style: style }, props.value)
}

function Button (props) {
  var onClick = useCallback(function () {
    props.dispatch(props.event)
  })
  return h('button', { onClick: onClick }, props.text)
}

var Tracker1 = connect('count1', function (props) {
  return h(Tracker, {
    value: 'Counter 1: ' + props.count1
  })
})

var Tracker2 = connect('count2', function (props) {
  return h(Tracker, {
    value: 'Counter 2: ' + props.count2
  })
})

var Tracker12 = connect('count1', 'count2', function (props) {
  return h(Tracker, {
    value: 'Counter 1: ' + props.count1 + ', counter 2: ' + props.count2
  })
})

var Button1 = connect(function (props) {
  return h(Button, {
    dispatch: props.dispatch, event: 'inc1', text: 'Increase counter 1'
  })
})

var Button2 = connect(function (props) {
  return h(Button, {
    dispatch: props.dispatch, event: 'inc2', text: 'Increase counter 2'
  })
})

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

var store = createStore([counter1, counter2, logger, devtools])

render(
  h(StoreContext.Provider, { value: store }, h(App)),
  document.querySelector('main')
)
