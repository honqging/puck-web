/**
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 *
 * @author wangxiao
 */

// 一些工具方法

'use strict';

const tool = require('./tool');
const mrender = require('./tools/mrender')

let pub = {};

// 测试服务是否通畅
pub.hello = (req, res) => {
  tool.l('It works.');
  mrender.renderSuccess(res);
};

module.exports = pub;
