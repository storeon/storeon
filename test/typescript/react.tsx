import * as ReactDOM from 'react-dom'
import * as React from 'react'
import createStore, {Store} from '../..'
import useStoreon from '../../react'
import connect from '../../react/connect'
import StoreContext from '../../react/context'

interface State {
  a: number
}

function init(store: Store<State>) {
  store.on('@init', () => ({ a: 0 }))
  store.on('inc', (state, data: number) => ({a: state.a + data}))
}

const store = createStore([init])

function Button() {
  const {dispatch, a} = useStoreon<State>('a')

  const onClick = React.useCallback(() => dispatch('inc'), [])

  return (
    <button onClick={onClick}>Count: {a}</button>
  )
}

const App = connect<State>('a', ({a}) => {
  return (
    <>
      <div>Count: {a}</div>
      <Button/>
    </>
  )
});

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App/>
  </StoreContext.Provider>
)

