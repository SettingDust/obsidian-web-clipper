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
  resolve: {
    alias: {
      '@microsoft/recognizers-text-date-time': 'node_modules/@microsoft/recognizers-text-date-time/dist/recognizers-text-date-time.es5.js'
    }
  },
  plugins: [
    new DefinePlugin({
      'process.env.LOG_PERF': false
    })
  ]
}
