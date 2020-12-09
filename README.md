# Storeon

<img src="https://storeon.github.io/storeon/logo.svg" align="right"
     alt="Storeon logo by Anton Lovchikov" width="160" height="142">

A tiny event-based Redux-like state manager for **React**, **Preact**,
**[Angular]**, **[Vue]** and **[Svelte]**.

* **Small.** 180 bytes (minified and gzipped). No dependencies.
  It uses [Size Limit] to control size.
* **Fast.** It tracks what parts of state were changed and re-renders
  only components based on the changes.
* **Hooks.** The same Redux reducers.
* **Modular.** API created to move business logic away from React components.

Read more about Storeon features in **[our article]**.

```js
import { createStoreon } from 'storeon'

// Initial state, reducers and business logic are packed in independent modules
let count = store => {
  // Initial state
  store.on('@init', () => ({ count: 0 }))
  // Reducers returns only changed part of the state
  store.on('inc', ({ count }) => ({ count: count + 1 }))
}

export const store = createStoreon([count])
```

```js
import { useStoreon } from 'storeon/react' // or storeon/preact

export const Counter = () => {
  // Counter will be re-render only on `state.count` changes
  const { dispatch, count } = useStoreon('count')
  return <button onClick={() => dispatch('inc')}>{count}</button>
}
```

```js
import { StoreContext } from 'storeon/react'

render(
  <StoreContext.Provider value={store}>
    <Counter />
  </StoreContext.Provider>,
  document.body
)
```

[our article]: https://evilmartians.com/chronicles/storeon-redux-in-173-bytes
[Size Limit]: https://github.com/ai/size-limit
[Angular]: https://github.com/storeon/angular
[Svelte]: https://github.com/storeon/svelte
[Vue]: https://github.com/storeon/vue

<a href="https://evilmartians.com/?utm_source=storeon">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>


## Tools

