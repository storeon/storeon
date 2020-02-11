import createStore, {Module, Store} from '..'
import logger from '../devtools/logger'
import loggerBrowser from '../devtools/logger.browser'
import devtools from '../devtools'

interface State {
  a: number
  b: string
}

// Reducer typed as a Module
const init: Module<State> = store => {
  store.on('@init', () => ({ a: 0, b: '' }))
}

// Duck-typed reducer
function setUp(store: Store<State>): void {
  store.on('inc', state => ({ a: state.a + 1 }))
}

// Store
const store = createStore<State>([
  init,
  setUp,
  logger,
  loggerBrowser,
  devtools,
  devtools(),
])

// String event dispatch
store.dispatch('inc')

// Symbolic event
const sym = Symbol('sym')
store.on(sym, (state, data: number) => ({ a: state.a + data }))
store.dispatch(sym, 2)

// Async reducer
store.on('comment:post', async (_, data: string) => {
  store.dispatch('comment:posting')
  try {
    const response = await fetch('https://github.com', { body: data })
    const result = await response.json()
    store.dispatch('comment:posted', result)
  } catch (e) {
    store.dispatch('comment:error', e)
  }
})

const state = store.get()
state.a
