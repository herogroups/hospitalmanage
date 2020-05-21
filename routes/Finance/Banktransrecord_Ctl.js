const db = require('../../DbLib/Finance/Banktransrecord_DB')
const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class Banktransrecord_Ctl extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async index(ctx, next) {
    let result = await db.getPaymodelList([], ""); //获取下拉列表框数据    
  
    await ctx.render('/Finance/Banktransrecord/Index', {payCodeList:result});

  }
  /***
   * 进入添加界面
   */
  async addIndex(ctx, next) {
    await ctx.render('/Finance/Banktransrecord/AddIndex', {});

  }
  /**
   * 进入修改界面
   *  {*} ctx 
   *  {*} next 
   */
  async showSingle(ctx, next) {

    let result = {};
    try {
      result = await db.getSingle({
        BankTransID: ctx.query.Id
      });
      const dateutil = require('../../Libs/date-utils')
      result.BankTransDateTime = dateutil.Format(result.BankTransDateTime, 'yyyy-MM-dd hh:mm:ss')
    } catch (err) {
      result = null;
    }
    await ctx.render('/Finance/Banktransrecord/ShowSingle', {
      'Model': result
    });
  }
  /**
   * 列表查询界面
   *  {*} ctx 
   *  {*} next 
   */
  async getAllList(ctx, next) {
    console.log('ctx',ctx.request.body);
    let result = {};
    try {
      let condi = "";
      let config = [];
      let body = ctx.request.body;
      let pageindex = body.pageindex;
      let pageSize = body.pageSize;
      if (!super.isEmpty(body.BussType)) {
        condi += ` BussType like ?  and `;
        config.push('%' + body.BussType + '%');
      }
      if (!super.isEmpty(body.ChannelType)) {
        condi += ` ChannelType like ?  and `;
        config.push('%' + body.ChannelType + '%');
      }
      if (!super.isEmpty(body.TransType)) {
        condi += ` TransType like ?  and `;
        config.push('%' + body.TransType + '%');
      }
      if (!super.isEmpty(body.PospOrderNo)) {
        condi += ` PospOrderNo like ?  and `;
        config.push('%' + body.PospOrderNo + '%');
      }
      if (!super.isEmpty(body.MerchantOrderNo)) {
        condi += ` MerchantOrderNo like ?  and `;
        config.push('%' + body.MerchantOrderNo + '%');
      }
      if (!super.isEmpty(body.BankPayOrderNo)) {
        condi += ` BankPayOrderNo like ?  and `;
        config.push('%' + body.BankPayOrderNo + '%');
      }
      if (!super.isEmpty(body.QRPayOrderNo)) {
        condi += ` QRPayOrderNo like ?  and `;
        config.push('%' + body.QRPayOrderNo + '%');
      }
      if (!super.isEmpty(body.BankTransDate)) {
        condi += ` BankTransDate like ?  and `;
        config.push('%' + body.BankTransDate + '%');
      }
      if (!super.isEmpty(body.BankTransTime)) {
        condi += ` BankTransTime like ?  and `;
        config.push('%' + body.BankTransTime + '%');
      }
      if (!super.isEmpty(body.BankMerchantNo)) {
        condi += ` BankMerchantNo like ?  and `;
        config.push('%' + body.BankMerchantNo + '%');
      }
      if (!super.isEmpty(body.BankTerminalNo)) {
        condi += ` BankTerminalNo like ?  and `;
        config.push('%' + body.BankTerminalNo + '%');
      }
      if (!super.isEmpty(body.BankTellerNo)) {
        condi += ` BankTellerNo like ?  and `;
        config.push('%' + body.BankTellerNo + '%');
      }
      if (!super.isEmpty(body.BankTransBatchNo)) {
        condi += ` BankTransBatchNo like ?  and `;
        config.push('%' + body.BankTransBatchNo + '%');
      }
      if (!super.isEmpty(body.BankTraceNo)) {
        condi += ` BankTraceNo like ?  and `;
        config.push('%' + body.BankTraceNo + '%');
      }
      if (!super.isEmpty(body.TotalAmt)) {
        condi += ` TotalAmt like ?  and `;
        config.push('%' + body.TotalAmt + '%');
      }
      if (body.PayCode != "-1") {
        condi += ` PayCode  in (?)  and `;
        config.push(body.PayCode);
      }
      if (body.BankCode != "-1") {
        condi += ` BankCode = ?  and `;
        config.push(body.BankCode);
      }
      if (body.PayResult != "-1") {
        condi += ` PayResult = ?  and `;
        config.push(body.PayResult);
      }
      if (!super.isEmpty(body.PayModelEx)) {
        condi += ` PayModelEx like ?  and `;
        config.push('%' + body.PayModelEx + '%');
      }
      if (!super.isEmpty(body.BankTransCardNum)) {
        condi += ` BankTransCardNum like ?  and `;
        config.push('%' + body.BankTransCardNum + '%');
      }
      if (!super.isEmpty(body.CustId)) {
        condi += ` CustId like ?  and `;
        config.push('%' + body.CustId + '%');
      }
      if (!super.isEmpty(body.ThirdTransWindowNo)) {
        condi += ` ThirdTransWindowNo like ?  and `;
        config.push('%' + body.ThirdTransWindowNo + '%');
      }
      if (!super.isEmpty(body.ThirdTransOperatorNo)) {
        condi += ` ThirdTransOperatorNo like ?  and `;
        config.push('%' + body.ThirdTransOperatorNo + '%');
      }
      if (!super.isEmpty(body.ThirdTransBussNo)) {
        condi += ` ThirdTransBussNo like ?  and `;
        config.push('%' + body.ThirdTransBussNo + '%');
      }
      if (!super.isEmpty(body.ThirdTransUserNo)) {
        condi += ` ThirdTransUserNo like ?  and `;
        config.push('%' + body.ThirdTransUserNo + '%');
      }
      if (!super.isEmpty(body.ThirdTransUserId)) {
        condi += ` ThirdTransUserId like ?  and `;
        config.push('%' + body.ThirdTransUserId + '%');
      }
      if (!super.isEmpty(body.ThirdTransUserName)) {
        condi += ` ThirdTransUserName like ?  and `;
        config.push('%' + body.ThirdTransUserName + '%');
      }
      if (!super.isEmpty(body.ThirdTransUserSex)) {
        condi += ` ThirdTransUserSex like ?  and `;
        config.push('%' + body.ThirdTransUserSex + '%');
      }
      if (!super.isEmpty(body.ThirdTransUserIDNum)) {
        condi += ` ThirdTransUserIDNum like ?  and `;
        config.push('%' + body.ThirdTransUserIDNum + '%');
      }
      if (!super.isEmpty(body.ThirdTransUserTelNo)) {
        condi += ` ThirdTransUserTelNo like ?  and `;
        config.push('%' + body.ThirdTransUserTelNo + '%');
      }
      if (!super.isEmpty(body.ThirdTerminalNo)) {
        condi += ` ThirdTerminalNo like ?  and `;
        config.push('%' + body.ThirdTerminalNo + '%');
      }
      if (!super.isEmpty(body.PayDescription)) {
        condi += ` PayDescription like ?  and `;
        config.push('%' + body.PayDescription + '%');
      }
      if (!super.isEmpty(body.BankSystemRefNo)) {
        condi += ` BankSystemRefNo like ?  and `;
        config.push('%' + body.BankSystemRefNo + '%');
      }
      if (!super.isEmpty(body.OldSystemRefNo)) {
        condi += ` OldSystemRefNo like ?  and `;
        config.push('%' + body.OldSystemRefNo + '%');
      }
      if (!super.isEmpty(body.StartDate)) {
        condi += ` BankTransDateTime >= ?  and `;
        config.push(body.StartDate);
      }
      if (!super.isEmpty(body.EndDate)) {

        condi += ` BankTransDateTime < ?  and `;
        config.push(super.addDate(body.EndDate, 1));
      }
      
      result = await db.getPageList(config, condi,pageindex,pageSize);
      
    } catch (err) {
      console.log(err)
      ctx.log.error(err)
      result = null;
    }
    console.log("result------------",result)
  //  result.total=1;
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
        ChannelType: body.ChannelType
      })
      if (result) {
        throw new Error(`插入失败,[${body.ChannelType}]已经存在`)
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
        ChannelType: body.ChannelType
      }, body.BankTransID)
      if (result) {
        throw new Error(`修改失败,[${body.ChannelType}]已经存在`)
      }

      result = await db.update(body, body.BankTransID); //更新数据

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
    let body = ctx.request.body;
    let result = await db.getPaymodelList([], ""); //获取下拉列表框数据    
    ctx.body = super.getCombox(result, 'payCode', 'payCodeName', body.mark)


  }
  async getBankCodeComb(ctx, next) {  
   
    try {
      let body = ctx.request.body;
      let result = await db.getBankCodeList([], ""); //获取下拉列表框数据   
      
      ctx.body = super.getCombox(result, 'bankCode', 'bankCodeName', body.mark)
    } catch (err) {
      console.log('err', err);
    }
  }
  async getPayResultComb(ctx, next) {
    let result = {};
    let items = [];
    let condi = "";
    let config = [];
    try {
      let body = ctx.request.body;
      result = await db.GetPayResultList(config, condi); //获取下拉列表框数据    
      items = result.map((item, index) => {
        return {
          id: item.payResultId,
          text: item.PayResultName
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
module.exports = new Banktransrecord_Ctl;