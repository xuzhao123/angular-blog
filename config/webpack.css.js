const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const common = require('./webpack.common');

const helpers = require('./helpers');

module.exports = function (options) {
    return webpackMerge(common(options), {
        mode: 'production',
        output: {
            path: helpers.root('dist'),
            filename: '[name].[chunkhash].js',
            chunkFilename: '[name].[chunkhash].js',
            sourceMapFilename: '[file].map'
        },
        module: {
            rules: [
                {
                    test: /\.(scss|sass)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ],
                    include: [helpers.root('src', 'styles')]
                },
                {
                    test: /\.(css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ],
                    include: [helpers.root('src', 'styles')]
                },
                {
                    test: /\.(scss|sass)$/,
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
                    include: [helpers.root('src', 'styles')]
                },
                {
                    test: /\.(eot|svg|cur)$/,
                    loader: 'file-loader',
                    options: {
                        name: `[name].[chunkhash].[ext]`,
                        limit: 10000
                    }
                },
                {
                    test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
                    loader: 'url-loader',
                    options: {
                        name: `[name][chunkhash].[ext]`,
                        limit: 10000
                    }
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