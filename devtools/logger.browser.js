var STYLE = 'color: #008100'
var BOLD = 'color: #008100; font-weight: bold'

module.exports = function (store) {
  store.on('@dispatch', function (state, data) {
    if (data[0] === '@changed') {
      var keys = Object.keys(data[1]).join(', ')
      console.log('%cchanged %c' + keys, STYLE, BOLD, state)
    } else if (data[1]) {
      console.log('%caction %c' + data[0], STYLE, BOLD, data[1])
    } else {
      console.log('%caction %c' + data[0], STYLE, BOLD)
    }
  })
}
