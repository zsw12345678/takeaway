/*
  后台管理系统接口模块
 */
const mongoose = require('mongoose');
const Category = require('../../models/Category');
const Shop = require('../../models/Shop');
const Menu = require('../../models/Menu');
const Good = require('../../models/Good');

module.exports = app => {
  const express = require("express");
  const router = express.Router({
    // 父级路由合并到子级路由
    mergeParams: true
  });

  /* 创建数据 */
  router.post('/', async (req, res) => {
    const data = await req.Model.create(req.body);
    console.log(data)
    res.send(JSON.stringify(data));
  });

  /* 获取列表数据 */
  router.get('/', async (req, res) => {
    // const items = await req.Model.find().populate('parent');
    // 难点！！！
    const queryOptions = {};
    const model = req.Model.modelName;
    switch (model) {
      case 'Category':
        queryOptions.populate = 'parent';
        break;
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
  app.use('/admin/api/rest/:resource', async (req, res, next) => {
    const modelName = require('inflection').classify(req.params.resource);
    // 获取数据库分类模板  重点！！！
    req.Model = await require(`../../models/${modelName}`);
    next();
  }, router);

  /* 上传图片接口 */
  const multer = require('multer');
  const { resolve } = require('path');
  const upload = multer({dest: resolve(__dirname, '/../../uploads')});
  app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    file.url = `http://localhost:4000/uploads/${file.filename}`;
    res.send(file);
  });

  /* 获取某 id 店铺的商品分类列表 */
  app.get('/admin/api/menus/:shopId', async (req, res) => {
    const shopId = mongoose.Types.ObjectId(req.params.shopId);
    await Menu.find({"shop_id": shopId}).exec(function (err, data) {
      if (err) {
        console.log(err);
        return
      }
      res.send(JSON.stringify(data));
    });
  });

  /* 获取某 id 店铺的商品列表 */
  app.get('/admin/api/goods/:shopId', async (req, res) => {
    const shopId = mongoose.Types.ObjectId(req.params.shopId);
    await Good.find({"shop_id": shopId}).populate('menu_id').exec(function (err, data) {
      if (err) {
        console.log(err);
        return
      }
      res.send(JSON.stringify(data));
    });
  })


};
