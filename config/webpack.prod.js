const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const helpers = require('./helpers');

module.exports = function (options) {
	return webpackMerge(common(options), {
		mode: 'production',
		output: {
			publicPath: '/',
			path: helpers.root('dist'),
			filename: '[name].[chunkhash].js',
			chunkFilename: '[name].[chunkhash].js',
			sourceMapFilename: '[file].map'
		},
		module: {
			rules: [
				{
					test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
					use: [
						// {
						// 	loader: '@angular-devkit/build-optimizer/webpack-loader',
						// 	options: {
						// 		sourceMap: false
						// 	}
						// },
						'@ngtools/webpack'
					],
					include: [helpers.root('src')]
				},
				// {
				// 	test: /\.js$/,
				// 	use: [
				// 		{
				// 			loader: '@angular-devkit/build-optimizer/webpack-loader',
				// 			options: {
				// 				sourceMap: false
				// 			}
				// 		}
				// 	],
				// 	include: [helpers.root('src')]
				// },
				{
					test: /\.(scss|sass)$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						'postcss-loader',
						'sass-loader'
					],
					include: [helpers.root('src', 'styles')]
				},
				{
					test: /\.(css)$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						'postcss-loader'
					],
					include: [helpers.root('src', 'styles')]
				},
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'css/[name].[contenthash].css',
				chunkFilename: 'css/[name].[contenthash].css'
			})
		]
	});
};
