const { Configuration } = require('webpack')

/**
 * @type {Configuration}
 */
module.exports = {
  module: {
    rules: [{ test: /\.template$/, type: 'asset/source' }]
  },
  externals: {
    'node:path': {}
  }
}
