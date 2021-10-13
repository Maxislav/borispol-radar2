import * as path from 'path';
import * as Webpack from 'webpack';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const Version = require('./plugin/version.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
declare const process: any;
const getConsoleKey = (key: string): string | undefined => {
    const regexp = new RegExp('\-\-'.concat(key).concat('$'));
    const index = process.argv.findIndex((it: string) => !!it.match(regexp));
    if (index == -1) return;
    const value = process.argv[index + 1];
    if (!value || value.match(/^\-\-/)) return;
    return value
};
const mode = getConsoleKey('mode') || 'dev';
const config = {
    entry: {
        //server: ['./server/index.js'],
        app: ['./src/extend/Math.js', './src/extend/NodeFade.js', './src/extend/DateExtend.js', './src/init.js'],
        //init:['webpack-dev-server/client',__dirname+"/src/init.js"]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
        // filename: "borispol.radar.[name].[chunkhash].min.js",
        filename: 'borispol.radar.[name].min.js',
        //chunkFilename: "borispol.radar.[name].[chunkhash].min.js"
    },
    watchOptions: {
        aggregateTimeout: 100,
    },
    mode: mode == 'dev' ? 'development' : 'production',
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin(),
        new Webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(mode),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.pug'),
        }),
        new CopyWebpackPlugin([
            {
                from: './dist/img/ir',
                to: './img',
            },
            {
                from: './src/img',
                to: './img',
            },
            {
                from: './src/php',
                to: './php',
            },
            {
                from: './node_modules/three/build/three.js',
                to: './lib',
            },
            {
                from: './src/util/load-image.worker.js',
                to: './worker',
            },
            {
                from: './src/cron.sh',
            },
        ], {copyUnmodified: true}),

        new Webpack.WatchIgnorePlugin([
            path.resolve(__dirname, './src/img/'),
        ]),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            vue$: mode == 'dev' ? 'vue/dist/vue.js' : 'vue/dist/vue.min.js',
            'vue-router$': 'vue-router/dist/vue-router.js',
        },
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    // attributes: false,
                    /*preprocessor: (content: any, loaderContext: any) => {
                        return '';
                    },*/
                    //  attributes: false,
                    //  attrs: [':data-src']
                },
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [/node_modules/, /server/],
            },
           /* {
                test: /\.ts$/,
                use: 'awesome-typescript-loader',
                exclude: [/node_modules/, /server/],
            },*/
            {
                test: /\.js$/,
                //loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        //  presets: ['@babel/preset-env', "@babel/preset-stage-1"],
                        plugins: ['@babel/plugin-proposal-export-default-from',
                            '@babel/plugin-proposal-logical-assignment-operators',
                            ['@babel/plugin-proposal-optional-chaining', {loose: false}],
                            ['@babel/plugin-proposal-pipeline-operator', {proposal: 'minimal'}],
                            ['@babel/plugin-proposal-nullish-coalescing-operator', {loose: false}],
                            '@babel/plugin-proposal-do-expressions',
                            ['@babel/plugin-proposal-decorators', {legacy: true}],
                        ],
                    },
                },
            },
            {
                test: /\.jade$/,
                loader: 'jade-loader',
                query: {
                    pretty: mode == 'dev',
                },
            },
            {
                test: /\.pug/,
                loader: 'pug-loader',
                query: {
                    pretty: true,
                },
            },
            {
                test: /[^loader]\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    //limit: 10000
                },
            },
            {
                test: /\.less$/,
                use:

                    [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {auto: true},
                                importLoaders: 1,
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'less-loader',
                        },

                    ],

            },
            {
                test: /\.styl$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            importLoaders: 1,
                            sourceMap: mode === 'dev',
                        },
                    },
                    {
                        loader: 'stylus-loader',
                    },
                ],
            },
        ] as any,
    },
    devServer: {
        port: 8000,

        proxy: {
            '/ppp/**': {
                target: 'http://localhost:8085',
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/ppp': '',
                },
            },
            '/proxy-history/**': {
                target: 'http://localhost/all/borispol-radar2/dist/php/',
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/proxy\-history': '',
                },
            },
            '/upload.php': {
                target: 'http://localhost/all/borispol-radar2/src/php/upload.php',
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    'upload.php': '',
                },
            },
            '/img/ir': {
                target: 'http://localhost:8090',
            },
            '/img/vi': {
                target: 'http://localhost:8090',
            },
        },

    },
};

if (mode == 'production') {
    config.plugins.unshift(new Version({}))

}

export default config
