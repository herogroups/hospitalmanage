class CtrBase {
  constructor() {


  }
  isEmpty(obj) {
    if (obj === null) return true;
    if (typeof obj === 'undefined') {
      return true;
    }
    if (typeof obj === 'string') {
      if (obj === "") {
        return true;
      }
      var reg = new RegExp("^([ ]+)|([　]+)$");
      return reg.test(obj);
    }
    return false;
  }
  addDate(date, days) {
    if (days == undefined || days == '') {
      days = 1;
    }
    var date = new Date(date);
    date.setDate(date.getDate() + days);
    var month = date.getMonth() + 1;
    var day = date.getDate();

    return date.getFullYear() + '-' + CtrBase.getFormatDate(month) + '-' + CtrBase.getFormatDate(day);
  }

  // 日期月份/天的显示，如果是1位数，则在前面加上'0'
  static getFormatDate(arg) {
    if (arg == undefined || arg == '') {
      return '';
    }

    var re = arg + '';
    if (re.length < 2) {
      re = '0' + re;
    }

    return re;
  }
  async add_log(ctx, funname, memo, result = 0) {
    const db = require('../DbLib/SystemManage/Sys_Log_DB')
    let ip = '';

    ip = (ctx.request.ip == undefined || ctx.request.ip == null) ? ctx.query.ip.replace('::ffff:', '') : ctx.request.ip.replace('::ffff:', '');

    let body = {
      Account: ctx.User.UserCode,
      NickName: ctx.User.UserName,
      IPAddress: ip,
      MEMO: memo,
      FunName: funname,
      Result: result,
      CreatorTime: new Date(),
    }
    await db.Add(body);

  }
    getCombox(result, itemId, itemText, mark) {
    let items=[];
    try {
      items = result.map((item, index) => {
        return {
          id: item[itemId],
          text: item[itemText]
        }
      });
      if (mark == "1") {
        items.splice(0, 0, {
          id: -1,
          text: '全部'
        }); //items在数组最前边插入一条记录
      }
    } catch (err) {
      items = null;
    }
    return items;
  }
}
module.exports = CtrBase;