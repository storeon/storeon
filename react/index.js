let React = require('react')

let StoreContext = require('./context')

let useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

module.exports = () => (...keys) => {
  let store = React.useContext(StoreContext)
  if (process.env.NODE_ENV !== 'production' && !store) {
    throw new Error(
      'Could not find storeon context value.' +
      'Please ensure the component is wrapped in a <StoreContext.Provider>'
    )
  }

  let rerender = React.useState({ })

  useIsomorphicLayoutEffect(() => {
    return store.on('@changed', (_, changed) => {
      let changesInKeys = keys.some(key => key in changed)
      if (changesInKeys) rerender[1]({ })
    })
  }, [])

  return React.useMemo(() => {
    let state = store.get()
    let data = { }
    keys.forEach(key => {
      data[key] = state[key]
    })
    data.dispatch = store.dispatch
    return data
  }, [rerender[0]])
}
