const globby = require('globby');
const fs = require('fs');
const path = require('path');
const { ConcatSource } = require("webpack-sources");

const stat = require('./utils/promisify').stat;
const readFile = require('./utils/promisify').readFile;
const escape = require('./utils/escape');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

class MarkdownWebpackPlugin {

    constructor(options = {}) {
        this.options = options;
        this.name = options.name || 'blog.json';
    }

    apply(compiler) {
        let options = this.options;
        let name = this.name;
        let fileDependencies;
        let contextDependencies;

        const emit = (compilation, callback) => {
            const inputFileSystem = compiler.inputFileSystem;

            fileDependencies = [];
            contextDependencies = [];

            const pattern = {
                from: options.path
            };
            pattern.absoluteFrom = path.resolve(compiler.options.context, pattern.from);
            pattern.glob = escape(pattern.absoluteFrom, '**/*');
            pattern.context = pattern.absoluteFrom;

            contextDependencies.push(pattern.absoluteFrom);

            const globArgs = {
                cwd: pattern.context,
                dot: true
            }

            globby(pattern.glob, globArgs).then((paths) => {
                return Promise.all(
                    paths.map(from => {

                        if (!/\.md$/.test(from)) {
                            return Promise.resolve();
                        }

                        const file = {
                            absoluteFrom: from,
                            to: options.to
                        };

                        file.relativeFrom = path.relative(pattern.context, file.absoluteFrom);
                        file.webpackTo = path.join(file.to, file.relativeFrom);

                        file.webpackTo = file.webpackTo.replace(/\.md$/, '.html');
                        file.url = file.webpackTo;

                        fileDependencies.push(file.absoluteFrom);

                        return readFile(inputFileSystem, file.absoluteFrom).then(content => {
                            const markdown = md.render(content.toString());
                            compilation.assets[file.webpackTo] = {
                                size: function () {
                                    return markdown.length;
                                },
                                source: function () {
                                    return markdown;
                                }
                            };

                            return stat(fs, file.absoluteFrom).then(stat => {
                                console.log(stat);
                                return Object.assign({}, stat, file)
                            })
                        });
                    })
                )
            }).then(files => {
                const assetFile = JSON.stringify(files);
                

                compilation.assets[name] = {
                    size: function () {
                        return assetFile.length;
                    },
                    source: function () {
                        return assetFile;
                    }
                };
            }).then(() => {
                callback();
            })
        };

        const afterEmit = (compilation, callback) => {
            let compilationFileDependencies;
            let addFileDependency;
            if (Array.isArray(compilation.fileDependencies)) {
                compilationFileDependencies = new Set(compilation.fileDependencies);
                addFileDependency = (file) => compilation.fileDependencies.push(file);
            } else {
                compilationFileDependencies = compilation.fileDependencies;
                addFileDependency = (file) => compilation.fileDependencies.add(file);
            }

            let compilationContextDependencies;
            let addContextDependency;
            if (Array.isArray(compilation.contextDependencies)) {
                compilationContextDependencies = new Set(compilation.contextDependencies);
                addContextDependency = (file) => compilation.contextDependencies.push(file);
            } else {
                compilationContextDependencies = compilation.contextDependencies;
                addContextDependency = (file) => compilation.contextDependencies.add(file);
            }

            // Add file dependencies if they're not already tracked
            for (const file of fileDependencies) {
                if (compilationFileDependencies.has(file)) {
                } else {
                    addFileDependency(file);
                }
            }
            // Add context dependencies if they're not already tracked
            for (const context of contextDependencies) {
                if (compilationContextDependencies.has(context)) {
                } else {
                    addContextDependency(context);
                }
            }

            callback();
        }



        if (compiler.hooks) {
            const plugin = { name: 'MarksownPlugin' };

            compiler.hooks.emit.tapAsync(plugin, emit);
            compiler.hooks.afterEmit.tapAsync(plugin, afterEmit);
        } else {
            compiler.plugin('emit', emit);
            compiler.plugin('afterEmit', afterEmit);
        }
    }
}

module.exports = MarkdownWebpackPlugin;