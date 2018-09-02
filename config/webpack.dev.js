const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const common = require('./webpack.common');

const helpers = require('./helpers');

module.exports = function (options) {
    return webpackMerge(common(options), {
        mode: 'development',
        output: {
            path: helpers.root('dist'),
            filename: '[name].[hash].js',
            chunkFilename: '[id].[hash].js',
            sourceMapFilename: '[file].map',
        },
        devtool: 'cheap-module-eval-source-map',
        //devtool: 'source-map',
        devServer: {
            open: true,
            //useLocalIp: true,
            //openPage: "",
            contentBase: './dist',
            hot: true,
            host: '0.0.0.0',
            //disableHostCheck: true,
            port: '8080',
            //hotOnly: true,
            historyApiFallback: true,
            proxy: {
                "/api": {
                    //target: "http://140.143.170.28:5000",
                    target: "http://localhost:5000",
                    //pathRewrite: { "^/api": "" }
                }
            }
        },
        module: {
            rules: [
				{
					test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
					use: [
						'@ngtools/webpack'
					],
					include: [helpers.root('src')]
				},
				{
					test: /\.(scss)$/,
					use: [
						'style-loader',
						'css-loader',
						'sass-loader'
					],
					include: [helpers.root('src', 'styles')]
				},
				{
					test: /\.(css)$/,
					use: [
						'style-loader',
						'css-loader'
					],
					include: [helpers.root('src', 'styles'),]
				},
            ]
        },
        performance: {
            hints: false
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
        ],
    });
};
