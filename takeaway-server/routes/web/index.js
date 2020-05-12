/*
  后台管理系统接口模块
 */
const mongoose = require('mongoose');
const authMiddleware = require('../../middleware/auth');  // 验证用户是否登录
const md5 = require('blueimp-md5');
const WebUser = require('../../models/WebUser');
const Category = require('../../models/Category');
const Shop = require('../../models/Shop');
const _filter = {'pwd': 0, '__v': 0}; // 查询时过滤掉
const sms_util = require('../../util/sms_util');
const svgCaptcha = require('svg-captcha');

module.exports = app => {
  const express = require("express");
  const router = express.Router({
    // 父级路由合并到子级路由
    mergeParams: true
  });

  /*
密码登陆
 */
  router.post('/login_pwd', function (req, res) {
    const name = req.body.name;
    const pwd = md5(req.body.pwd);
    const captcha = req.body.captcha.toLowerCase();
    console.log('/login_pwd', name, pwd, captcha, req.session);

    // 可以对用户名/密码格式进行检查, 如果非法, 返回提示信息
    if(captcha!==req.session.captcha) {
      return res.send({code: 1, msg: '验证码不正确'})
    }
    // 删除保存的验证码
    delete req.session.captcha;

    WebUser.findOne({name}, function (err, user) {
      if (user) {
        console.log('findUser', user);
        if (user.pwd !== pwd) {
          res.send({code: 1, msg: '用户名或密码不正确!'})
        } else {
          req.session.userid = user._id;
          res.send({code: 0, data: {_id: user._id, name: user.name, phone: user.phone}});
        }
      } else {
        const WebUser = new WebUser({name, pwd});
        WebUser.save(function (err, user) {
          // 向浏览器端返回cookie(key=value)
          // res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
          req.session.userid = user._id;
          const data = {_id: user._id, name: user.name};
          // 3.2. 返回数据(新的user)
          res.send({code: 0, data})
        })
      }
    })
  });

  /*
  一次性图形验证码
   */
  router.get('/captcha', function (req, res) {
    var captcha = svgCaptcha.create({
      ignoreChars: '0o1l',
      noise: 2,
      color: true
    });
    req.session.captcha = captcha.text.toLowerCase();
    console.log(req.session.captcha)
    /*res.type('svg');
    res.status(200).send(captcha.data);*/
    res.type('svg');
    res.send(captcha.data)
  });

  /*
  发送验证码短信
  */
  router.get('/sendcode', function (req, res, next) {
    //1. 获取请求参数数据
    var phone = req.query.phone;
    //2. 处理数据
    //生成验证码(6位随机数)
    var code = sms_util.randomCode(6);
    //发送给指定的手机号
    console.log(`向${phone}发送验证码短信: ${code}`, "请求短信验证码");
    sms_util.sendCode(phone, code, function (success) {//success表示是否成功
      if (success) {
        users[phone] = code;
        console.log('保存验证码: ', phone, code);
        res.send({"code": 0})
      } else {
        //3. 返回响应数据
        res.send({"code": 1, msg: '短信验证码发送失败'})
      }
    })
  });

  /*
  短信登陆
  */
  router.post('/login_sms', function (req, res, next) {
    var phone = req.body.phone;
    var code = req.body.code;
    console.log('/login_sms', phone, code, "短信登录");
    if (users[phone] !== code) {
      res.send({code: 1, msg: '手机号或验证码不正确'});
      return;
    }
    //删除保存的code
    delete users[phone];

    WebUser.findOne({phone}, function (err, user) {
      if (user) {
        req.session.userid = user._id;
        res.send({code: 0, data: user})
      } else {
        //存储数据
        const WebUser = new WebUser({phone});
        WebUser.save(function (err, user) {
          req.session.userid = user._id;
          res.send({code: 0, data: user})
        })
      }
    })

  });

  /*
  根据sesion中的userid, 查询对应的user
   */
  router.get('/userinfo', function (req, res) {
    // 取出userid
    const userid = req.session.userid;
    // 查询
    WebUser.findOne({_id: userid}, _filter, function (err, user) {
      // 如果没有, 返回错误提示
      if (!user) {
        // 清除浏览器保存的userid的cookie
        delete req.session.userid;

        res.send({code: 1, msg: '请先登陆'})
      } else {
        // 如果有, 返回user
        res.send({code: 0, data: user})
      }
    })
  });


  router.get('/logout', function (req, res) {
    // 清除浏览器保存的userid的cookie
    delete req.session.userid;
    // 返回数据
    res.send({code: 0})
  });

  /*
  获取首页分类列表
   */
  /*router.get('/index_category', async function (req, res) {
    const data = await Category.find();
    console.log(data);
    res.send({code: 0, data})
  });*/

  /*
  根据经纬度获取商铺列表
  ?latitude=40.10038&longitude=116.36867
   */
  router.get('/shops', async function (req, res) {
    const latitude = req.query.latitude
    const longitude = req.query.longitude

    const data = await Shop.find().populate('categories');
    res.send({code: 0, data})
  });

  app.use('/', router);
};
