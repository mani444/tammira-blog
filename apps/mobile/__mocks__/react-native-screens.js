const React = require('react')

const View = ({ children }) => React.createElement('View', null, children)

module.exports = {
  Screen: View,
  ScreenContainer: View,
  NativeScreen: View,
  enableScreens: () => {},
};

