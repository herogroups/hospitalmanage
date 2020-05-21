const db = require('../../DbLib/SystemManage/Sys_Terminal_DB')
const Ctrlbase = require('../CtrBase')

/**
 * 命令业务控制模块
 */
class sys_terminal extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async Index(ctx, next) {

    await ctx.render('/SystemManage/Sys_Terminal/Index', { host: ctx.hostname });
  }
  /***
   * 进入添加界面
   */
  async AddIndex(ctx, next) {
    await ctx.render('/SystemManage/Sys_Terminal/AddIndex', {});
  }
  async TerminalSendCmdForm(ctx, next) {

    await ctx.render('/SystemManage/Sys_Terminal/TerminalSendCmdForm', {});
  }
  async DeviceState(ctx, next) {
    await ctx.render('/SystemManage/Sys_Terminal/DeviceState', {});
  }
  /**
   * 进入修改界面
   *  {*} ctx 
   *  {*} next 
   */
  async UpdateIndex(ctx, next) {

    let result = {};
    try {
      result = await db.GetDataById(ctx.query.Id);
    } catch (err) {
      result = null;
    }
    await ctx.render('/SystemManage/Sys_Terminal/UpdateIndex', {
      'Model': result
    });
  }
  /**
   * 列表查询界面
   *  {*} ctx 
   *  {*} next 
   */
  async GetAllList(ctx, next) {
    let result = {};
    try {
      let condi = "";

      let body = ctx.request.body;
      let config = [];
      console.log(body)
      if (body.TERMINALMODEID != -1) {
        condi += `  TERMINALMODEID = ? and `;
        config.push(body.TERMINALMODEID);
      }
      if (body.SHOPID != -1) {
        condi = ` SHOPID = ? and `;
        config.push(body.SHOPID);
      }


      if (body.APPSOFTID != -1) {
        condi += ` APPSOFTID = ? and `;
        config.push(body.APPSOFTID);
      }

      if (!super.isEmpty(body.TERMINALCODE)) {

        condi += `  TERMINALCODE like ? and `
        config.push('%' + body.TERMINALCODE + '%');
      }
      if (!super.isEmpty(body.TERMINALNAME)) {

        condi += `  TERMINALNAME like ? and `
        config.push('%' + body.TERMINALNAME + '%');
      }

      result = await db.GetList(config, condi);
    } catch (err) {
      ctx.log.error(err);
      result = [];
    }
    ctx.body = result;
  }
  /**
   * 增加数据提交保存数据
   *  {*} ctx 
   *  {*} next 
   */
  async Add(ctx, next) {
    let result = {};
    try {

      let body = ctx.request.body;
      body.CLOSED = 0;
      result = await db.IsExists({
        TERMINALCODE: body.TERMINALCODE
      })
      if (result) {
        throw new Error(`插入失败,[${body.TERMINALCODE}]已经存在`)
      }
      result = await db.IsExists({
        TERMINALNAME: body.TERMINALNAME
      })

      if (result) {
        throw new Error(`插入失败,[${body.TERMINALNAME}]已经存在`)
      }
      result = await db.IsExistsBank(body.BANKTERCODE, body.BANKMERCODE)

      if (result) {
        throw new Error(`插入失败,[${body.BANKTERCODE}]已经存在`)
      }
      result = await db.Add(body);

      if (!result) {
        throw new Error('添加失败');
      }
      result = {
        Success: true,
        Msg: '添加成功'
      };

    } catch (err) {
      console.log('', err);
      ctx.log.error(err);
      result = {
        Success: false,
        Msg: err.message
      };
    }
    ctx.body = result;
  }
  /**
   * 修改提交数据并保存
   *  {*} ctx 
   *  {*} next 
   */
  async Update(ctx, next) {
    let result = {};
    try {

      let body = ctx.request.body;
      result = await db.IsExistsOld({
        TERMINALCODE: body.TERMINALCODE
      }, body.TERMINALID)
      if (result) {
        throw new Error(`修改失败,[${body.TERMINALCODE}]已经存在`)
      }
      result = await db.IsExistsOld({
        TERMINALNAME: body.TERMINALNAME
      }, body.TERMINALID)
      if (result) {
        throw new Error(`修改失败,[${body.TERMINALNAME}]已经存在`)
      }
      result = await db.Update(body, body.TERMINALID); //更新数据

      if (!result) {
        throw new Error('修改失败');
      }
      result = {
        Success: true,
        Msg: '修改成功'
      };

    } catch (err) {
      ctx.log.error(err)
      result = {
        Success: false,
        Msg: '修改失败，' + err.message
      };
    }
    ctx.body = result;
  }
  async ModifyTerminalSendCmd(ctx, next) {
    let result, modle = {};
    try {

      let body = ctx.request.body;
      Object.assign(modle, body)
      console.log(modle);
      if (body.DOCMD != 5) {
        delete modle['UPLOADLOGTIME']
      }
      if (body.DOCMD != 2) {
        modle.cmdRef = "";
      }
      if (body.TERMINALID == "0") {
        delete modle['TERMINALID']
        result = await db.UpdateBatch(modle); //更新数据
      } else {
        result = await db.Update(modle, body.TERMINALID); //更新数据
      }


      if (!result) {
        throw new Error('命令发送失败');
      }
      result = {
        Success: true,
        Msg: '修改成功'
      };

    } catch (err) {

      result = {
        Success: false,
        Msg: err.message
      };
    }
    ctx.body = result;
  }
  /**
   * 删除提交的数据
   *  {*} ctx 
   *  {*} next 
   */
  async Remove(ctx, next) {
    let result = {};
    try {

      let ids = ctx.request.body.ids;
      let bRet = false;
      let arr = ids.split(',');

      for (var el in arr) {
        if (arr[el] == '0') continue;
        bRet = await db.Update({ CLOSED: 1 }, arr[el]); //删除数据
        if (!bRet) {
          break;
        }
      }

      if (!bRet) {
        throw new Error('删除失败');
      }
      result = {
        Success: true,
        Msg: '删除成功'
      };

    } catch (err) {
      ctx.log.error(err)
      result = {
        Success: false,
        Msg: "删除失败：该终端已经被使用"
      };
    }
    ctx.body = result;
  }
  async GetBankTerminalComb(ctx, next) {


    let result = {};
    let items = [];
    try {
      let body = ctx.request.body;
      result = await db.GetList([], ""); //获取下拉列表框数据   

      items = result.map((item, index) => {
        return {
          id: item.TERMINALID,
          text: item.BANKTERCODE + '【' + item.BANKMERCODE + '】'
        }
      });
      let mark = body.mark;
      if (mark == "1") {
        items.splice(0, 0, {
          id: -1,
          text: '全部'
        }); //items在数组最前边插入一条记录
      }
    } catch (err) {
      console.log('err', err);
      ctx.log.error(err.message)
      result = null;
    }
    ctx.body = items;
  }
  /**
   * 下拉列表框数据获取
   *  {*} ctx 
   *  {*} next 
   */
  async GetComb(ctx, next) {

    let result = await db.GetList([], ""); //获取下拉列表框数据    
    ctx.body = super.getCombox(result, 'TERMINALID', 'TERMINALNAME', body.mark)

  }
  async GetTerminalDeviceLog(ctx, next) {

    let condi = "";
    let config = [];

    let body = ctx.request.body;
    if (!super.isEmpty(body.TerminalCode)) {

      condi += `  TerminalCode like ? and `
      config.push('%' + body.TerminalCode + '%');
    }

    let result = await db.GetList(config, condi);
    if (result.length == 0) {

      ctx.body = ""
    } else {

      let html = result.map((row, index) => {
        let itemHtml = "";
        let item = "";
        item += (row.PrinterState == 0) ? "<i class='fa fa-print  btn-circle btn-info' title='打印机' ></i>  " : "<i class='fa fa-print   btn-circle btn-warning' title='打印机' ></i>  ";
        item += (row.CardReaderState == 0) ? "<i class='fa fa-credit-card  btn-circle btn-info' title='读卡器' ></i> " : "<i class='fa fa-credit-card btn-warning   btn-circle' title='读卡器'></i> ";
        item += (row.EsamState == 0) ? "<i class='fa fa-keyboard-o  btn-circle btn-info' title='密码键盘' ></i> " : "<i class='fa fa-keyboard-o btn-warning  btn-circle' title='密码键盘'></i>";
        item += (row.IdReaderState == 0) ? "<i class='fa fa-ticket  btn-circle btn-info'  title='身份证阅读器' ></i> " : "<i class='fa fa-ticket btn-warning  btn-circle' title='身份证阅读器'></i> ";

        itemHtml += `<div class='col-sm-3'    onclick=\"selectTerminalCode('${row.TERMINALCODE}')\" ><div class='panel panel-default'  > <div class='mypanel-body forum-info'>  ${item}     </div> <div class='panel-heading forum-info'> <h5> ${row.TERMINALCODE}</h5></div></div></div>`;

        return itemHtml

      });
      console.log('html');
      ctx.body = html.join('');
    }
  }
  async GetTerminalDeviceState(ctx, next) {

    let body = ctx.request.body;

    let result = await db.getSingle({ TerminalCode: body.TerminalCode });

    result.EsamDesc = (result.EsamState == 1) ? "<span class='text-danger'>" + result.EsamDesc + "</span>" : "<span> 正常</span>";
    result.CardReaderDesc = (result.CardReaderState == 1) ? "<span class='text-danger'>" + result.CardReaderDesc + "</span>" : "<span  > 正常</span>";
    result.PrinterDesc = (result.PrinterState == 1) ? "<span class='text-danger'>" + result.PrinterDesc + "</span>" : "<span  > 正常</span>";
    result.IdReaderDesc = (result.IdReaderState == 1) ? "<span class='text-danger'>" + result.IdReaderDesc + "</span>" : "<span  > 正常</span>";
    ctx.body = result;
  }
}
var body = new sys_terminal();
module.exports = body;