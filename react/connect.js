let React = require('react')

let useStoreon = require('./')

module.exports = (...keys) => {
  let Component = keys.pop()
  return originProps => {
    let props = { ...originProps, ...useStoreon()(...keys) }
    return React.createElement(Component, props)
  }
}
