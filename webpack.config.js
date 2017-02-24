"use strict";
//const NODE_PATH="/usr/local/lib/node_modules"
const NODE_ENV = process.env.NODE_ENV || 'prod';
const Webpack = require('webpack');
const path = require('path')

console.log(NODE_ENV)
module.exports = {
  entry: {
	 app: ["./src/init.js"]
    //init:['webpack-dev-server/client',__dirname+"/src/init.js"]
  },
  output: {
   path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/",
    filename: "borispol.radar.min.js"
  },
  watch: NODE_ENV == 'dev',
  watchOptions: {
    aggregateTimeout: 100
  },
  devtool: NODE_ENV == 'dev' ? 'source-map' : false,
  plugins: [
      new Webpack.DefinePlugin({
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
  
  }

};

if(NODE_ENV=='prod'){
  module.exports.plugins.push(
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true
        
      }
    })
  )
}
