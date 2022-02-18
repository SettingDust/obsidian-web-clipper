const {Configuration} = require("webpack");
/**
 * @type {Configuration}
 */
module.exports = {
  externals: {
    "node:path": {}
  },
  resolve: {
    fallback: {
      tty: false
    }
  }
}
