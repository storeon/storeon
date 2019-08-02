let renderer = require('react-test-renderer')
let h = require('react').createElement

let StoreContext = require('../react/context')
let createStore = require('../')
let connect = require('../react/connect')
let useStoreon = require('../react')

jest.mock('react', () => {
  let React = require('react/cjs/react.development.js')
  React.useEffect = React.useLayoutEffect
  return React
})

function increment (store) {
  store.on('@init', () => ({ count: 0, started: true }))
  store.on('inc', state => ({ count: state.count + 1 }))
}

function init (store, body) {
  return renderer.create(h(StoreContext.Provider, { value: store }, body))
}

it('connects component to store', () => {
  function Button ({ dispatch }) {
    return h('button', {
      onClick () {
        dispatch('inc')
      }
    })
  }

  let store = createStore([increment])
  let wrapper = init(store, h(connect('count', Button), { a: 1, count: 100 }))

  let props = wrapper.root.findByType(Button).props
  expect(props).toEqual({ a: 1, count: 0, dispatch: store.dispatch })

  renderer.act(() => {
    wrapper.toJSON().props.onClick()
  })
  expect(wrapper.root.findByType(Button).props.count).toEqual(1)
})

it('renders only on changes', () => {
  function other (store) {
    store.on('@init', () => ({ other: 0 }))
    store.on('other', state => ({ other: state.other + 1 }))
  }

  let renders = 0
  function Tracker () {
    renders += 1
    return renders
  }
  let store = createStore([increment, other])

  init(store, h(connect('count', Tracker)))
  expect(renders).toEqual(1)

  renderer.act(() => {
    store.dispatch('inc')
  })
  expect(renders).toEqual(2)

  renderer.act(() => {
    store.dispatch('other')
  })
  expect(renders).toEqual(2)
})

it('allows using Symbol as a store key', () => {
  let sym = Symbol('sym')

  function symbol (store) {
    store.on('@init', () => ({ [sym]: 0 }))
    store.on('sym', state => ({ [sym]: state[sym] + 1 }))
  }
  function Button () {
    let hooks = useStoreon(sym)
    return hooks[sym]
  }
  let store = createStore([symbol])

  let wrapper = init(store, h(Button, { }, 'Test'))
  expect(wrapper.toJSON()).toBe('0')

  renderer.act(() => {
    store.dispatch('sym')
  })
  expect(wrapper.toJSON()).toBe('1')
})
