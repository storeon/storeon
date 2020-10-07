import * as ReactDOM from 'react-dom'
import * as React from 'react'

import { createStoreon, StoreonStore, StoreonEvents } from '../index.js'
import { StoreContext, useStoreon, connectStoreon } from '../react/index.js'

interface State {
  a: number
}

interface EventsDataTypesMap extends StoreonEvents<State> {
  inc: undefined
}

function init (store: StoreonStore<State>) {
  store.on('@init', () => ({ a: 0 }))
  store.on('inc', (state, data: number) => ({ a: state.a + data }))
}

const store = createStoreon<State, EventsDataTypesMap>([init])

function Button () {
  let { dispatch, a } = useStoreon<State, EventsDataTypesMap>('a')

  let onClick = React.useCallback(() => dispatch('inc'), [])

  return <button onClick={onClick}>Count: {a}</button>
}

const App = connectStoreon<State>('a', ({ a }) => {
  return (
    <>
      <div>Count: {a}</div>
      <Button />
    </>
  )
})

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.body
)
