const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackAssetsInjectPlugin  = require('./plugins/HtmlWebpackAssetsInjectPlugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const package = require('../package.json');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: '../dist',
        hot: true,
        host: 'localhost'  // 如果希望服务器外部可访问，请设为 0.0.0.0
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'AST Helper',
            template: './src/template.html',
            filename: './index.html',
            inject: 'body',
            minify: false
        }),
        new HtmlWebpackAssetsInjectPlugin(package.externals),
        new VueLoaderPlugin()
    ]
});
