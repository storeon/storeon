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
var createStore = function (modules) {
  var events = { }
  var state = { }

  var on = function (event, cb) {
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

  var dispatch = function (event, data) {
    if (event !== '@dispatch') {
      dispatch('@dispatch', [event, data, events[event]])
    }

    if (events[event]) {
      var changes = { }
      var changed
      events[event].forEach(function (i) {
        var diff = i(state, data)
        if (diff && typeof diff.then !== 'function') {
          changed = Object.assign({ }, state, diff)
          Object.assign(changes, diff)
          state = changed
        }
      })
      if (changed) dispatch('@changed', changes)
    }
  }

  var get = function () {
    return state
  }

  var store = { dispatch: dispatch, get: get, on: on }

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