* [`@storeon/router`](https://github.com/storeon/router)
  tracks links and Back button click and allows you to open
  pages without reloading the whole page.
* [`@storeon/localstorage`](https://github.com/storeon/localstorage)
  saves and restores state to `localStorage` or `sessionStorage`.
* [`@storeon/crosstab`](https://github.com/storeon/crosstab)
  synchronizes events between browser tabs.
* [`@storeon/undo`](https://github.com/storeon/undo)
  allows undoing or redoing the latest event.
* [`@storeon/websocket`](https://github.com/storeon/websocket)
  to sync actions through WebSocket.

Third-party tools:

* [`majo44/storeon-async-router`](https://github.com/majo44/storeon-async-router)
  is router with data prefetch, modules lazy load, navigation cancellation,
  and routes modification on the fly.
* [`mariosant/storeon-streams`](https://github.com/mariosant/storeon-streams)
  is side effects management library.
* [`octav47/storeonize`](https://github.com/octav47/storeonize)
  is migrating tool from Redux to Storeon.

## Install

```sh
npm install storeon
```

If you need to support IE, you need to [compile `node_modules`] with Babel and
add [`Object.assign`] polyfill to your bundle. You should have this polyfill
already if you are using React.

```js
import assign from 'object-assign'
Object.assign = assign
```

[compile `node_modules`]: https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/
[`Object.assign`]: https://www.npmjs.com/package/object-assign


## Store

The store should be created with the `createStoreon()` function. It accepts a list
of functions.

Each function should accept a `store` as the only argument and bind their event listeners using `store.on()`.

```js
// store/index.js
import { createStoreon } from 'storeon'

import { projects } from './projects'
import { users } from './users'

export const store = createStoreon([projects, users])
```

```js
// store/projects.js

export function projects (store) {
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

* `@init` will be fired in `createStoreon`. Bind to this event to set the initial state.
* `@dispatch` will be fired on every new action (on `store.dispatch()` calls
  and `@changed` events). It receives an array with the event name
  and the event’s data. Can be useful for debugging.
* `@changed` will be fired when any event changes the state.
  It receives object with state changes.

To add an event listener, call `store.on()` with the event name and a callback function.

```js
store.on('@dispatch', (state, [event, data]) => {
  console.log(`Storeon: ${ event } with `, data)
})
```

`store.on()` will return a cleanup function. Calling this function will remove
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

An event listener accepts the current state as the first argument,
optional event object as the second and optional store object as the third.

So event listeners can be reducers as well. As in Redux’s reducers,
your should change immutable.

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

For functional components, the `useStoreon` hook will be the best option:

```js
import { useStoreon } from 'storeon/react' // Use 'storeon/preact' for Preact

const Users = () => {
  const { dispatch, users, projects } = useStoreon('users', 'projects')
  const onAdd = useCallback(user => {
    dispatch('users/add', user)
  })
  return <div>
    {users.map(user => <User key={user.id} user={user} projects={projects} />)}
    <NewUser onAdd={onAdd} />
  </div>
}
```

For class components, you can use the `connectStoreon()` decorator.

```js
import { connectStoreon } from 'storeon/react' // Use 'storeon/preact' for Preact

class Users extends React.Component {
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

export default connectStoreon('users', 'anotherStateKey', Users)
```

`useStoreon` hook and `connectStoreon()` accept the list of state keys to pass
into `props`. It will re-render only if this keys will be changed.


## DevTools

Storeon supports debugging with [Redux DevTools Extension].

```js
import { storeonDevtools } from 'storeon/devtools';

const store = createStoreon([
  …
  process.env.NODE_ENV !== 'production' && storeonDevtools
])
```

DevTools will also warn you about **typo in event name**. It will throw an error
if you are dispatching event, but nobody subscribed to it.

Or if you want to print events to `console` you can use the built-in logger.
It could be useful for simple cases or to investigate issues in error trackers.

```js
import { storeonLogger } from 'storeon/devtools';

const store = createStoreon([
  …
  process.env.NODE_ENV !== 'production' && storeonLogger
])
```

[Redux DevTools Extension]: https://github.com/zalmoxisus/redux-devtools-extension


## TypeScript

Storeon delivers TypeScript declarations which allows to declare type
of state and optionally declare types of events and parameter.

If a Storeon store has to be fully type safe the event types declaration
interface has to be delivered as second type to `createStore` function.

```typescript
import { createStoreon, StoreonModule } from 'storeon'
import { useStoreon } from 'storeon/react' // or storeon/preact

// State structure
interface State {
  counter: number
}

// Events declaration: map of event names to type of event data
interface Events {
  // `inc` event which do not goes with any data
  'inc': undefined
  // `set` event which goes with number as data
  'set': number
}

const counterModule: StoreonModule<State, Events> = store => {
  store.on('@init', () => ({ counter: 0}))
  store.on('inc', state => ({ counter: state.counter + 1}))
  store.on('set', (state, event) => ({ counter: event}))
}

const store = createStoreon<State, Events>([counterModule])

const Counter = () => {
  const { dispatch, count } = useStoreon<State, Events>('count')
  // Correct call
  dispatch('set', 100)
  // Compilation error: `set` event do not expect string data
  dispatch('set', "100")
  …
}

// Correct calls:
store.dispatch('set', 100)
store.dispatch('inc')

// Compilation errors:
store.dispatch('inc', 100)   // `inc` doesn’t have data
store.dispatch('set', "100") // `set` event do not expect string data
store.dispatch('dec')        // Unknown event
```

In order to work properly for imports, consider adding
`allowSyntheticDefaultImports: true` to `tsconfig.json`.

## Server-Side Rendering

In order to preload data for server-side rendering, Storeon provides the
`customContext` function to create your own `useStoreon` hooks that
depend on your custom context.

```js
// store.jsx
import { createContext, render } from 'react' // or preact

import { createStoreon, StoreonModule } from 'storeon'
import { customContext } from 'storeon/react' // or storeon/preact

const store = …

const CustomContext = createContext(store)

// useStoreon will automatically recognize your storeon store and event types
export const useStoreon = customContext(CustomContext)

render(
  <CustomContext.Provider value={store}>
    <Counter />
  </CustomContext.Provider>,
  document.body
)
```

```js
// children.jsx
import { useStoreon } from '../store'

const Counter = () => {
  const { dispatch, count } = useStoreon('count')

  dispatch('set', 100)
  …
}
```


## Testing

Tests for store can be written in this way:

```js
it('creates users', () => {
  let addUserResolve
  jest.spyOn(api, 'addUser').mockImplementation(() => new Promise(resolve => {
    addUserResolve = resolve
  }))
  let store = createStoreon([usersModule])

  store.dispatch('users/add', { name: 'User' })
  expect(api.addUser).toHaveBeenCalledWith({ name: 'User' })
  expect(store.get().users).toEqual([])

  addUserResolve()
  expect(store.get().users).toEqual([{ name: 'User' }])
})
```

We recommend to keep business logic away from components. In this case,
UI kit (special page with all your components in all states)
will be the best way to test components.

For instance, with [UIBook] you can mock store and show notification
on any `dispatch` call.

[UIBook]: https://github.com/vrizo/uibook/
