/**
 * Print all store events to console.
 *
 * @param {Store} store The store.
 * @returns {undefined}
 *
 * @example
 * import logger from 'storeon/devtools/logger'
 * const store = createStore([logger])
 *
 * @name logger
 * @function
 */
module.exports = function (store) {
  store.on('@dispatch', function (state, data) {
    if (data[0] === '@changed') {
      var keys = Object.keys(data[1]).join(', ')
      console.log('changed ' + keys, state)
    } else if (data[1]) {
      console.log('action ' + data[0], data[1])
    } else {
      console.log('action ' + data[0])
    }
  })
}
