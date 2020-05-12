module.exports = options => {
  return async (req, res, next) => {
    const modelName = require('inflection').classify(req.params.resource);
    // 获取数据库分类模板  重点！！！
    req.Model = await require(`../models/${modelName}`);
    next();
  };
}
