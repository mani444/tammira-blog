const React = require('react')

function createNativeStackNavigator() {
  const Navigator = ({ children }) => React.createElement('Navigator', null, children)
  const Screen = () => null
  return { Navigator, Screen }
}

module.exports = { createNativeStackNavigator }

