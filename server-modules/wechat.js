/**
 * 微信接口路由函数类
 * 主要暴露微信访问接口
 */

// 一些工具方法
'use strict';

const tool = require('./tool');
const mrender = require('./tools/mrender')
const xml2js = require('xml2js');

var weixin = require('./weixin.js')

let pub = {};

// 测试服务是否通畅
pub.wechat_get = (req, res) => {
  console.log('weixin req:', req.query);
  weixin.exec(req.query, function(err, data) {
    if (err) {
      console.log('error', err);
      return res.send(err.code || 500, err.message);
    }
    return res.send(data);
  });
};

// 微信公众号消息接收接口
pub.wechat_post = (req, res) =>{
  console.log('weixin req:', req.body);
  weixin.exec(req.body, function(err, data) {
    if (err) {
      console.log('error', err);
      return res.send(err.code || 500, err.message);
    }
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(data);
    console.log('res:', data)
    res.set('Content-Type', 'text/xml');
    return res.send(xml);
  })
};


module.exports = pub;
