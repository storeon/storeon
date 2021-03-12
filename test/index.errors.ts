import { createStoreon, StoreonModule, StoreonStore, StoreonEvents } from '..'

const sym = Symbol('sym')

interface State {
  a: number
  b: string
}

interface EventsDataTypesMap extends StoreonEvents<State> {
  [sym]: string
  'comment:posting': string
  'comment:posted': number
  'comment:post': number
  'comment:error': undefined
}

const init: StoreonModule<State, EventsDataTypesMap> = store => {
  store.on('@init', () => ({ a: 0, b: '' }))
}

function setUp(store: StoreonStore<State, EventsDataTypesMap>): void {
  // THROWS Argument of type '"inc"' is not assignable to parameter of type '"@dispatch" | "@init" | "@changed" | "comment:posting" | "comment:posted" | "comment:error" | "comment:post" | unique symbol'.
  store.on('inc', (state: State) => ({ a: state.a + 1 }))
}

const store = createStoreon<State, EventsDataTypesMap>([init, setUp])

// THROWS Argument of type '"inc"' is not assignable to parameter of type '"@dispatch" | "@init" | "@changed" | "comment:posting" | "comment:posted" | "comment:error" | "comment:post" | unique symbol'.
store.dispatch('inc', 1)

// THROWS Argument of type '(state: State, data: number) => { a: number; }' is not assignable to parameter of type 'EventHandler<State, EventsDataTypesMap, unique symbol>'.
store.on(sym, (state: State, data: number) => ({ a: state.a + data }))

// THROWS Argument of type '2' is not assignable to parameter of type 'string | undefined'.
store.dispatch(sym, 2)

// THROWS Argument of type 'true' is not assignable to parameter of type 'undefined'.
store.dispatch('comment:error', true)

const state = store.get()
state.a

interface WrongModuleEvents {
  unknown: undefined
}
const init2: StoreonModule<State, WrongModuleEvents> = () => {}

// THROWS Type 'StoreonModule<State, WrongModuleEvents>' is not assignable to type 'false | StoreonModule<State, EventsDataTypesMap>'.
createStoreon<State, EventsDataTypesMap>([init2])

interface WrongModuleEvents2 {
  'comment:posting': number
}
const init3: StoreonModule<State, WrongModuleEvents2> = () => {}

// THROWS Type 'StoreonModule<State, WrongModuleEvents2>' is not assignable to type 'false | StoreonModule<State, EventsDataTypesMap>'.
createStoreon<State, EventsDataTypesMap>([init3])

// Lazy module
function postUp(store: StoreonStore<{ a: number }, { inc: string }>): void {
  store.on('inc', state => ({ a: state.a + 1 }))
}

// THROWS Argument of type 'StoreonStore<State, EventsDataTypesMap>' is not assignable to parameter of type 'StoreonStore<{ a: number; }, { inc: string; }>'.
postUp(store)

let s1: StoreonStore<{}, { a: string }> = {} as any
let s2: StoreonStore<{}, { a: string; b: number }> = {} as any

// THROWS Type 'StoreonStore<{}, { a: string; }>' is not assignable to type 'StoreonStore<{}, { a: string; b: number; }>'.
s2 = s1
s1.dispatch('a', '1')

let s3: StoreonStore<{ a: string }> = {} as any
let s4: StoreonStore<{ a: string; b: number }> = {} as any

// THROWS Type 'StoreonStore<{ a: string; }, any>' is not assignable to type 'StoreonStore<{ a: string; b: number; }, any>'.
s4 = s3

store.on('@dispatch', (_, [event, data]) => {
  // THROWS This condition will always return 'false' since the types '"@dispatch" | "@init" | "@changed" | "comment:posting" | "comment:posted" | "comment:error" | "comment:post" | unique symbol' and '"abc"' have no overlap.
  if (event === 'abc') {
    console.log(data)
  }
})

s2.get()
s3.get().a
s4.get()
