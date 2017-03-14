"use strict";
//const NODE_PATH="/usr/local/lib/node_modules"
const NODE_ENV = process.env.NODE_ENV || 'prod';
const Webpack = require('webpack');
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

console.log(NODE_ENV)
module.exports = {
  entry: {
	 app: ["./src/init.js"]
    //init:['webpack-dev-server/client',__dirname+"/src/init.js"]
  },
  output: {
   path: path.resolve(__dirname, "dist"),
    publicPath: "",
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
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './index.jade')
      }),
      new CopyWebpackPlugin([
        {
          from:'./src/img',
          to:'./img'
        },
        {
          from:'./php',
          to:'./php'
        },

      ])
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-1'],
	        cacheDirectory: true,
	        plugins: ['transform-decorators-legacy' ],
        }


      },
      {
        test: /\.jade$/,
        loader: 'jade-loader',
        query: {
          pretty: true
        }
      },
      {
        test: /\.styl$/, 
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {test: /\.scss?$/, loaders: ['style-loader', 'css-loader', 'sass-loader']},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?mimetype=image/svg+xml'},
      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/octet-stream"},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
     

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
        drop_console: false,
        unsafe: true
        
      }
    })
  )
}
