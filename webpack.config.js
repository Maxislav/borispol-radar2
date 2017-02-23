"use strict";
const NODE_PATH="/usr/local/lib/node_modules"
const NODE_ENV = process.env.NODE_ENV || 'prod';
const webpack = require('webpack');

console.log(NODE_ENV)
module.exports = {
  entry: {
    init:['webpack-dev-server/client',__dirname+"/src/init.js"]
  },
  output: {
    path:  "/dist/",
    filename: "borispol-radar.min.js",
    library: "vue"
  },
 
  watch: NODE_ENV == 'dev',
  watchOptions: {
    aggregateTimeout: 100
  },
  devtool: NODE_ENV == 'dev' ? 'source-map' : false,
  plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV)
      })
  ],
  module: {
    loaders:[
      {
        test: /\.js$/,
        //include: __dirname ,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      'vue$': 'vue/dist/vue.js',
      'vue-router$': 'vue-router/dist/vue-router.js'
    }
  }
  ,
  devServer: { 
    inline: true 
  }



};

if(NODE_ENV!='dev'){
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
}
