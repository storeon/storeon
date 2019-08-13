/**
 * Print all store events to console.
 *
 * @param {Store} store The store.
 * @returns {undefined}
 *
 * @example
 * const store = createStore([
 *   process.env.NODE_ENV !== 'production' && require('storeon/devtools/logger')
 * ])
 *
 * @name logger
 * @function
 */
module.exports = function (store) {
  store.on('@dispatch', function (state, data) {
    if (data[0] === '@changed') {
      var keys = Object.keys(data[1]).join(', ')
      console.log('changed ' + keys, state)
    } else if (typeof data[1] !== 'undefined') {
      console.log('action ' + String(data[0]), data[1])
    } else {
      console.log('action ' + String(data[0]))
    }
  })
}
