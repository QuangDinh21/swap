// config-overrides.js
const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  // You can add various customizations here
  // For example, adding a webpack alias for cleaner imports:
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  })
);
