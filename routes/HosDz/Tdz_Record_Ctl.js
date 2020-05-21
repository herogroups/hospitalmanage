const db = require('../../DbLib/HosDz/Tdz_Record_DB')
const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class Tdz_Record_Ctl extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async index(ctx, next) {
    
    let workDate = ctx.query.workDate;
    const dataUtil = require('../../Libs/date-utils')
    if (super.isEmpty(workDate)) {
      workDate=dataUtil.getYestoday('yyyy-MM-dd')
    }
  
    await ctx.render('/HosDz/Tdz_Record/Index', {workDate:workDate});

  }
  /***
   * 进入添加界面
   */
  async addIndex(ctx, next) {
    await ctx.render('/HosDz/Tdz_Record/AddIndex', {});

  }
  /**
   * 进入修改界面
   *  {*} ctx 
   *  {*} next 
   */
  async updateIndex(ctx, next) {

    let result = {};
    try {
      result = await db.getSingle({
        RecordId: ctx.query.Id
      });
    } catch (err) {
      result = null;
    }
    await ctx.render('/HosDz/Tdz_Record/UpdateIndex', {
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
      var reg4 = /(\d{4})-(\d{2})-(\d{2})/
      if (!super.isEmpty(body.MerchantSpec)) {
        condi += ` MerchantSpec like ?  and `;
        config.push('%' + body.MerchantSpec + '%');
      }
      if (!super.isEmpty(body.Start)) {
        
        body.Start= body.Start.toString().replace(reg4,'$1$2$3')
        condi += ` WorkDate >= ?  and `;
        config.push(body.Start );
      }
      if (!super.isEmpty(body.End)) {
        body.End= body.End.toString().replace(reg4,'$1$2$3')
        condi += ` WorkDate <= ?  and `;
        config.push(body.End );
      }
      if (body.AnalysisFlag!='-1') {
        condi += ` AnalysisFlag = ?  and `;
        config.push( body.AnalysisFlag );
      }
      if (body.FtpToThirdFlag!='-1') {
        condi += ` FtpToThirdFlag = ?  and `;
        config.push( body.FtpToThirdFlag );
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
        WorkDate: body.WorkDate
      })
      if (result) {
        throw new Error(`插入失败,[${body.WorkDate}]已经存在`)
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
        WorkDate: body.WorkDate
      }, body.RecordId)
      if (result) {
        throw new Error(`修改失败,[${body.WorkDate}]已经存在`)
      }

      result = await db.update(body, body.RecordId); //更新数据

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
          id: item.RecordId,
          text: item.WorkDate
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
module.exports = new Tdz_Record_Ctl;