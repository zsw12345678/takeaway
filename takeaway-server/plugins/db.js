module.exports = (app) => {
  const mongoose = require("mongoose");
  mongoose.connect("mongodb://localhost:27017/takeaway", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }, function (err) {
    if (err) {
      throw err
    } else {
      console.log("数据库连接成功！！！")
    }
  })
};
