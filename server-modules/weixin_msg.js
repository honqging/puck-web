/**
 * 处理微信发送而来的消息的处理器
 *
 * @author yiliang.guo
 */

var msgConfig = require('./reply_config.js');
var moment = require('moment');
const AV = require('leanengine');
exports.handler = msgHandler

 //处理发送来的消息接口
function msgHandler(msg, cb){
   var msgType = msg.xml.MsgType[0];
   //基础消息模板
   var baseResult = getBaseResult(msg)
   baseResult.xml.MsgType = 'text' //目前不涉及其他消息类型
   if(msgType == 'text'){
     //目前文字消息统统过滤，获取默认消息回复
     baseResult.xml.Content = msgConfig.DEFAULT_MSG();
     cb(null, baseResult);
   }else if(msgType == 'voice' || msgType == 'image'){
     saveFile(msg, baseResult, msgType, cb);
   }else{
     baseResult.xml.Content = msgConfig.UNKNOWN_MSG;
     cb(null, baseResult);
   }
}


function saveFile(msg, baseResult, fileType, cb){
  var openId = msg.xml.FromUserName[0];
  var file = new AV.Object('UserFile');
  file.set('openId', openId);
  file.set('fileType', fileType);
  if(fileType == 'voice'){
    file.set('fileKey', msg.xml.MediaId[0]);
    file.set('format', msg.xml.Format[0]);
  }else if(fileType == 'image'){
    file.set('fileKey', msg.xml.MediaId[0]);
    file.set('fileUrl', msg.xml.PicUrl[0]);
  }
  file.save().then(function(data){
    baseResult.xml.Content = msgConfig.CHECKIN_MSG(true);
    cb(null, baseResult);
  },function(error){
    console.log('error:', error);
    baseResult.xml.Content = msgConfig.CHECKIN_MSG(false);
    cb(null, baseResult);
  });
}

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
