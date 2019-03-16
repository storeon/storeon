var React = require('react')

var integrate = require('./integrate')

module.exports = integrate(
  React.createElement,
  React.createContext,
  React.useState,
  React.useContext,
  React.useEffect
)
