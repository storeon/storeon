import { createStoreon, StoreonModule, StoreonStore } from '../index.js'
import { storeonDevtools, storeonLogger } from '../devtools/index.js'

interface State {
  a: number
  b: string
}

// Reducer typed as a Module
const init: StoreonModule<State> = store => {
  store.on('@init', () => ({ a: 0, b: '' }))
}

// Duck-typed reducer
function setUp(store: StoreonStore<State>): void {
  store.on('inc', state => ({ a: state.a + 1 }))
}

// Store
const store = createStoreon<State>([
  init,
  setUp,
  storeonLogger,
  storeonDevtools,
  storeonDevtools()
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
    let response = await fetch('https://github.com', { body: data })
    let result = await response.json()
    store.dispatch('comment:posted', result)
  } catch (e) {
    store.dispatch('comment:error', e)
  }
})

const state = store.get()
state.a

// Allows undefined on state type
let storeA: StoreonStore
const storeB: StoreonStore<{} | undefined> = {} as any
storeA = storeB
storeA.get()
