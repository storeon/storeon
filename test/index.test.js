var createStore = require('../')

it('applies modules', function () {
  var store1, store2
  function module1 (arg) {
    store1 = arg
  }
  function module2 (arg) {
    store2 = arg
  }

  var store = createStore([module1, module2])

  expect(store1).toBe(store)
  expect(store2).toBe(store)
})

it('allows false as module', function () {
  createStore([false])
})

it('fires @init', function () {
  var fired = 0
  function module1 (store) {
    store.on('@init', function () {
      fired += 1
    })
  }

  createStore([module1])

  expect(fired).toEqual(1)
})

it('has empty object in state by default', function () {
  var store = createStore([])
  expect(store.get()).toEqual({ })
})

it('changes state in event listener', function () {
  var store = createStore([])
  store.on('test', function (state, data) {
    expect(store.get()).toEqual(state)
    expect(data).toEqual('a')
    return { a: 1 }
  })
  store.on('test', function () {
    return { b: 2 }
  })
  var changed = 0
  store.on('@changed', function (state) {
    expect(store.get()).toEqual(state)
    expect(state).toEqual({ a: 1, b: 2 })
    changed += 1
  })

  store.dispatch('test', 'a')

  expect(changed).toEqual(1)
  expect(store.get()).toEqual({ a: 1, b: 2 })
})

it('changes state immutably', function () {
  var store = createStore([])
  store.on('test', function () {
    return { b: 2 }
  })

  var state1 = store.get()
  store.dispatch('test')
  var state2 = store.get()

  expect(state1).toEqual({ })
  expect(state2).toEqual({ b: 2 })
})

it('unbinds event listeners', function () {
  var store = createStore([])
  var fired = 0
  var unbind = store.on('test', function () {
    fired += 1
  })

  unbind()
  store.dispatch('test')
  expect(fired).toEqual(0)
})

it('throws on unknown not system events', function () {
  var store = createStore([])

  expect(function () {
    store.dispatch('unknown')
  }).toThrow('Unknown event unknown')
  store.dispatch('@unknown')
})

it('notifies about new event', function () {
  var events = []
  function module (a) {
    a.on('@dispatch', function (state, e) {
      events.push(e)
    })
    a.on('test', function (state, data) {
      if (data === 1) {
        return { test: 1 }
      } else {
        return undefined
      }
    })
  }

  var store = createStore([module])
  store.dispatch('test', 1)
  store.dispatch('test', 2)

  expect(events).toEqual([
    ['@init', undefined],
    ['test', 1],
    ['@changed', undefined],
    ['test', 2]
  ])
})
