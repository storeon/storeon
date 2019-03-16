var renderer = require('react-test-renderer')

var StoreContext = require('../react').StoreContext
var createStore = require('../')
var connect = require('../react').connect
var h = require('react').createElement

jest.mock('react', function () {
  var React = require('react/cjs/react.development.js')
  React.useEffect = React.useLayoutEffect
  return React
})

function increment (store) {
  store.on('@init', function () {
    return { count: 0, started: true }
  })
  store.on('inc', function (state) {
    return { count: state.count + 1 }
  })
}

function init (store, component) {
  return renderer.create(h(StoreContext.Provider, { value: store },
    h(component)
  ))
}

function Button (props) {
  return h('button', {
    onClick: function () {
      props.dispatch('inc')
    }
  })
}

it('connects component to store', function () {
  var store = createStore([increment])
  var wrapper = init(store, function () {
    return h(connect('count')(Button), { a: 1, count: 100 })
  })

  var props = wrapper.root.findByType(Button).props
  expect(props).toEqual({ a: 1, count: 0, dispatch: store.dispatch })

  renderer.act(function () {
    wrapper.toJSON().props.onClick()
  })
  expect(wrapper.root.findByType(Button).props.count).toEqual(1)
})

it('maps state to props', function () {
  var store = createStore([increment])
  function mapToProps (state) {
    return { stateCount: state.count }
  }
  var wrapper = init(store, function () {
    return h(connect(mapToProps)(Button))
  })

  var props = wrapper.root.findByType(Button).props
  expect(props).toEqual({ stateCount: 0, dispatch: store.dispatch })
})
