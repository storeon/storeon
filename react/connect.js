var React = require('react')

var useStoreon = require('./hook')

/**
 * Connect React/Preact components to the store.
 *
 * @param {...string} fields List of state’s field.
 * @param {function} Component React/Preact component.
 *
 * @return {function} Wrapped component
 *
 * @example
 * import connect from 'storeon/react/connect' // or 'storeon/preact/connect'
 * const Counter = ({ count, dispatch }) => {
 *   return <div>
 *     {count}
 *     <button onClick={() => dispatch('inc')}
 *   </div>
 * }
 * export default connect('count', Counter)
 *
 * @name connect
 */
module.exports = function () {
  var keys = [].slice.call(arguments, 0, arguments.length - 1)
  var Component = arguments[arguments.length - 1]

  return function (originProps) {
    var props = useStoreon.apply(null, keys)
    for (var i in originProps) {
      if (!(i in props)) props[i] = originProps[i]
    }
    return React.createElement(Component, props)
  }
}
