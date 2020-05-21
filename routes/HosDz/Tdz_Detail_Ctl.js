const db = require('../../DbLib/HosDz/Tdz_Detail_DB')
const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class Tdz_Detail_Ctl extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async index(ctx, next) {

    let workDate = ctx.query.workDate;
    const dataUtil = require('../../Libs/date-utils')
    if (super.isEmpty(workDate)) {
      workDate = dataUtil.getYestoday('yyyy-MM-dd')
    }
    await ctx.render('/HosDz/Tdz_Detail/Index', {
      workDate: workDate
    });

  }
  async curDetail(ctx, next) {
    console.log(ctx.query)
    const recordDb = require('../../DbLib/HosDz/Tdz_Record_DB')
    let result = await recordDb.getSingle({
      RecordId: ctx.query.RecordId
    });
    const dataUtil = require('../../Libs/date-utils')

    let workDate = ctx.query.workDate;

    if (super.isEmpty(workDate)) {
      workDate = dataUtil.getYestoday('yyyy-MM-dd')
    }
    await ctx.render('/HosDz/Tdz_Detail/curDetail', {
      workDate: workDate,
      record: result
    });

  }

  /***
   * 进入添加界面
   */
  async addIndex(ctx, next) {
    await ctx.render('/HosDz/Tdz_Detail/AddIndex', {});

  }
  /**
   * 进入修改界面
   *  {*} ctx 
   *  {*} next 
   */
  async ShowSingle(ctx, next) {

    let result = {};
    try {
      result = await db.getSingle({
        DetailId: ctx.query.Id
      });
      const util = require('../../Libs/util')

      result.TransTime = util.dateFtt('yyyy-MM-dd hh:mm:ss', result.TransTime);
      result.AutoRecDateTime = util.dateFtt('yyyy-MM-dd hh:mm:ss', result.AutoRecDateTime);
      result.BankAmount =( result.BankAmount!=null)?result.BankAmount.toFixed(2):'';
      result.ThirdAmount =( result.ThirdAmount!=null)?result.ThirdAmount.toFixed(2):'';
       
      let ThirdUserSex ="";
      switch (result.ThirdUserSex) {
        case 0:
            ThirdUserSex = '<span class="text-warning">未知</span>'
          break;

        case 1:
            ThirdUserSex = '<span class="text-success">男</span>'
          break;

        case 2:
            ThirdUserSex = '<span class="text-info">女</span>'
          break;       
      }
      result.ThirdUserSex=ThirdUserSex;
      let AutoRecResult = "";
      
      switch (result.AutoRecResult) {
        case 0:
          AutoRecResult = '<span class="text-warning">未对账</span>'
          break;

        case 1:
          AutoRecResult = '<span class="text-success">账平</span>'
          break;

        case 2:
          AutoRecResult = '<span class="text-info">银行单边账</span>'
          break;
        case 3:
          AutoRecResult = '<span= class="text-navy">第三方单边账</span>'
          break;
        case 4:
          AutoRecResult = '<span class="text-danger">金额不平</span>'
          break;
      }
      result.AutoRecResult = AutoRecResult;
    } catch (err) {
      result = null;
    }
    await ctx.render('/HosDz/Tdz_Detail/ShowSingle', {
      'Model': result
    });
  }
  /**
   * 列表查询界面
   *  {*} ctx 
   *  {*} next 
   */
  async getAllList(ctx, next) {
    let result = {};
    try {
      let condi = "";
      let config = [];
      let body = ctx.request.body;

      if (body.MerPayTypeId != -1) {
        condi += ` MerPayTypeId = ?  and `;
        config.push(body.MerPayTypeId);
      }
      if (!super.isEmpty(body.BussType)) {
        condi += ` BussType like ?  and `;
        config.push('%' + body.BussType + '%');
      }
      if (!super.isEmpty(body.PospOrderNo)) {
        condi += ` PospOrderNo like ?  and `;
        config.push('%' + body.PospOrderNo + '%');
      }
      if (!super.isEmpty(body.MerchantNo)) {
        condi += ` MerchantNo like ?  and `;
        config.push('%' + body.MerchantNo + '%');
      }
      if (!super.isEmpty(body.TerminalNo)) {
        condi += ` TerminalNo like ?  and `;
        config.push('%' + body.TerminalNo + '%');
      }
      if (!super.isEmpty(body.BankCardNum)) {
        condi += ` BankCardNum like ?  and `;
        config.push('%' + body.BankCardNum + '%');
      }
      if (!super.isEmpty(body.BankRefNo)) {
        condi += ` BankRefNo like ?  and `;
        config.push('%' + body.BankRefNo + '%');
      }
      if (!super.isEmpty(body.BankOrderNo)) {
        condi += ` BankOrderNo like ?  and `;
        config.push('%' + body.BankOrderNo + '%');
      }
      if (!super.isEmpty(body.BankTrace)) {
        condi += ` BankTrace like ?  and `;
        config.push('%' + body.BankTrace + '%');
      }
      if (!super.isEmpty(body.ThirdRefNo)) {
        condi += ` ThirdRefNo like ?  and `;
        config.push('%' + body.ThirdRefNo + '%');
      }
      if (!super.isEmpty(body.ThirdUserNo)) {
        condi += ` ThirdUserNo like ?  and `;
        config.push('%' + body.ThirdUserNo + '%');
      }
      if (!super.isEmpty(body.ThirdUserID)) {
        condi += ` ThirdUserID like ?  and `;
        config.push('%' + body.ThirdUserID + '%');
      }
      if (!super.isEmpty(body.ThirdUserName)) {
        condi += ` ThirdUserName like ?  and `;
        config.push('%' + body.ThirdUserName + '%');
      }
      if (!super.isEmpty(body.ThirdUserTelNo)) {
        condi += ` ThirdUserTelNo like ?  and `;
        config.push('%' + body.ThirdUserTelNo + '%');
      }

      if (!super.isEmpty(body.ThirdUserIDNum)) {
        condi += ` ThirdUserIDNum like ?  and `;
        config.push('%' + body.ThirdUserIDNum + '%');
      }
      if (!super.isEmpty(body.WindowNo)) {
        condi += ` WindowNo like ?  and `;
        config.push('%' + body.WindowNo + '%');
      }
      if (!super.isEmpty(body.OperatorNo)) {
        condi += ` OperatorNo like ?  and `;
        config.push('%' + body.OperatorNo + '%');
      }
      if (body.AutoRecResult != '-1') {
        condi += ` AutoRecResult = ?  and `;
        config.push(body.AutoRecResult);
      }
      if (!super.isEmpty(body.Start)) {
        condi += `  TransTime >= ? and `
        config.push(body.Start);
      }
      if (!super.isEmpty(body.End)) {
        condi += `  TransTime <= ? and `
        config.push(super.addDate(body.End, 1));
      }
      result = await db.getList(config, condi);
    } catch (err) {
      console.log(err)
      ctx.log.error(err)
      result = null;
    }
    ctx.body = result;
  }
  /**
   * 增加数据提交保存数据
   *  {*} ctx 
   *  {*} next 
   */
  async add(ctx, next) {

    let result = {};
    try {

      let body = ctx.request.body;
      result = await db.isExists({
        PospOrderNo: body.PospOrderNo
      })
      if (result) {
        throw new Error(`插入失败,[${body.PospOrderNo}]已经存在`)
      }
      body.CreateDate = new Date();
      body.delMark = 0;
      result = await db.add(body);

      if (!result) {
        throw new Error('添加失败');
      }
      result = {
        Success: true,
        Msg: '添加成功'
      };

    } catch (err) {
      console.log(err)
      ctx.log.error(err)
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
  async update(ctx, next) {
    let result = {};
    try {

      let body = ctx.request.body;
      result = await db.isExistsOld({
        PospOrderNo: body.PospOrderNo
      }, body.DetailId)
      if (result) {
        throw new Error(`修改失败,[${body.PospOrderNo}]已经存在`)
      }

      result = await db.update(body, body.DetailId); //更新数据

      if (!result) {
        throw new Error('修改失败');
      }
      result = {
        Success: true,
        Msg: '修改成功'
      };

    } catch (err) {
      console.log(err)
      ctx.log.error(err)
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
  async remove(ctx, next) {
    let result = {};
    try {

      let ids = ctx.request.body.ids;
      let bRet = false;
      let arr = ids.split(',');

      for (var el in arr) {
        if (arr[el] == '0') continue;
        bRet = await db.update({
          delMark: 1
        }, arr[el]); //删除数据
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
      console.log(err)
      ctx.log.error(err)
      result = {
        Success: false,
        Msg: err.message
      };
    }
    ctx.body = result;
  }
  /**
   * 下拉列表框数据获取
   *  {*} ctx 
   *  {*} next 
   */
  async getComb(ctx, next) {
    let result = {};
    let items = [];
    let config = [{
      delMark: 0
    }];
    try {
      let body = ctx.request.body;
      result = await db.getList(config); //获取下拉列表框数据    
      items = result.map((item, index) => {
        return {
          id: item.DetailId,
          text: item.PospOrderNo
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
      console.log(err)
      ctx.log.error(err)
      result = null;
    }
    ctx.body = items;
  }
}
module.exports = new Tdz_Detail_Ctl;