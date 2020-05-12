const path = require("path");
const express = require("express");
const app = express(); // 使用express创建app对象
app.use(require("cors")()); // 解决跨域
app.use(express.json()); // 允许express接收客户端传过来的json数据
app.use('/uploads', express.static(path.resolve(__dirname, '/uploads'))); // 静态文件托管，使其能被访问到

app.set('secret', 'jlj4j3ktj453422334');

require("./plugins/db")(app); //引入数据库
require("./routes/admin")(app); // 引入后台路由模块
require("./routes/web")(app); // 引入前台路由模块

// 监听端口
app.listen(4000, () => {
  console.log("端口号为4000的服务器启动成功");
});
