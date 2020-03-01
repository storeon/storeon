import createStore, { Module, Store, StoreonEvents } from '..';
import logger from '../devtools/logger'
import devtools from '../devtools'

const sym = Symbol('sym')

interface State {
  a: number
  b: string
}

interface EventsDataTypesMap {
  'inc': undefined;
  [sym]: number;
  'comment:posting': undefined;
  'comment:posted': object;
  'comment:error': object;
  'comment:post': string;
}

// Reducer typed as a Module
const init: Module<State, StoreonEvents<State>> = store => {
  store.on('@init', () => ({ a: 0, b: '' }))
}

// Duck-typed reducer
function setUp(store: Store<State, EventsDataTypesMap>): void {
  store.on('inc', state => ({ a: state.a + 1 }))
}

// Store
const store = createStore<State, EventsDataTypesMap>([
  init,
  setUp,
  logger,
  devtools,
  devtools(),
])

// String event dispatch
store.dispatch('inc')

// Symbolic event
store.on(sym, (state, data: number) => ({ a: state.a + data }))
store.dispatch(sym, 2)

// Async reducer
store.on('comment:post', async (_, data: string) => {
  store.dispatch('comment:posting')
  try {
    const response = await fetch('https://github.com', { body: data })
    const result: object = await response.json()
    store.dispatch('comment:posted', result)
  } catch (e) {
    store.dispatch('comment:error', e)
  }
})

store.on('@dispatch', (_, [event, data]) => {
  if (event === 'comment:post') {
    console.log(data);
  }
})

const module: Module<{a: number}, {'inc': undefined}> = (store) => {
  store.on('@dispatch', (_,[event, data]) => {
    if (event === '@changed') {
      console.log(data)
    }
  })
}
module(store);

const state = store.get()
state.a

let s1: Store<{}, {a: string}>  = {} as any
let s2: Store<{}, {a: string, b: number}>  = {} as any

// Store with wider events declaration should be assignable to Store with narrower events declaration
s1 = s2
s1.dispatch('a', '1')

let s3: Store<{a: string}>  = {} as any
let s4: Store<{a: string, b: number}>  = {} as any

// Store with wider state declaration should be assignable to Store with narrower store declaration
s3 = s4
s3.get().a
