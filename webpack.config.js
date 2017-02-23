"use strict";

const NODE_ENV = process.env.NODE_ENV || 'prod';
const webpack = require('webpack');

console.log(NODE_ENV)
module.exports = {
  entry: {
    init:"./src/init.js"
  },
  output: {
    path:  "./dist/",
    filename: "borispol-radar.min.js",
    library: "vue",
    publicPath: '/'
  },
  watch: NODE_ENV == 'dev',
  watchOptions: {
    aggregateTimeout: 100
  },
  devtool: NODE_ENV == 'development' ? 'source-map' : false,
  plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV)
      })
  ]

};
