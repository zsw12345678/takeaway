/*
  后台管理系统接口模块
 */
const mongoose = require('mongoose');
const sms_util = require('../../util/sms_util');
const svgCaptcha = require('svg-captcha');
const assert = require('http-assert');
const jwt = require('jsonwebtoken');
const users = {};
let captcha_text = '';
const WebUser = require('../../models/WebUser');
const Shop = require('../../models/Shop');
const Address = require('../../models/Address');
const Menu = require('../../models/Menu');
const Good = require('../../models/Good');
const Order = require('../../models/Order');

module.exports = app => {
  const express = require("express");
  const router = express.Router({
    // 父级路由合并到子级路由
    mergeParams: true
  });

  // 发送验证码短信
  router.get('/sendcode', async (req, res, next) => {
    //1. 获取请求参数数据
    const phone = req.query.phone;
    //生成验证码(6位随机数)
    const code = sms_util.randomCode(6);
    //发送给指定的手机号
    await sms_util.sendCode(phone, code, function (success) {//success表示是否成功
      if (success) {
        users[phone] = code;
        console.log('保存验证码: ', phone, code);
        res.send({"code": 200})
      } else {
        //3. 返回响应数据
        res.send({"code": 422, msg: '短信验证码发送失败'})
      }
    })
  });

  // 短信登陆
  router.post('/login_sms', async (req, res, next) => {
    const phone = req.body.phone;
    const code = req.body.code;
    console.log('/login_sms', phone, code, "短信登录");
    if (users[phone] !== code) {
      res.send({code: 422, msg: '手机号或验证码不正确'});
      return;
    }
    //删除保存的code
    delete users[phone];
    let token = '';
    await WebUser.findOne({phone}, async (err, user) => {
      if (user) {
        token = jwt.sign({_id: user._id}, app.get('secret'));
      } else {
        //存储数据
        user = await WebUser.create({phone});
        token = jwt.sign({_id: user._id}, app.get('secret'));
      }
      if (token) {
        res.send({code:200, msg:'登录成功', token:token, data:user})
      }
    })
  });

  // 一次性图形验证码
  router.get('/captcha', async (req, res) => {
    const captcha = await svgCaptcha.create({
      ignoreChars: '0o1l',
      noise: 2,
      color: true
    });
    captcha_text = captcha.text.toLowerCase();
    res.type('svg');
    res.send(captcha.data);
  });

  // 密码登陆
  router.post('/login_pwd', async (req, res) => {
    const username = req.body.name;
    const password = req.body.pwd;
    const cap = req.body.captcha.toLowerCase();

    // 可以对用户名/密码格式进行检查, 如果非法, 返回提示信息
    if(cap !== captcha_text) {
      return res.send({code: 422, msg: '验证码不正确'})
    }
    // 删除保存的验证码
    captcha_text = '';

    let user = await WebUser.findOne({username});
    if (user) {
      // 验证密码
      const isValid = require('bcryptjs').compareSync(password, user.password);
      if (isValid) {
        // 返回用户数据
        const token = jwt.sign({_id: user._id}, app.get('secret'));
        res.send({code:200, msg:'登录成功！', token:token, data:user})
      } else {
        res.send({code: 422, msg: '密码错误！'})
      }
    } else {
      res.send({code: 423})
    }
  });

  // 修改用户信息
  router.post('/set_info', async (req, res) => {
    const data = await WebUser.findByIdAndUpdate(req.body._id,req.body);
    res.send({code: 200, data: data});
  });

  // 根据用户id查找用户信息
  router.get('/userinfo/:user_id', async (req, res) => {
    const user_id = mongoose.Types.ObjectId(req.params.user_id);
    await WebUser.find({"_id": user_id}).exec(function (err, data) {
      if (err) {
        console.log(err);
        return
      }
      res.send({code: 200, data: data});
    });
  });

  // 新增地址
  router.post('/add_address', async (req, res) => {
    const data = await Address.create(req.body);
    res.send({code: 200, data: data});
  });

  // 编辑地址
  router.post('/edit_address/:id', async (req, res) => {
    const data = await Address.findByIdAndUpdate(req.params.id, req.body);
    res.send({code: 200, data: data});
  });

  // 删除地址
  router.get('/delete_address/:id', async (req, res) => {
    const data = await Address.findByIdAndDelete(req.params.id);
    res.send({code: 200, data: data});
  });

  // 查找地址列表
  app.get('/address_list/:user_id', async (req, res) => {
    const user_id = mongoose.Types.ObjectId(req.params.user_id);
    await Address.find({"user_id": user_id}).exec(function (err, data) {
      if (err) {
        console.log(err);
        return
      }
      res.send({code: 200, data: data});
    });
  });

  // 根据地址id查找地址
  app.get('/address_detail/:address_id', async (req, res) => {
    const address_id = mongoose.Types.ObjectId(req.params.address_id);
    await Address.find({"_id": address_id}).exec(function (err, data) {
      if (err) {
        console.log(err);
        return
      }
      res.send({code: 200, data: data});
    });
  });

  // 获取店铺列表
  app.get('/shops_list', async (req, res) => {
    await Shop.find().exec(function (err, data) {
      if (err) {
        console.log(err);
        return
      }
      res.send({code: 200, data: data});
    });
  });

  /*  获取某 id 店铺的商家数据 */
  app.get('/shop_info/:shopId', async (req, res) => {
    const shopId = mongoose.Types.ObjectId(req.params.shopId);
    await Shop.find({"_id": shopId}).populate('categories').exec(function (err, data) {
      if (err) {
        console.log(err);
        return
      }
      res.send({code: 200, data: data});
    });
  });

  /*  获取某 id 店铺的菜单数据 */
  app.get('/menu_list/:shopId', async (req, res) => {
    const shop_id = mongoose.Types.ObjectId(req.params.shopId);
    await Menu.find({shop_id}).exec(async (err, data) => {
      if (err) {
        console.log(err);
        return
      } else if (!data) {
        res.send({code: 200, msg: '暂无数据', data: data});
      } else {
        const menus = data;
        await Good.find({shop_id}).populate('menu_id').exec(async (err, data) => {
          if (err) {
            console.log(err);
            return
          } else if (!data) {
            res.send({code: 200, msg: '暂无数据', data: data});
          } else {
            const goods = data;
            menus.forEach((item, index) => {
              item.foods = new Array();
              goods.forEach((good) => {
                for (let i = 0; i < good.menu_id.length; i++) {
                  if (item.name === good.menu_id[i].name) {
                    item.foods.push({
                      _id: good._id,
                      name: good.name,
                      icon: good.icon,
                      price: good.price,
                      oldPrice: good.oldPrice,
                      info: good.info
                    });
                    continue;
                  }
                }
              })
            })
            res.send({code: 200, data: menus});
          }
        });
      }
    });
  });

  /*  获取某 id 店铺的商品数据 */
  app.get('/good_list/:shopId', async (req, res) => {
    const shop_id = mongoose.Types.ObjectId(req.params.shopId);
    await Good.find({shop_id}).populate('menu_id').exec(async (err, data) => {
      if (err) {
        console.log(err);
        return
      }
      res.send({code: 200, data: data});
    });
  });

  /*  生成订单 */
  app.post('/create_order', async (req, res) => {
      req.body.create_time = Date.parse(new Date())
      if (req.body.status) {
        req.body.pay_time = Date.parse(new Date())
        req.body.has_commen = true;
      }
      const data = await Order.create(req.body)
      res.send({code: 200, msg: '生成订单成功', data: data});
  })

  /*  查看订单 */
  app.get('/order_detail/:orderId', async (req, res) => {
    const orderId = mongoose.Types.ObjectId(req.params.orderId);
    await Order.find({"_id": orderId}).exec(function (err, data) {
      if (err) {
        console.log(err);
        return
      }
      res.send({code: 200, data: data});
    });
  })

  /*  获取订单列表 */
  app.get('/order_list/:user_id', async (req, res) => {
    const user_id = mongoose.Types.ObjectId(req.params.user_id);
    await Order.find({"user_id": user_id}).exec(function (err, data) {
      if (err) {
        console.log(err);
        return
      }
      res.send({code: 200, data: data});
    });
  });

  // 修改订单信息
  router.post('/order_edit', async (req, res) => {
    const order_id = mongoose.Types.ObjectId(req.body._id);
    req.body.status = 1
    req.body.pay_time = Date.parse(new Date())
    req.body.has_commen = true;
    const data = await Order.findByIdAndUpdate(order_id,req.body);
    if (data) {
      await Order.find({"_id": order_id}).exec(function (err, data) {
        if (err) {
          console.log(err);
          return
        }
        res.send({code: 200, data: data[0]});
      });
    }
  });

  /* 根据关键词搜索店铺 */
  app.get('/search_shops/:keyword', async (req, res) => {
    const keyword = req.params.keyword
    await Shop.find({name: eval('/' + keyword + '/gi')}).exec(function (err, data) {
      if (err) {
        console.log(err);
        return
      }
      res.send({code: 200, data: data});
    });
  });

  app.use('/', router);
};
