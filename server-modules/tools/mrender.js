/**
 * @author globit allen
 */
var util = require('util');
var mlog=require('./mlog');

/*
  render json 工具
 */
function doErr(err){
  console.log(err);
}
function renderError(res, error) {
  if (error == null) {
    error = {
      message: "Unknown error",
      code: 500
    };
  };
  res.status(error.code).json(error);
}
function renderSuccess(res){
  return renderResult(res,'success', 200);
}
function renderNotFound(res){
  renderError(res, {code:404, message:'找不到对象!'});
}
function renderResult(res, result, code) {
  res.status(code).json({result: result, code:code});
}


exports.renderNotFound=renderNotFound;
exports.renderSuccess=renderSuccess;
exports.renderError=renderError;
