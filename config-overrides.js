// config-overrides.js
const { override, addWebpackAlias, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');
const path = require('path');

module.exports = override(
  // You can add various customizations here
  // For example, adding a webpack alias for cleaner imports:
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),
  // Ignore React Native modules that are not needed for web builds
  addWebpackPlugin(
    new webpack.IgnorePlugin({
      resourceRegExp: /^@react-native-async-storage\/async-storage$/,
    })
  )
);
