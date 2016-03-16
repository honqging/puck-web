/**
 * 静态消息类，主要定义自动回复的消息
 *
 * @author yiliang.guo
 */

exports.DEFAULT_MSG = getDefaultMsg
exports.CHECKIN_MSG = getCheckinMsg
exports.DAILY_CHECKIN_MSG = dailyCheckInMsg
exports.JOIN_MSG = joinMsg

exports.UNKNOWN_MSG = UNKNOWN_MSG


var UNKNOWN_MSG = "您发送了什么？我赌君读书少，不认识.";
var ERROR_MSG = "很遗憾，消息发送失败，似乎服务器开了一点小差!";

//默认消息
function getDefaultMsg(){
  return "【我赌我坚持】请发送语音或者图片已完成今日打卡(图片为今日学习笔记、语音为口语练习记录.).";
}

//打卡消息回复提示
function getCheckinMsg(isSuccess){
  var success = isSuccess || false;
  if(success){
    return "成功发送一条消息,我赌君帮你记录下来了,继续加油额(注意:后台会保留打卡前最后三次消息作为打卡记录)";
  }else{
    return ERROR_MSG;
  }
}

//今日打卡消息提示
function dailyCheckInMsg(isSuccess){
  var success = isSuccess || false;
  if(success){
    return "成功完成今天打卡(我赌君会保存每天23:50前最后三次消息作为打卡记录).";
  }else{
    return ERROR_MSG;
  }
}

function joinMsg(isSuccess){
  var success = isSuccess || false;
  if(success){
    return "成功加入";
  }else{
    return ERROR_MSG;
  }
}
