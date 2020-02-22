let hooks = require('preact/hooks')

let StoreContext = require('./context')

let useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? hooks.useLayoutEffect : hooks.useEffect

module.exports = (...keys) => {
  let store = hooks.useContext(StoreContext)
  if (process.env.NODE_ENV !== 'production' && !store) {
    throw new Error(
      'Could not find storeon context value.' +
      'Please ensure the component is wrapped in a <StoreContext.Provider>'
    )
  }

  let rerender = hooks.useState({ })

  useIsomorphicLayoutEffect(() => {
    return store.on('@changed', (_, changed) => {
      let changesInKeys = keys.some(key => key in changed)
      if (changesInKeys) rerender[1]({ })
    })
  }, [])

  return hooks.useMemo(() => {
    let state = store.get()
    let data = { }
    keys.forEach(key => {
      data[key] = state[key]
    })
    data.dispatch = store.dispatch
    return data
  }, [rerender[0]])
}
