/**
 * 处理微信发送来的事件的消息处理器
 *
 * @author yiliang.guo
 */
var msgConfig = require('./reply_config.js');
var moment = require('moment');
const AV = require('leanengine');


exports.handler = eventHandler

//处理时间消息接口
function eventHandler(msg, cb){
  var eventKey = msg.xml.EventKey[0];
  var evt = msg.xml.Event[0];
  console.log('enventKey:', eventKey);
  //基础消息模板
  var baseResult = getBaseResult(msg)
  baseResult.xml.MsgType = 'text' //目前不涉及其他消息类型
  if(evt == 'CLICK'){
    if(eventKey == 'CHECK_IN'){
      //每日打卡
      dailyCheckIn(msg, baseResult, cb);
    }else if(eventKey == 'JOIN_CLASS'){
      //加入计划
      saveUserObject(msg, baseResult, cb);
    }else{
      baseResult.xml.Content = msgConfig.UNKNOWN_MSG;
      cb(null, baseResult);
    }
  }else if(evt == 'subscribe'){
    subscribe(msg, cb);
  }
}

//关注事件
function subscribe(msg, cb){
  cb(null, getNewsResult(msg));
}

//每日打卡
function dailyCheckIn(msg, baseResult, cb){
  var openId = msg.xml.FromUserName[0];
  //1. 扫描是否有打卡记录
  //  ~ 如果么有提示去打卡，否则不能打卡
  var fileQuery = new AV.Query('UserFile');
  fileQuery.equalTo('openId', openId);
  var startDate = (new moment(new Date())).startOf('day').toDate();
  var endDate = (new moment(new Date())).endOf('day').toDate();

  fileQuery.greaterThanOrEqualTo('createdAt', startDate);
  fileQuery.lessThanOrEqualTo('createdAt', endDate);

  //2. 如果有至少一条打卡记录，完成打卡
  fileQuery.count().then(function(count){
    if(count == 0){
      baseResult.xml.Content = "打卡失败，未找到今日任何打卡记录.";
      cb(null, baseResult);
      return AV.Promise.error('Skip.');
    }else{
      var checkInQuery = new AV.Query('DailyCheckIn');
      checkInQuery.equalTo('openId', openId);
      checkInQuery.greaterThanOrEqualTo('createdAt', startDate);
      checkInQuery.lessThanOrEqualTo('createdAt', endDate);
      return checkInQuery.count();
    }
  }).then(function(checkCount){
    if(checkCount > 0){
      baseResult.xml.Content = "今日已经打过卡了,无需重复打卡.";
      cb(null, baseResult);
      return AV.Promise.error('Skip.');
    }else{
      var dailyCheckIn = new AV.Object('DailyCheckIn');
      dailyCheckIn.set('openId', openId);
      return dailyCheckIn.save();
    }
  })
  .then(function(dailyCheckIn){
    if(dailyCheckIn){
      baseResult.xml.Content = msgConfig.DAILY_CHECKIN_MSG(true);
      cb(null, baseResult);
    }
  },function(error){
    console.log('end');
  });
}

//注册一个用户
function saveUserObject(msg, baseResult, cb){
  var openId = msg.xml.FromUserName[0];
  //1. 查看用户是否已经加入了
  var query = new AV.Query('_User');
  query.equalTo('username', openId);

  var user = new AV.User();
  user.set('username', openId);
  user.set('password', 'f32@ds*@&dsa'); //默认密码,目前不做任何功能使用

  query.find().then(function(users){
    if(users.length > 0){
      baseResult.xml.Content = "您已经加入班级了";
      cb(null, baseResult);
    }else {
      return user.signUp();
    }
  }).then(function(user){
    // 注册成功，可以使用了
    if(user){
      baseResult.xml.Content = msgConfig.JOIN_MSG(true);
      console.log(user);
      cb(null, baseResult);
    }
  });
}

//~ 消息模板

//获取消息模板
function getBaseResult(msg){
  var result = {
    xml: {
      ToUserName: msg.xml.FromUserName[0],
      FromUserName: '' + msg.xml.ToUserName + '',
      CreateTime: new Date().getTime(),
      MsgType: '',
      Content: ''
    }
  };
  return result;
}

//关注时候的推送事件
function getNewsResult(msg){
  var result = {
    xml: {
      ToUserName: msg.xml.FromUserName[0],
      FromUserName: '' + msg.xml.ToUserName + '',
      CreateTime: new Date().getTime(),
      MsgType: 'news',
      ArticleCount: 1,
      Articles: {
        item: {
          Title:"战胜英语的终极武器——赌约第二期召集令",
          Description:"战胜英语的终极武器——赌约第二期召集令",
          PicUrl:"http://mmbiz.qpic.cn/mmbiz/vc5r8ID7ZInHAGUOukxSP4SxtehM7OcMNhgowg833bI44hVzYKj9dCmloJD1BE7FC2D1TeibSyBo2tGSVeLyF7w/640?wx_fmt=jpeg&tp=webp&wxfrom=5",
          Url:"http://mp.weixin.qq.com/s?__biz=MzIzODE4MTc2MA==&mid=452664519&idx=1&sn=757578c9750a0db08d41363128390415#rd"
        }
      }
    }
  };
  return result;
}
