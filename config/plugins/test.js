const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
} = require("tapable");

class Order {
    constructor() {
        this.hooks = { //hooks
            goods: new SyncHook(['goodsId', 'number']),
            consumer: new AsyncParallelHook(['userId', 'orderId'])
        }
    }

    queryGoods(goodsId, number) {
        this.hooks.goods.call(goodsId, number);
    }

    consumerInfoPromise(userId, orderId) {
        this.hooks.consumer.promise(userId, orderId).then(() => {
            return 'promise' + userId
        })
    }

    consumerInfoAsync(userId, orderId) {
        this.hooks.consumer.callAsync(userId, orderId, (err, data) => {
            return 'async' + userId;
        })
    }
}

const order = new Order();

order.hooks.goods.tap('QueryPlugin', (goods, number) => {
    console.log(goods, number);
});

order.queryGoods('1', '2');

// 注册一个sync 钩子
order.hooks.consumer.tap('LoggerPlugin', (userId, orderId) => {
    console.log(userId, orderId);
})

order.hooks.consumer.tapAsync('LoginCheckPlugin', (userId, orderId, callback) => {
    console.log(userId, orderId);
    callback()
})

order.hooks.consumer.tapPromise('PayPlugin', (userId, orderId) => {
    console.log(userId, orderId);
    return Promise.resolve(userId);
})

// 调用
// 返回Promise
order.consumerInfoPromise('user007', '1024');

//回调函数
//order.consumerInfoAsync('user007', '1024')

