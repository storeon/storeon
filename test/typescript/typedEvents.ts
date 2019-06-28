import createStore, {Module, Store, StoreonEvents } from '../..'
import logger from '../../devtools/logger'
import loggerBrowser from '../../devtools/logger.browser'
import devtools from '../../devtools'


const sym = Symbol('sym');

interface State {
    a: number
    b: string
}

interface EventsDataTypesMap extends StoreonEvents<State> {
    'inc': undefined;
    [sym]: number;
    'comment:posting': undefined;
    'comment:posted': object;
    'comment:error': object;
    'comment:post': string;
}

// Reducer typed as a Module
const init: Module<State, EventsDataTypesMap> = (store) => {
    store.on('@init', () => {
        return { a: 0, b: '' }
    })
};

// Duck-typed reducer
function setUp(store: Store<State, EventsDataTypesMap>): void {
    store.on('inc', (state) => ({ a: state.a + 1 }))
}

// Store
const store = createStore<State, EventsDataTypesMap>([
    init,
    setUp,
    logger,
    loggerBrowser,
    devtools,
    devtools(),
]);

// String event dispatch
store.dispatch('inc');

// Symbolic event
store.on(sym, (state, data: number) => ({ a: state.a + data }));
store.dispatch(sym, 2);

// Async reducer
store.on('comment:post', async (_, data: string) => {
    store.dispatch('comment:posting');

    try {
        const response = await fetch('https://github.com', {
            body: data
        });

        const result: object = await response.json();
        store.dispatch('comment:posted', result)
    } catch (e) {
        store.dispatch('comment:error', e)
    }
});

const state = store.get();
state.a;