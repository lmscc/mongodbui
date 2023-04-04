### mongodb图形界面

`react` `redux` `react-router` `ant-design`

**简介**：

类似于comgodb compass，可通过ip及端口连接mongodb数据库的UI软件，可实现对数据库，集合，文档的增删改查

**技术栈**：
- 前端：react redux react-router antd axios stylus
- 后端：nodejs express mongodb 

**介绍**:
- 实现了web端和electron套壳， 通过ip地址端口连接mongodb数据库
- 数据库的增删，集合的增删，文档的条件查询及增删改
- 封装文档编辑组件，实现快速增加数组、对象、字符串等文档属性,实现对文档的增删改操作
- axios请求封装,响应拦截器统一处理异常
- 后端：通过调用babel生成ast，来遍历数据库的api转化为http接口代码，axios请求代码
