import createStore, {Module, Store, StoreonEvents } from '../..'

const sym = Symbol('sym');

interface State {
    a: number
    b: string
}

interface EventsDataTypesMap extends StoreonEvents<State> {
    [sym]: string;
    'comment:posting': string;
    'comment:posted': number;
    'comment:post': number;
    'comment:error': undefined;
}

const init: Module<State, EventsDataTypesMap> = (store) => {
    store.on('@init', () => {
        return { a: 0, b: '' }
    });
};

function setUp(store: Store<State, EventsDataTypesMap>): void {
    // TestCase#1: Should not allow to handle unknown event
    // TS2345: Argument of type '"inc"' is not assignable to parameter of type '"@init" | "@changed" | "comment:post" | "comment:posting" | "comment:posted" | unique symbol'.
    store.on('inc', (state: State) => ({ a: state.a + 1 }))
}

const store = createStore<State, EventsDataTypesMap>([
    init,
    setUp
]);

// TestCase#2: Should not allow to dispatch unknown event
// TS2345: Argument of type '"inc"' is not assignable to parameter of type '"@init" | "@changed" | "comment:post" | "comment:posting" | "comment:posted" | unique symbol'.
store.dispatch('inc', 1);

// TestCase#3: Should not allow to attach handler with unsuitable data type declaration
// Argument of type '(state: State, data: number) => { a: number; }' is not assignable to parameter of type '(state: Readonly<State>, data: string) => void | Promise<void> | Partial<State> | null'.
//   Types of parameters 'data' and 'data' are incompatible.
//     Type 'string' is not assignable to type 'number'.
store.on(sym, (state: State, data: number) => ({ a: state.a + data }));

// TestCase#4 Should not allow to dispatch events with data which type is unsuitable
// Argument of type '2' is not assignable to parameter of type 'string'.
store.dispatch(sym, 2);

// TestCase#5 Should not allow to dispatch event with data on events which do not expect data
// TS2345: Argument of type 'true' is not assignable to parameter of type 'undefined'.
store.dispatch('comment:error', true);


// Lazy module
function postUp(store: Store<{a: number}, {'inc': string;}>): void {
    store.on('inc', (state) => ({ a: state.a + 1 }))
}

// TestCase#6 Should not allow to lazy apply module which is not in common with declared one
// TS2345: Argument of type 'Store<State, EventsDataTypesMap & StoreonEvents<State>>' is not assignable to parameter of type 'Store<{ a: number; }, { 'inc': string; }>'.
postUp(store);

let s1: Store<{}, {a: string}>  = {} as any;
let s2: Store<{}, {a: string, b: number}>  = {} as any;

// TestCase#7 Store with narrower events declaration should not be assignable to Store with wider events declaration
// TS2322: Type 'Store<{}, { a: string; }>' is not assignable to type 'Store<{}, { a: string; b: number; }>'.
s2 = s1;

let s3: Store<{a: string}>  = {} as any;
let s4: Store<{a: string, b: number}>  = {} as any;

// TestCase#8 Store with narrower state declaration should not be assignable to Store with wider state declaration
s4 = s3;


interface ModuleEventsOverwritesWrongly {
    'comment:posting': number;
}
const init2: Module<State, ModuleEventsOverwritesWrongly> = () => {};

// TestCase#9 Should not allow to use modules with events types declaration which for same events have a different data
// TS2322: Type 'Module<State, WrongModuleEvents>' is not assignable to type 'false | Module<State, EventsDataTypesMap>'.
const store1 = createStore<State, EventsDataTypesMap>([
    init2
]);

interface ModuleEventsUnknownEvents {
    'comment:n': undefined;
}
const init3: Module<State, ModuleEventsUnknownEvents> = () => {};

// TestCase#10 Should not allow to use modules with events types are not in common with events interface declared on Store
// TS2322: Type 'Module<State, ModuleEventsUnknownEvents>' is not assignable to type 'false | Module<State, EventsDataTypesMap>'.
// Note, probably this
const store2 = createStore<State, EventsDataTypesMap>([
    init3
]);