const path = require('path');

var ROOT = path.resolve(__dirname, '..');

var root = path.join.bind(path, ROOT);

exports.root = root;