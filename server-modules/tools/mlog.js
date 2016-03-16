/**
 */
var util=require('util');

var open=true;
var debug=false;

function startWith(s,prefix,f){
  if(s.indexOf(prefix)==0){
    f.call();
  }
}

function filterFn(s,f){
  startWith(s,'',f);
}

function logError(error){
  error=util.inspect(error);
  log(error);
}

function log(s){
  if(open){
      console.log(s);
  }
}

function dlog(s){
  if(debug){
    console.log(s);
  }
}
exports.dlog=dlog;
exports.log=log;
exports.logError=logError;
