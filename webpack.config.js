"use strict";
//const NODE_PATH="/usr/local/lib/node_modules"
const NODE_ENV = process.env.NODE_ENV || "production";
const Webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dateFormat = require('dateformat');

const Version = require('./plugin/version.js');
//import Version from './plugin/version.js';

//console.log('dddddddddddddddddddddddd',__dirname)
//return;

const ExtendDate = require('./src/plugin/DateExtendPlugin');

console.log(NODE_ENV);
module.exports = {
  entry: {
	 app: ["./src/extend/Math.js", "./src/extend/NodeFade.js", "./src/extend/DateExtend.js","./src/init.js"]
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
        template: path.resolve(__dirname, './index.pug')
      }),
      new CopyWebpackPlugin([
        {
          from:'./src/img',
          to:'./img'
        },
        {
          from:'./src/php',
          to:'./php'
        }
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
          pretty: NODE_ENV=='dev'
        }
      },
      {
        test: /\.pug/,
        loader: 'pug-loader',
        query: {
          pretty: NODE_ENV=='dev'
        }
      },
      {
        test: /\.styl$/, 
        loader: 'style-loader!css-loader!stylus-loader'
      },
	    {
		    test: /[^loader]\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
		    loader: 'url-loader',
		    options: {
			    //limit: 10000
		    }
	    },

     /* {test: /\.scss?$/, loaders: ['style-loader', 'css-loader', 'sass-loader']},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?mimetype=image/svg+xml'},
      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/octet-stream"},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},*/
     

    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      'vue$': NODE_ENV=='dev' ?  'vue/dist/vue.js': 'vue/dist/vue.min.js',
      'vue-router$': 'vue-router/dist/vue-router.js'
    }
  },
    devServer: {
        proxy: {
            '/ppp/**': {
                target: 'http://meteoinfo.by/radar/UKBB/',
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/ppp': ''
                }
            },
            '/proxy-history/**': {
                target: 'http://localhost/all/borispol-radar2/dist/php/',
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/proxy\-history': ''
                }
            },
            '/upload.php' : {
              target: 'http://localhost/all/borispol-radar2/src/php/upload.php',
	            secure: false,
	            changeOrigin: true,
	            pathRewrite: {
		            'upload.php': ''
	            }
            }
        }

    }

};

if(NODE_ENV=='production'){
	module.exports.plugins.unshift(new Version({}))
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
