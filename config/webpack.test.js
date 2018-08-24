const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MarkdownWebpackPlugin = require('./plugins/markdown-webpack-plugin');
const VirtualModulePlugin = require('virtual-module-webpack-plugin');

const helpers = require('./helpers');
const config = require('./config');
console.log(config)


module.exports = function (options) {
    return {
        mode: 'development',
        entry: {
            test: './src/test'
        },
        devServer: {
            open: false,
            contentBase: './dist',
            // hot: true,
            // //hotOnly: true,
            // historyApiFallback: true
        },
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: '[name].js',
            // or whatever other format you want
            chunkFilename: '[name].[id].js',
        },
        //devtool: 'source-map',
        resolve: {
            extensions: ['.ts', '.js'],
            modules: [helpers.root('src'), helpers.root('node_modules')],
        },
        module: {
        },
        plugins: [
            new MarkdownWebpackPlugin({
                path: config.blogPath,
                to: config.blogTo,
                menifest: config.blogMenifest
            })
            // new VirtualModulePlugin({
            //     moduleName: 'src/mysettings.json',
            //     contents: JSON.stringify({ greeting: 'Hello!' })
            // })
        ]
    }
}