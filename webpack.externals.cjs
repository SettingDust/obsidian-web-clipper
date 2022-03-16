const {Configuration} = require("webpack");
const path = require("path");

/**
 * @type {Configuration}
 */
module.exports = {
  entry: {
    'content-script': [path.resolve(__dirname, 'src/content-scripts/index.ts')]
  },
  externals: {
    "node:path": {}
  }
}
