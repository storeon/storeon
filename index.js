let createStoreon = modules => {
  let events = {}
  let state = {}

  let store = {
    dispatch (event, data) {
      if (event !== '@dispatch') {
        store.dispatch('@dispatch', [event, data, events[event]])
      }

      if (events[event]) {
        let changes = {}
        let changed
        events[event].forEach(i => {
          let diff = events[event].includes(i) && i(state, data, store)
          if (diff && typeof diff.then !== 'function') {
            changed = state = { ...state, ...diff }
            changes = { ...changes, ...diff }
          }
        })
        if (changed) store.dispatch('@changed', changes)
      }
    },

    get: () => state,

    on (event, cb) {
      ;(events[event] || (events[event] = [])).push(cb)

      return () => {
        events[event] = events[event].filter(i => i !== cb)
      }
    }
  }

  modules.forEach(i => {
    if (i) i(store)
  })
  store.dispatch('@init')

  return store
}

module.exports = { createStoreon }
