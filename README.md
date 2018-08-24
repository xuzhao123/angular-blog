# angular6+blog

angular6+webpack4  

用webpack4编译angualr6程序，开发环境下为JIT编译，生产环境下为AOT编译，支持hrm热更新，暂不支持ssr（ssr需要用node作为后端渲染用angular-cli构建）。

支持持续集成，提交代码时由travis自动拉取代码，测试通过后登陆远程服务器执行构建。
