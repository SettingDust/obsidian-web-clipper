const { Configuration, DefinePlugin } = require('webpack')

/**
 * @type {Configuration}
 */
module.exports = {
  module: {
    rules: [{ test: /\.template$/, type: 'asset/source' }]
  },
  externals: {
    'node:path': {}
  },
  experiments: {
    topLevelAwait: true
  },
  plugins: [
    new DefinePlugin({
      'process.env.LOG_PERF': false
    })
  ]
}
