let Preact = require('preact')

let useStoreon = require('./')

module.exports = (...keys) => {
  let Component = keys.pop()
  return originProps => {
    let props = { ...originProps, ...useStoreon(...keys) }
    return Preact.h(Component, props)
  }
}
