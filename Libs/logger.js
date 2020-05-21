const path = require('path');//引入原生path模块
const log4js = require('koa-log4');//引入koa-log4
String.prototype.PadLeft = function (len, charStr) {
  var s = this + '';
  return new Array(len - s.length + 1).join(charStr || '') + s;
}
String.prototype.PadRight = function (len, charStr) {
  var s = this + '';
  return s + new Array(len - s.length + 1).join(charStr || '');
}

let year = new Date().getFullYear().toString();
let month = (new Date().getMonth()+1).toString().PadLeft(2,'0');
let yearMonth = year+month;
 
log4js.configure({
  appenders: {
    //访问日志
    access: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
      alwaysIncludePattern: true, //文件名始终以日期区分
      encoding:"utf-8",
      filename: path.join('logs/',yearMonth, 'access') //生成文件路径和文件名
    },
    //系统日志
    application: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
      alwaysIncludePattern: true, //文件名始终以日期区分
      encoding:"utf-8",
      filename: path.join('logs/',yearMonth, 'app') //生成文件路径和文件名
    },
    ims: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
      alwaysIncludePattern: true, //文件名始终以日期区分
      encoding:"utf-8",
      filename: path.join('logs/',yearMonth, 'ims') //生成文件路径和文件名
    },
    posp: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
      alwaysIncludePattern: true, //文件名始终以日期区分 
      encoding:"utf-8",
      filename: path.join('logs/',yearMonth, 'posp') //生成文件路径和文件名
    },
    payNotice: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
      alwaysIncludePattern: true, //文件名始终以日期区分 
      encoding:"utf-8",
      filename: path.join('logs/',yearMonth, 'payNotice') //生成文件路径和文件名
    },
    remote: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
      alwaysIncludePattern: true, //文件名始终以日期区分
      encoding:"utf-8",
      filename: path.join('logs/',yearMonth, 'remote') //生成文件路径和文件名
    },
    out: {
      type: 'console'
    }
  },
  categories: {
    default: { appenders: [ 'out' ], level: 'info' },
    access: { appenders: [ 'access' ], level: 'info' },
    application: { appenders: [ 'application' ], level: 'ALL'},
    ims: { appenders: [ 'ims' ], level: 'ALL'},
    posp: { appenders: [ 'posp' ], level: 'ALL'},
    payNotice: { appenders: [ 'payNotice' ], level: 'ALL'},
    remote: { appenders: [ 'remote' ], level: 'ALL'}

    
  }
});

exports.accessLogger = () => log4js.koaLogger(log4js.getLogger('access')); //记录所有访问级别的日志
exports.systemLogger = log4js.getLogger('application');  //记录所有应用级别的日志
exports.imsLogger = log4js.getLogger('ims');  //记录微信公众号与后台交互数据
exports.pospLogger = log4js.getLogger('posp');  //发往Hos系统数据
exports.remoteLog = log4js.getLogger('remote');  //发往Hos系统数据
exports.payNotice = log4js.getLogger('payNotice');  //发往Hos系统数据

