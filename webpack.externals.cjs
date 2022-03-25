const { Configuration } = require('webpack')

/**
 * @type {Configuration}
 */
module.exports = {
  module: {
    rules: [{ test: /\.eta$/, type: 'asset/source' }]
  },
  externals: {
    'node:path': {}
  },
  resolve: {
    fallback: {
      path: false,
      fs: false
    }
  }
}
