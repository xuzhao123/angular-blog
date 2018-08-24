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
        const menifestPath = path.resolve(compiler.options.context, options.menifest);
        /** 打包后存放地址 */
        const toPath = options.to;

        const glob = escape(blogPath, '**/*');
        const globArgs = {
            cwd: blogPath,
            dot: true
        };

        const files = [];
        const categorys = {
        };

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

        const run = () => {
            log('run');
            fileDependencies = [];
            contextDependencies = [];

            contextDependencies.push(blogPath);

            globby(glob, globArgs).then(froms => {
                return Promise.all(
                    froms.map((from, i) => {

                        fileDependencies.push(from);

                        const file = {
                            id: i,
                            from,
                            name: path.basename(from).split('.')[0],
                            path: path.relative(blogPath, from)
                        };
                        files.push(file);

                        file.to = path.join(toPath, file.path);
                        file.category = parseCategory(file);

                        return stat(fs, from)
                            .then(stat => {
                                return Object.assign({}, stat, file);
                            });
                    })
                )
            }).then(blogs => {
                const data = {
                    blogs,
                    categorys
                };
                fs.writeFileSync(menifestPath, JSON.stringify(data));
                log('写入json');
            })
        };

        const emit = (compilation, callback) => {
            log('emit');
            const inputFileSystem = compiler.inputFileSystem;

            Promise.all(
                files.map(file => {
                    return readFile(inputFileSystem, file.from).then(content => {
                        compilation.assets[file.to] = {
                            size: function () {
                                return content.length;
                            },
                            source: function () {
                                return content;
                            }
                        };
                    });
                })
            ).then(() => {
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

            compiler.hooks.environment.tap(plugin, run);

            compiler.hooks.emit.tapAsync(plugin, emit);

            compiler.hooks.afterEmit.tapAsync(plugin, afterEmit);
        } else {
            compiler.plugin('run', run);
        }
    }
}

module.exports = MarkdownWebpackPlugin;