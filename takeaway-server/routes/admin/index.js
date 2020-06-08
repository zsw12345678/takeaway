/*
  后台管理系统接口模块
 */
const mongoose = require('mongoose');
const Category = require('../../models/Category');
const Shop = require('../../models/Shop');
const Menu = require('../../models/Menu');
const Good = require('../../models/Good');
const AdminUser = require('../../models/AdminUser');
const authMiddleware = require('../../middleware/auth');  // 验证用户是否登录
const resourceMiddleware = require('../../middleware/resource');  // 获取相应的Model
const assert = require('http-assert');
const jwt = require('jsonwebtoken');

function random (min, max, index=0) {
  if (index === 0) {
    return Math.round((Math.random() * (max - min) + min))
  } else {
    return Math.round((Math.random() * (max - min) + min) * 10) / 10
  }
}

module.exports = app => {
  const express = require("express");
  const router = express.Router({
    // 父级路由合并到子级路由
    mergeParams: true
  });

  /* 创建数据 */
  router.post('/', async (req, res) => {
    if (req.Model.modelName === 'Shop') {
      req.body.serviceScore = random(3.8, 5, 1);
      req.body.foodScore = random(3.8, 5, 1);
      req.body.score = ((req.body.serviceScore + req.body.foodScore) / 2).toFixed(1);
      req.body.rankRate = random(20, 90);
      req.body.ratingCount = random(10, 40);
      req.body.sellCount = random(30, 100);
      req.body.deliveryTime = random(10, 60);
      req.body.distance = random(50, 2000);
    }
    const data = await req.Model.create(req.body);
    res.send(JSON.stringify(data));
  });

  /* 获取列表数据 */
  router.get('/', async (req, res) => {
    // const items = await req.Model.find().populate('parent');
    // 难点！！！
    const queryOptions = {};
    const model = req.Model.modelName;
    switch (model) {
      case 'Shop':
        queryOptions.populate = { path: 'categories'};
        break;
    }
    const items = await req.Model.find().setOptions(queryOptions);
    res.send(JSON.stringify(items));
  });

  /* 获取单项详情 */
  router.get('/:id', async (req, res) => {
    const data = await req.Model.findById(req.params.id);
    res.send(JSON.stringify(data));
  });

  /* 保存编辑的单项详情 */
  router.put('/:id', async (req, res) => {
    const data = await req.Model.findByIdAndUpdate(req.params.id,req.body);
    res.send(JSON.stringify(data));
  });

  /* 删除单项信息 */
  router.delete('/:id', async (req, res) => {
    const data = await req.Model.findByIdAndDelete(req.params.id);
    res.send(JSON.stringify(data));
  });

  // 增删改查（CRUD）通用接口
  app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router);

  /* 上传图片接口 */
  const multer = require('multer');
  const { resolve } = require('path');
  const upload = multer({dest: resolve(__dirname, '/../../uploads')});
  app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
    const file = req.file;
    file.url = `http://localhost:4000/uploads/${file.filename}`;
    res.send(file);
  });

  /* 获取某 id 店铺的商品分类列表 */
  app.get('/admin/api/menus/:shopId', authMiddleware(), async (req, res) => {
    const shopId = mongoose.Types.ObjectId(req.params.shopId);
    await Menu.find({"shop_id": shopId}).exec(function (err, data) {
      if (err) {
        console.log(err);
        return
      }
      res.send(JSON.stringify(data));
    });
  });

  /* 获取某 id 店铺的纯商品列表 */
  app.get('/admin/api/goods/:shopId', authMiddleware(), async (req, res) => {
    const shopId = mongoose.Types.ObjectId(req.params.shopId);
    await Good.find({"shop_id": shopId}).populate('menu_id').exec(function (err, data) {
      if (err) {
        console.log(err);
        return
      }
      res.send(JSON.stringify(data));
    });
  });

  /* 登录后台接口 */
  app.post('/admin/api/login', async (req, res) => {
    const {username, password} = req.body;
    // 根据用户名找用户
    const user = await AdminUser.findOne({username}).select('+password');
    assert(user, 422, '用户不存在');

    // 验证密码
    const isValid = require('bcryptjs').compareSync(password, user.password);
    assert(isValid, 422, '密码错误');

    // 返回token
    const token = jwt.sign({_id: user._id}, app.get('secret'));
    res.send({token})
  });

  /* 错误处理函数 */
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
};
