const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ngToolsWebpack = require('@ngtools/webpack');

const MarkdownWebpackPlugin = require('./plugins/markdown-webpack-plugin');

const helpers = require('./helpers');

module.exports = function (options = {}) {
	const isProd = options.env === 'production';
	const config = require('./config')(isProd);
	const { blog } = config;

	const angularCompilerPluginOptions = {
		tsConfigPath: helpers.root('src/tsconfig.app.json'),
		entryModule: helpers.root('src/app/app.module#AppModule'),
		skipCodeGeneration: !isProd,
		//skipCodeGeneration: true,
		sourceMap: true
	};

	if (isProd) {
		angularCompilerPluginOptions.hostReplacementPaths = {
			[helpers.root('src/environments/environment.ts')]: helpers.root('src/environments/environment.prod.ts')
		}
	}

	const plugins = [];

	plugins.push(new ngToolsWebpack.AngularCompilerPlugin(angularCompilerPluginOptions));

	if (blog.enable) {
		plugins.push(
			new MarkdownWebpackPlugin({
				path: blog.blogPath,
				to: blog.blogTo,
				menifest: blog.blogMenifest
			})
		)
	}

	return {
		entry: {
			polyfills: './src/polyfills',
			main: './src/main',
		},
		resolve: {
			extensions: ['.ts', '.js'],
			modules: [helpers.root('src'), helpers.root('node_modules')],
			alias: {
				styles: helpers.root('src', 'styles'),
				blogs: helpers.root('src', 'blogs')
			}
		},
		resolveLoader: {
			modules: ['node_modules', 'config/loaders']
		},
		module: {
			rules: [
				{
					// Mark files inside `@angular/core` as using SystemJS style dynamic imports.
					// Removing this will cause deprecation warnings to appear.
					test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
					parser: { system: true },
				},
				{
					test: /\.css$/,
					use: ['to-string-loader', 'css-loader'],
					include: [helpers.root('src', 'app')]
				},
				{
					test: /\.scss$/,
					use: ['to-string-loader', 'css-loader', 'sass-loader'],
					include: [helpers.root('src', 'app')]
				},
				{
					test: /\.html$/,
					use: 'raw-loader'
				},
				{
					test: /\.(eot|svg|cur|otf|ttf|woff|woff2|ani)$/,
					loader: 'file-loader',
					options: {
						name: 'fonts/[name].[hash:8].[ext]',
						limit: 1024
					}
				},
				{
					test: /\.(jpg|png|webp|gif)$/,
					loader: 'url-loader',
					options: {
						name: 'img/[name].[hash:8].[ext]',
						limit: 1024
					}
				},
				{
					test: /\.md$/,
					use: [
						'markdown-loader.js'
					]
				}
			]
		},
		plugins: [
			new webpack.HashedModuleIdsPlugin(),
			new webpack.DefinePlugin({
				BLOG_MENIFEST: JSON.stringify(blog.blogMenifest),
				BLOG_TO: JSON.stringify(blog.blogTo)
			}),
			new HtmlWebpackPlugin({
				template: 'src/index.html',
				chunksSortMode: function (a, b) {
					const entryPoints = ['inline', 'polyfills', 'runtime','sw-register', 'styles', 'vendor', 'main'];
					console.log(a.names[0],b.names[0])
					return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
				},
			}),
			new CopyWebpackPlugin(
				[
					{ from: 'src/assets', to: 'assets' },
				]
			),
			...plugins
		],
		optimization: {
			runtimeChunk: {
				name: 'runtime'
			},
			splitChunks: {
				cacheGroups: {
					module: {
						test: /[\\/]node_modules[\\/]/,
						test: (module, chunks) => {
							const moduleName = module.nameForCondition ? module.nameForCondition() : '';
							return /[\\/]node_modules[\\/]/.test(moduleName)
								&& !chunks.some(({ name }) => name === 'polyfills')
								&& !/\.(css|scss)$/.test(moduleName)
						},
						name: "vendors",
						chunks: "all"
					},
					commons: {
						name: "commons",
						chunks: "all",
						minChunks: 2
					},
					// styles: {
					// 	name: 'styles',
					// 	test: /.(scss|css)$/,
					// 	chunks: 'all',
					// 	minChunks: 1,
					// 	reuseExistingChunk: true,
					// 	enforce: true
					// }
				}
			}
		},
	};
};



