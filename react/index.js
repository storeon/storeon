let {
  useMemo,
  useContext,
  useState,
  useLayoutEffect,
  useEffect,
  createContext,
  createElement,
  forwardRef
} = require('react')

let StoreContext = createContext()

let useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

let customContext = context => (...keys) => {
  let store = useContext(context)
  if (process.env.NODE_ENV !== 'production' && !store) {
    throw new Error(
      'Could not find storeon context value.' +
        'Please ensure the component is wrapped in a <StoreContext.Provider>'
    )
  }

  let rerender = useState({})

  useIsomorphicLayoutEffect(() => {
    return store.on('@changed', (_, changed) => {
      let changesInKeys = keys.some(key => key in changed)
      if (changesInKeys) rerender[1]({})
    })
  }, [])

  return useMemo(() => {
    let state = store.get()
    let data = {}
    keys.forEach(key => {
      data[key] = state[key]
    })
    data.dispatch = store.dispatch
    return data
  }, [rerender[0]])
}

let useStoreon = customContext(StoreContext)

let connectStoreon = (...keys) => {
  let Component = keys.pop()

  return forwardRef((originProps, ref) => {
    let props = { ...originProps, ...useStoreon(...keys), ref }
    return createElement(Component, props)
  })
}

module.exports = { useStoreon, StoreContext, connectStoreon, customContext }
