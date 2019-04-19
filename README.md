# Storeon

<img src="https://ai.github.io/storeon/logo.svg" align="right"
     alt="Storeon logo by Anton Lovchikov" width="180" height="160">

A tiny event-based Redux-like state manager for React and Preact.

* **Small.** 173 bytes (minified and gzipped). No dependencies.
  It uses [Size Limit] to control size.
* **Fast.** It tracks what parts of state were changed and re-renders
  only components based on the changes.
* **Hooks.** The same Redux reducers. With hooks for **React** and **Preact**.
* **Modular.** API created to move business logic away from React components.

```js
import createStore from 'storeon'

// Initial state, reducers and business logic are packed in independent modules
let increment = store => {
  // Initial state
  store.on('@init', () => ({ count: 0 }))
  // Reducers returns only changed part of the state
  store.on('inc', ({ count }) => ({ count: count + 1 }))
}

export const store = createStore([increment])
```

```js
import useStoreon from 'storeon/react' // or storeon/preact

export default const Counter = () => {
  // Counter will be re-render only on `state.count` changes
  const { dispatch, count } = useStoreon('count')
  return <button onClick={() => dispatch('inc')}>{count}</button>
}
```

```js
import StoreContext from 'storeon/react/context'

render(
  <StoreContext.Provider value={store}>
    <Counter />
  </StoreContext.Provider>,
  document.body
)
```

[Size Limit]: https://github.com/ai/size-limit

<a href="https://evilmartians.com/?utm_source=storeon">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>


## Install

```sh
npm install storeon
```

If you need to support IE, add [`Object.assign`] polyfill to your bundle.
You should have this polyfill already if you are using React.

```js
Object.assign = require('object-assign')
```

[`Object.assign`]: https://www.npmjs.com/package/object-assign

## Store

The store should be created with `createStore()` function. It accepts a list
of the modules.

Each module is just a function, which will accept a `store`
and bind their event listeners.

```js
// store/index.js
import createStore from 'storeon'

import projects from './projects'
import users from './users'

export const store = createStore([projects, users])
```

```js
// store/projects.js

export default store => {
  store.on('@init', () => ({ projects: [] }))

  store.on('projects/add', ({ projects }, project) => {
    return { projects: projects.concat([project]) }
  })
}
```

The store has 3 methods:

* `store.get()` will return current state. The state is always an object.
* `store.on(event, callback)` will add an event listener.
* `store.dispatch(event, data)` will emit an event with optional data.


## Events

There are three built-in events:

* `@init` will be fired in `createStore`. The best moment to set
  an initial state.
* `@dispatch` will be fired on every `store.dispatch()` call.
  It receives an array with the event name and the event’s data.
  Can be useful for debugging.
* `@changed` will be fired every when event listeners changed the state.
  It receives object with state changes.

To add an event listener, call `store.on()` with event name and callback.

```js
store.on('@dispatch', ([event, data]) => {
  console.log(`Storeon: ${ event } with `, data)
})
```

`store.on()` will return cleanup function. This function will remove
the event listener.

```js
const unbind = store.on('@changed', …)
unbind()
```

You can dispatch any other events. Just do not start event names with `@`.

If the event listener returns an object, this object will update the state.
You do not need to return the whole state, return an object
with changed keys.

```js
// users: {} will be added to state on initialization
store.on('@init', () => ({ users:  { } }))
```

Event listener accepts the current state as a first argument
and optional event object as a second.

So event listeners can be a reducer as well. As in Redux’s reducers,
you should change immutable.

```js
store.on('users/save', ({ users }, user) => {
  return {
    users: { ...users, [user.id]: user }
  }
})

store.dispatch('users/save', { id: 1, name: 'Ivan' })
```

You can dispatch other events in event listeners. It can be useful for async
operations.

```js
store.on('users/add', async (state, user) => {
  try {
    await api.addUser(user)
    store.dispatch('users/save', user)
  } catch (e) {
    store.dispatch('errors/server-error')
  }
})
```

## Components

For functional components, `useStoreon` hook will be the best option:

```js
import useStoreon from 'storeon/react' // Use 'storeon/preact' for Preact
const Users = () => {
  const { dispatch, users } = useStoreon('users')
  const onAdd = useCallback(user => {
    dispatch('users/add', user)
  })
  return <div>
    {users.map(user => <User key={user.id} user={user} />)}
    <NewUser onAdd={onAdd} />
  </div>
}
```

For class components, you can use `connect()` decorator.

```js
import connect from 'storeon/react/connect' // Use 'storeon/preact/connect' for Preact

class User extends React {
  onAdd = () => {
    this.props.dispatch('users/add', user)
  }
  render () {
    return <div>
      {this.props.users.map(user => <User key={user.id} user={user} />)}
      <NewUser onAdd={this.onAdd} />
    </div>
  }
}

export default connect('users', Users)
```

`connect()` accept the list of state keys to pass into `props`.
It will re-render only if this keys will be changed.


## DevTools

Storeon supports debugging with [Redux DevTools Extension].

```js
const store = createStore([
  …
  process.env.NODE_ENV !== 'production' && require('storeon/devtools')
])
```

DevTools will also warn you about **typo in event name**. It will throw an error
if you are dispatching event, but nobody subscribed to it.

Or if you want to print events to `console` you can use built-in logger.
It could be useful for simple cases or to investigate issue in error trackers.

```js
const store = createStore([
  …
  process.env.NODE_ENV !== 'production' && require('storeon/devtools/logger')
])
```

[Redux DevTools Extension]: https://github.com/zalmoxisus/redux-devtools-extension
