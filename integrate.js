var merge = require('./merge')

module.exports = function (h, createContext, useState, useContext, useEffect) {
  var StoreContext = createContext('Store')

  return {
    StoreContext: StoreContext,

    connect: function connect () {
      var stateToProps = arguments[0]
      if (typeof stateToProps !== 'function') {
        var args = arguments
        stateToProps = function (state) {
          var result = { }
          for (var i = 0; i < args.length; i++) {
            result[args[i]] = state[args[i]]
          }
          return result
        }
      }

      return function (Component) {
        return function (originProps) {
          var update = useState()[1]
          var store = useContext(StoreContext)
          useEffect(function () {
            return store.on('@changed', function () {
              update({ })
            })
          }, [])
          var stateProps = stateToProps(store.get())
          var props = merge(originProps, stateProps)
          props.dispatch = store.dispatch
          return h(Component, props)
        }
      }
    }
  }
}

/**
 * Connect React/Preact components to the store.
 *
 * @param {converter|...string} fields List of state’s field or function
 *                                     to map state to props.
 *
 * @return {decorator} The function to wrap component.
 *
 * @example
 * import connect from 'storeon/react' // or 'storeon/preact'
 * const Counter = ({ count, dispatch }) => {
 *   return <div>
 *     {count}
 *     <button onClick={() => dispatch('inc')}
 *   </div>
 * }
 * export default connect('count')(React.memo(Counter))
 *
 * @name connect
 * @function
 */

/**
 * @callback converter
 * @param {object} state The store state.
 * @return {object} Props for component.
 */

/**
 * @callback decorator
 * @param {function} Component React/Preact component.
 * @return {function} Wrapped component
 */
