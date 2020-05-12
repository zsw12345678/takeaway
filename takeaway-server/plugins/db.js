module.exports = (app) => {
  const mongoose = require("mongoose");
  mongoose.connect("mongodb://localhost:27017/takeaway", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }, function (err) {
    if (err) {
      throw err
    } else {
      console.log("数据库连接成功！！！")
    }
  });

  require('require-all')(__dirname + '/../models') // 引入所有模型
};
