const db = require('../../DbLib/Ims/Ims_Pay_DB')
const Ctrlbase = require('../CtrBase')
const dateUtil = require('../../Libs/date-utils')
/**
 * 命令业务控制模块
 */
class Ims_Pay_Ctl extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async index(ctx, next) {
    await ctx.render('/Ims/Ims_Pay/Index', {
      workDate: dateUtil.getToday('yyyy-MM-dd')
    });

  }
  /***
   * 进入添加界面
   */
  async refund(ctx, next) {
    await ctx.render('/Ims/Ims_Pay/refund', {
      workDate: dateUtil.getToday('yyyy-MM-dd')
    });

  }
  /**
   * 进入修改界面
   *  {*} ctx 
   *  {*} next 
   */
  async updateIndex(ctx, next) {

    let result = {};
    try {
      result = await db.getSingleById({
        payId: ctx.query.Id
      });
      switch (result.transState) {
        case 0: {
          result.transState = '未支付';
          break;
        }
        case 1: {
          result.transState = '已支付';
          break;
        }
        case 2: {
          result.transState = '已退款';
          break;
        }
      }
      if (Number(result.refundFee)>=Number( result.amount)){
        throw new Error('已经全部退款')
      }
      result.createDate = dateUtil.Format(result.createDate, 'yyyy-MM-dd hh:mm:ss')
      const {
        L5004
      } = require('../../service/HosGzhClient');
      let req = {
        trade_no: result.orderCode
      }
      let data = await L5004(req);//退款接口
      if (data.return_code != 'SUCCESS') {
        throw new Error(data.trade_state_desc)
      }

      result.return_code='00'
    } catch (err) {
      console.log('', err);
      result.return_code='01'
      result.return_msg=err.message;
    }
    await ctx.render('/Ims/Ims_Pay/UpdateIndex', {
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

      if (!super.isEmpty(body.hosCardNo)) {
        condi += ` hosCardNo like ?  and `;
        config.push('%' + body.hosCardNo + '%');
      }
      if (!super.isEmpty(body.orderCode)) {
        condi += ` orderCode like ?  and `;
        config.push('%' + body.orderCode + '%');
      }
      if (!super.isEmpty(body.busCode)) {
        condi += ` busCode like ?  and `;
        config.push('%' + body.busCode + '%');
      }

      if (!super.isEmpty(body.payResultCh)) {
        condi += ` payResultCh like ?  and `;
        config.push('%' + body.payResultCh + '%');
      }
      if (!super.isEmpty(body.payResult)) {
        condi += ` payResult like ?  and `;
        config.push('%' + body.payResult + '%');
      }

      if (!super.isEmpty(body.Start)) {
        condi += `  createDate >= ? and `
        config.push(body.Start);
      }
      if (!super.isEmpty(body.End)) {
        condi += `  createDate <= ? and `
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
        orderCode: body.orderCode
      })
      if (result) {
        throw new Error(`插入失败,[${body.orderCode}]已经存在`)
      }
      body.CreateDate = new Date();
      body.closed = 0;
      result = await db.add(body);

      if (!result) {
        throw new Error('添加失败');
      }
      result = {
        Success: true,
        Msg: '添加成功'
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
   * 修改提交数据并保存
   *  {*} ctx 
   *  {*} next 
   */
  async update(ctx, next) {
    let result = {};
    try {
      let body = ctx.request.body;

      const {
        L5006
      } = require('../../service/HosGzhClient')
      await L5006(body)



      if (!result) {
        throw new Error('修改失败');
      }
      result = {
        Success: true,
        Msg: '修改成功'
      };

    } catch (err) {
      console.log(err)
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
        bRet = await db.remove(arr[el]); //删除数据
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
      closed: 0
    }];
    try {
      let body = ctx.request.body;
      result = await db.getList(config); //获取下拉列表框数据    
      items = result.map((item, index) => {
        return {
          id: item.payId,
          text: item.orderCode
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
      ctx.log.error(err.message)
      result = null;
    }
    ctx.body = items;
  }
}
module.exports = new Ims_Pay_Ctl;