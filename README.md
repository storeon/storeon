# Storeon

A tiny event-based Redux-like state manager for React and Preact.

* **Small.** 196 bytes (minified and gzipped). No dependencies.
  It uses [Size Limit] to control size.
* **Immutable.** The same Redux reducers, but already with syntax sugar on top.
* **Modular.** API created to move business logic away from React components.

```js
import createStore from 'storeon'

// Initial state, reducers and business logic are packed in independed modules
let increment = store => {
  // Initial state
  store.on('@init', () => ({ count: 0 }))
  // Reducers can return only changed part of the state
  store.on('inc', ({ count }) => ({ count: count + 1 }))
}

export const store = createStore([increment])
```

```js
import { connect } from 'storeon/react' // or storeon/preact

const Counter = ({ count, dispatch }) => {
  return <div>
    {count}
    <button onClick={() => dispatch('inc')}
  </div>
}
export default connect('count')(React.memo(Counter))
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

<a href="https://evilmartians.com/?utm_source=storeon">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>
