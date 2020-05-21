const db = require('../../DbLib/HosDz/Tdz_Bankdetail_DB')
const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class Tdz_Bankdetail_Ctl extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async index(ctx, next) {
    await ctx.render('/HosDz/Tdz_Bankdetail/Index', {});

  }
  /***
   * 进入添加界面
   */
  async addIndex(ctx, next) {
    await ctx.render('/HosDz/Tdz_Bankdetail/AddIndex', {});

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
        BankDetailId: ctx.query.Id
      });
    } catch (err) {
      result = null;
    }
    await ctx.render('/HosDz/Tdz_Bankdetail/UpdateIndex', {
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
      if (body.MerchantTypeId != '-1') {
        condi += ` MerchantTypeId = ?  and `;
        config.push(
           body.MerchantTypeId
        );
      }
      if (body.TransTypeId != '-1') {
        condi += ` TransTypeId = ?  and `;
        config.push(
           body.TransTypeId
        );
      }
      if (!super.isEmpty(body.MerchantNo)) {
        condi += ` MerchantNo like ?  and `;
        config.push('%' + body.MerchantNo + '%');
      }
      if (!super.isEmpty(body.TerminalNo)) {
        condi += ` TerminalNo like ?  and `;
        config.push('%' + body.TerminalNo + '%');
      }
      if (!super.isEmpty(body.TransDate)) {
        condi += ` TransDate like ?  and `;
        config.push('%' + body.TransDate + '%');
      }
      if (!super.isEmpty(body.TransTime)) {
        condi += ` TransTime like ?  and `;
        config.push('%' + body.TransTime + '%');
      }
      if (!super.isEmpty(body.TraceNo)) {
        condi += ` TraceNo like ?  and `;
        config.push('%' + body.TraceNo + '%');
      }
      if (!super.isEmpty(body.CardNum)) {
        condi += ` CardNum like ?  and `;
        config.push('%' + body.CardNum + '%');
      }
      if (!super.isEmpty(body.SystemRefNo)) {
        condi += ` SystemRefNo like ?  and `;
        config.push('%' + body.SystemRefNo + '%');
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
        TransDate: body.TransDate
      })
      if (result) {
        throw new Error(`插入失败,[${body.TransDate}]已经存在`)
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
        TransDate: body.TransDate
      }, body.BankDetailId)
      if (result) {
        throw new Error(`修改失败,[${body.TransDate}]已经存在`)
      }

      result = await db.update(body, body.BankDetailId); //更新数据

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
          id: item.BankDetailId,
          text: item.TransDate
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
module.exports = new Tdz_Bankdetail_Ctl;