var renderer = require('react-test-renderer')
var h = require('react').createElement

var StoreContext = require('../react/context')
var createStore = require('../')
var connect = require('../react/connect')

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

function init (store, body) {
  return renderer.create(h(StoreContext.Provider, { value: store }, body))
}

it('connects component to store', function () {
  function Button (props) {
    return h('button', {
      onClick: function () {
        props.dispatch('inc')
      }
    })
  }

  var store = createStore([increment])
  var wrapper = init(store, h(connect('count', Button), { a: 1, count: 100 }))

  var props = wrapper.root.findByType(Button).props
  expect(props).toEqual({ a: 1, count: 0, dispatch: store.dispatch })

  renderer.act(function () {
    wrapper.toJSON().props.onClick()
  })
  expect(wrapper.root.findByType(Button).props.count).toEqual(1)
})

it('renders only on changes', function () {
  function other (store) {
    store.on('@init', function () {
      return { other: 0 }
    })
    store.on('other', function (state) {
      return { other: state.other + 1 }
    })
  }

  var renders = 0
  function Tracker () {
    renders += 1
    return renders
  }
  var store = createStore([increment, other])

  init(store, h(connect('count', Tracker)))
  expect(renders).toEqual(1)

  renderer.act(function () {
    store.dispatch('inc')
  })
  expect(renders).toEqual(2)

  renderer.act(function () {
    store.dispatch('other')
  })
  expect(renders).toEqual(2)
})
