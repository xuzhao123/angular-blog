# angular6+blog

angular6+webpack4  

用webpack4编译angualr6程序，可选择JIT编译和AOT编译，支持hrm热更新  

遇见的问题：  

  1. 在异步加载的模块中有没有加载针对于这个模块的全局样式？  

  2. 在异步模块中import的style怎么算？
    在angular中，组件的css还是跟着.shim.ngstyle.js,把所有的样式都会带上angular生成的属性标签，正常的import中，就和普通的一样，但是不能走angular的解析流程了，要把他放在全局的样式表中加载。

  3. 有没有必要加载异步的css，再需要的时候再加载，需要把这个css抽离出来吗？
    两个异步模块都加载了同一份css，这个css用抽离成公共的吗？

  4. 组件的外层html包装不能去掉吗？这样在组件间用flex布局怎么办？
  