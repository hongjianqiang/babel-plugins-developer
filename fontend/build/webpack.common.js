const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');
const utils = require('./utils');

const resolve = (dir) => path.join(__dirname, '..', dir);

module.exports = {
    entry: {
        app: './src/main.js'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.js$/,
            exclude: file => (
                /node_modules/.test(file) &&
                /bower_components/.test(file) &&
                !/\.vue\.js/.test(file)
            ),
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.css$/,
            use: [
                'vue-style-loader',
                {
                    loader: 'css-loader',
                    options: { importLoaders: 1 }
                },
                'postcss-loader'
            ]
        }, {
            test: /\.scss$/,
            use: [
                'vue-style-loader',
                'css-loader',
                'sass-loader'
            ]
        }, {
            test: /\.sass$/,
            use: [
                'vue-style-loader',
                'css-loader', {
                loader: 'sass-loader',
                    options: {
                        indentedSyntax: true
                    }
                }
            ]
        }, {
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {}
                }
            ]
        }]
    },
    plugins: [
        new CopyWebpackPlugin([{ from: 'static', to: 'static' }]),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/'
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js',
            '@': resolve('src')
        }
    },
    externals: utils.externals()
};
