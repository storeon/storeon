var Preact = require('preact')
var hooks = require('preact/hooks')

var integrate = require('./integrate')

module.exports = integrate(
  Preact.h,
  Preact.createContext,
  hooks.useState,
  hooks.useContext,
  hooks.useEffect
)
