const globby = require('globby');
const fs = require('fs');
const path = require('path');

const log = require('../../log');
const stat = require('./utils/promisify').stat;
const readFile = require('./utils/promisify').readFile;
const escape = require('./utils/escape');

class MarkdownWebpackPlugin {

    constructor(options = {}) {
        this.options = options;
    }

    apply(compiler) {
        log('apply');
        let options = this.options;
        let fileDependencies;
        let contextDependencies;

        /** 博客存放目录 */
        const blogPath = path.resolve(compiler.options.context, options.path);
        /** 清单地址 */
        const menifestPath = options.menifest;
        /** 打包后存放地址 */
        const toPath = options.to;

        const glob = escape(blogPath, '**/*');
        const globArgs = {
            cwd: blogPath,
            dot: true
        };

        let categorys;

        const parseCategory = (file) => {
            const { id, path } = file;
            const categoryArray = path.split('/').slice(0, -1);
            const len = categoryArray.length;

            if (len === 0) {
                categorys['其他'] = categorys['其他'] || {
                    name: '其他',
                    files: []
                };
                categorys['其他'].files.push(id);
            } else {
                categoryArray.reduce((categorys, category) => {
                    if (categorys[category] === undefined) {
                        categorys[category] = {
                            name: category,
                            files: []
                        };
                    }

                    return categorys[category];
                }, categorys).files.push(id);
            }
        };

        const emit = (compilation, callback) => {
            log('emit');
            fileDependencies = [];
            contextDependencies = [];
            categorys = {
            };

            contextDependencies.push(blogPath);

            globby(glob, globArgs).then(froms => {
                return Promise.all(
                    froms.filter(from => {
                        return /\.md/.test(from);
                    }).map((from, i) => {

                        fileDependencies.push(from);

                        const file = {
                            id: i,
                            from,
                            name: path.basename(from).split('.')[0],
                            path: path.relative(blogPath, from)
                        };

                        file.to = path.join(toPath, file.path);
                        file.category = parseCategory(file);

                        return readFile(compiler.inputFileSystem, file.from).then(content => {
                            compilation.assets[file.to] = {
                                size: function () {
                                    return content.length;
                                },
                                source: function () {
                                    return content;
                                }
                            };
                        }).then(() => {
                            return stat(fs, file.from);
                        }).then(stat => {
                            return Object.assign({}, stat, file);
                        });
                    })
                )
            }).then(blogs => {
                const data = JSON.stringify({
                    blogs,
                    categorys
                });
                compilation.assets[menifestPath] = {
                    size: function () {
                        return data.length;
                    },
                    source: function () {
                        return data;
                    }
                };
                callback();
            })
        };

        const afterEmit = (compilation, callback) => {
            log('afterEmit');
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
            compiler.plugin('run', run);
        }
    }
}

module.exports = MarkdownWebpackPlugin;