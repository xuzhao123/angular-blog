const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const loaderUtils = require('loader-utils');

module.exports = function (content) {
    const options = loaderUtils.getOptions(this);

    this.cacheable();

    const markdown = md.render(content);
    const json = JSON.stringify(markdown)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');

    return `module.exports = ${json}`;
};