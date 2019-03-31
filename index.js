/**
 * Initialize new store and apply all modules to the store.
 *
 * @param {moduleInitializer[]} modules Functions which will set initial state
 *                                      define reducer and subscribe
 *                                      to all system events.
 *
 * @return {Store} The new store.
 *
 * @example
 * import createStore from 'storeon'
 * let increment = store => {
 *   store.on('@init', () => ({ count: 0 }))
 *   store.on('inc', ({ count }) => ({ count: count + 1 }))
 * }
 * const store = createStore([increment])
 * store.get().count //=> 0
 * store.dispatch('inc')
 * store.get().count //=> 1
 */
function createStore (modules) {
  var events = { }
  var state = { }

  function on (event, cb) {
    if (!events[event]) {
      events[event] = [cb]
    } else {
      events[event].push(cb)
    }
    return function () {
      events[event] = events[event].filter(function (i) {
        return i !== cb
      })
    }
  }

  function dispatch (event, data) {
    if (event !== '@dispatch') {
      dispatch('@dispatch', [event, data])
    }

    if (process.env.NODE_ENV !== 'production') {
      if (event.indexOf('@') !== 0 && !events[event]) {
        throw new Error('Unknown Storeon event ' + event)
      }
    }

    if (events[event]) {
      var changes = { }
      var changed, key
      events[event].forEach(function (i) {
        var diff = i(state, data)
        if (diff) {
          var newState = { }
          for (key in state) newState[key] = state[key]
          for (key in diff) {
            changed = true
            newState[key] = changes[key] = diff[key]
          }
          state = newState
        }
      })

      if (changed) dispatch('@changed', changes)
    }
  }

  function get () {
    return state
  }

  var store = { on: on, dispatch: dispatch, get: get }

  modules.forEach(function (i) {
    if (i) i(store)
  })
  dispatch('@init')

  return store
}

module.exports = createStore

/**
 * Store with application state and event listeners.
 *
 * @name Store
 * @class
 */
/**
 * Return current state. You can use this method only to read state.
 * Any state changes should be in event listeners.
 *
 * @return {object} The current state.
 *
 * @name get
 * @function
 * @memberof Store#
 */
/**
 * Emit event.
 *
 * @param {string} event The event name.
 * @param {*} [data] Any additional data for the event.
 *
 * @return {object} The current state.
 *
 * @name dispatch
 * @function
 * @memberof Store#
 */
/**
 * Add event listener.
 *
 * @param {string} event The event name.
 * @param {listener} listener The event listener.
 *
 * @return {function} The function to remove listener.
 *
 * @name on
 * @function
 * @memberof Store#
 */

/**
 * @callback moduleInitializer
 * @param {Store} store Store to define initial state and reducers.
 */

/**
 * @callback listener
 * @param {object} state The current state of the store.
 * @param {*} [data] The event data if it was passed.
 * @return {object|undefined} Changes for next state.
 */
