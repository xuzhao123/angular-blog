switch (process.env.NODE_ENV) {
    case 'test':
        module.exports = require('./config/webpack.test.js')({ env: 'test' });
        break;
    case 'prod':
    case 'production':
        module.exports = require('./config/webpack.prod.js')({ env: 'production' });
        break;
    case 'dev':
    case 'development':
    default:
        module.exports = require('./config/webpack.dev.js')({ env: 'development' });
}
