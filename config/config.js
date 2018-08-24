const config = {
    blog: {
        enable: false,
        blogPath: './src/blogs',
        blogTo: 'blogs',
        blogMenifest: 'blog.json'
    }
};

const dev = {};
const prod = {};

module.exports = function (isProd) {
    return Object.assign({}, config, isProd ? prod : dev);
};
