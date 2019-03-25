# Storeon

A tiny event-based Redux-like state manager for React and Preact.

* **Small.** 186 bytes (minified and gzipped). No dependencies.
  It uses [Size Limit] to control size.
* **Fast.** It track what state parts was changed and re-render only components
  based on this state parts.
* **Immutable.** The same Redux reducers, but already with syntax sugar on top.
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
import connect from 'storeon/react' // or storeon/preact

const Counter = ({ count, dispatch }) => <>
  {count}
  <button onClick={() => dispatch('inc')} />
</>

export default connect('count', Counter)
```

```js
import { StoreContext } from 'storeon/react'

render(
  <StoreContext.Provider value={store}>
    <Counter></Counter>
  </StoreContext.Provider>,
  document.body
)
```

[Size Limit]: https://github.com/ai/size-limit

<a href="https://evilmartians.com/?utm_source=storeon">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>


## Usage

### Store

The store should be created with `createStore()` function. It accepts list
of the modules.

Each module is just a function, which will accept `store`
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
    return projects.concat([project])
  })
}
```

The store has 3 methods:

* `store.get()` will return current state. The state is always an object.
* `store.on(event, callback)` will add event listener.
* `store.dispatch(event, data)` will emit event with optional data.


### Events

There are three built-in events:

* `@init` will be fired in `createStore`. The best moment to set an initial state.
* `@dispatch` will be fired on every `store.dispatch()` call.
  It receives array with event name and event’s data.
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
event listener.

```js
const unbind = store.on('@changed', …)
unbind()
```

You can dispatch any other events. Just do not start event names with `@`.

If the event listener returns an object, this object will update the state.
You do not need to return the whole state, return an object
with changed keys.

```js
// count: 0 will be added to state on initialization
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


### Components

You can bind the store to React and Preact component with `connect()` decorator.

```js
import connect from 'storeon/react' // Use 'storeon/preact' for Preact

const Users = ({ users, dispatch }) => {
  const onAdd = useCallback(user => {
    dispatch('users/add', user)
  })
  return <div>
    {users.map(user => <User key={user.id} user={user} />)}
    <NewUser onAdd={onAdd} />
  </div>
}

export default connect('users', Users)
```

`connect()` accept the list of state keys to pass into `props`.
It will re-render only if this keys will be changed.


### Logger

Storeon has built-in events logger.

```js
const store = createStore([
  …
  process.env.NODE_ENV === 'production' && require('storeon/logger')
])
```

### Debug

Storeon supports debugging with [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)

```js
import createStore from 'storeon'
import devtools from 'storeon/devtools'

const store = process.env.NODE_ENV === 'production' ? createStore([…]) : devtools([…])
```
