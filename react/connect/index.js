let { createElement } = require('react')

let useStoreon = require('../')

module.exports = (...keys) => {
  let Component = keys.pop()
  return originProps => {
    let props = { ...originProps, ...useStoreon(...keys) }
    return createElement(Component, props)
  }
}
