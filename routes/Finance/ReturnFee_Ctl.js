const db = require('../../DbLib/Finance/Banktransrecord_DB')
const Ctrlbase = require('../CtrBase')
const _config = require('../../conf/config')

const dateUtil = require('../../Libs/date-utils')
/**
 * 命令业务控制模块
 */
class ReturnFee_Ctl extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async index(ctx, next) {
    let result = await db.getPaymodelList([], ""); //获取下拉列表框数据    

    await ctx.render('/Finance/ReturnFee/Index', { payCodeList: result });

  }
  /**
   * 列表查询界面
   *  {*} ctx 
   *  {*} next 
   */
  async getAllList(ctx, next) {
    console.log('ctx', ctx.request.body);
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

      result = await db.getPageList(config, condi, pageindex, pageSize);

    } catch (err) {
      console.log(err)
      ctx.log.error(err)
      result = null;
    }
    console.log("result------------", result)
    //  result.total=1;
    ctx.body = result;
  }
  async UpdateIndex(ctx, next) {


    let dbMode = {};
    let outmodel = {};
    try {
      dbMode = await db.getSingle({
        BankTransID: ctx.query.Id
      });

      dbMode.BankTransDateTime = dateUtil.Format(dbMode.BankTransDateTime, 'yyyy-MM-dd hh:mm:ss')
      dbMode.transResult = 0;


      switch (dbMode.BankCode) {
        case "01":
          outmodel = await ReturnFee_Ctl.qrQuery(dbMode);
          break;
        case "08":

          outmodel = await ReturnFee_Ctl.jyQuery(dbMode);
          break;

        default:
          break;
      }


      if (outmodel.respcode != "0000") {

        throw new Error("异常:" + outmodel.respmsg);
      }
      // outmodel.postdata='{"recvdata":null,"additiondata":{"outTradeNo":"1291000420191216000000105008","bankOrderNo":"20191216000000224875","thirdPayOrderNo":"1291000420191216000000105008","payStatus":"2","orderAmt":"0.01","rejectedAmt":"0.00","fintime":"20191216175549","memo":"{\\"odeOptTyp\\":\\"6\\",\\"returnOdeNo\\":\\"1291000420191216000000105008\\",\\"odeOptNo\\":null}"}}'
      let additiondata = JSON.parse(outmodel.postdata).additiondata;

      if (additiondata.payStatus == "1") {
        throw new Error("支付失败，无法退款");

      } else if (additiondata.payStatus == "2") {

        throw new Error("未支付，无法退款");
      }
      dbMode.transResult = 0;

    } catch (err) {
      console.log('err', err);
      dbMode.transResult = 1;
      dbMode.remark = err.message;
    }


    await ctx.render('/Finance/ReturnFee/UpdateIndex', {
      'Model': dbMode
    });
  }


  async BankTransQRTrans(ctx, next) {
    let result = {};

    try {

      let body = ctx.request.body;
      let dbMode = await db.getSingle({
        BankTransID: body.BankTransID
      });

      let UserCode = ctx.User.UserCode;
      dbMode.UserCode = UserCode
      switch (dbMode.BankCode) {
        case "01":
          await ReturnFee_Ctl.gyQrcodeReturn(dbMode, body.refundAmount)
          break;
        case "08":
          await ReturnFee_Ctl.jyQrcodeReturn(dbMode, body.refundAmount)
          break;

        default:
          break;
      }
      result = {
        Success: true,
        Msg: '修改成功'
      };

    } catch (err) {
      console.log('err', err);
      result = {
        Success: false,
        Msg: err.message
      };
    }
    ctx.body = result;
  }
  static async qrQuery(dbMode) {
    let outmodel = {};
    let model = {}
    model.pospOrderNo = dbMode.PospOrderNo;
    model.outTradeNo = dbMode.MerchantOrderNo;

    const QR2202 = require('../../service/pospTrans/QR2202')
    let qr2202 = new QR2202();
    outmodel = await qr2202.execute(model)
    return outmodel;
  }

  static async jyQuery(dbMode) {
    let outmodel = {};
    // try {
    //   outmodel = JSON.parse('{        "version": "1.0.0",        "msgsender": "POSP",        "msgrecv": "REFUNDPLATFORM",        "agent": null,        "imei": "D62100000528",        "transno": "20191216175607115",        "transtype": "JY5202",        "transdate": "20191216",        "transtime": "175607",        "guidcode": "4162e3ed51ff4028a8473c7153e9d313",        "requestkey": "asdfghjkl",        "encrypttype": "0",        "postlength": 344,        "postdata": "{recvdata:null,additiondata:{outTradeNo:1291000420191216000000105008,bankOrderNo:20191216000000224875,thirdPayOrderNo:1291000420191216000000105008,payStatus:2,orderAmt:0.01,rejectedAmt:0.00,fintime:20191216175549,memo:{odeOptTyp:6,returnOdeNo:1291000420191216000000105008,odeOptNo:null}}}",        "macvalue": null,        "respcode": "0000",        "respmsg": "交易成功",        "port": 0    }')    
    // } catch (error) {
    //   console.log('',error);
    // }

    let model = {}
    model.pospOrderNo = dbMode.PospOrderNo;
    model.positive = 1;
    model.reqSysNo = _config.posp.SysTemNo + _config.posp.FenHangNo + dateUtil.Format(new Date(), 'yyyyMMddhhmmss') + _config.posp.terminalNo.substr(-6, 6); //日志跟踪号 =  4位系统号+4位分行号+8位日期+6位时间+银行卡终端号后6位 = 28 位
    model.guiYuanHao = dbMode.BankTellerNo; //	交易柜员号	是	例如：AEKR400
    model.oldTerminalNo = dbMode.BankTellerNo; //	原交易终端号	是	例如：终端上送00000139
    model.oldBatchNo = dbMode.BankTransBatchNo; //	原交易批次号  	是	例如：190610
    model.oldTraceNo = dbMode.BankTraceNo; //	原交易流水号   	是	例如：002132   终端号+批次号+流水号唯一
    model.oldBankOrderNo = dbMode.BankPayOrderNo; //	原交易银行业务流水号	是	
    model.oldOutTradeNo = dbMode.MerchantOrderNo; //原交易商户交易单号		第		
    const JY5202 = require('../../service/pospTrans/JY5202')
    let jy5202 = new JY5202();
    outmodel = await jy5202.execute(model)
    return outmodel;
  }
  static async gyQrcodeReturn(dbMode, refundAmount) {
    let model = {};
    let rejectNo = 'R' + _config.posp.terminalNo + dateUtil.Format(new Date(), 'yyyyMMddhhmmssS');
    model.pospOrderNo = dbMode.PospOrderNo;
    model.thirdWindowNo = dbMode.UserCode;
    model.thirdOperatorNo = dbMode.UserCode;
    model.thirdOrderNo = dbMode.ThirdTransBussNo;
    model.custId = dbMode.CustId;
    model.rejectNo = rejectNo;
    model.outTradeNo = dbMode.MerchantOrderNo;
    model.rejectAmt = refundAmount;
    rejectNo = model.rejectNo;

    const QR2204 = require('../../service/pospTrans/QR2204')
    let qr2204 = new QR2204();
    let outmodel = await qr2204.execute(model)

    if (outmodel.respcode != "0000") {
      throw new Error("退款失败,原因" + outmodel.respmsg);
    }
    model = {};
    model.pospOrderNo = dbMode.PospOrderNo;
    model.custId = dbMode.CustId; //	前置订单号	是	终端上送，规则：P+终端号+yyyyMMddHHmmss
    model.rejectNo = rejectNo;
    model.outTradeNo = dbMode.MerchantOrderNo;
    model.orderId = dbMode.BankPayOrderNo;
    const QR2205 = require('../../service/pospTrans/QR2205')
    let qr2205 = new QR2205();
    outmodel = await qr2205.execute(model)
    if (outmodel.respcode != "0000") {
      throw new Error("退款失败,原因" + outmodel.respmsg);
    }
    return outmodel;
  }
  static async jyQrcodeReturn(dbMode, refundAmount) {
    let model = {};
    let rejectNo = 'R' + _config.posp.terminalNo + dateUtil.Format(new Date(), 'yyyyMMddhhmmssS');
    model.pospOrderNo = dbMode.PospOrderNo;
    model.thirdWindowNo = dbMode.UserCode;
    model.thirdOperatorNo = dbMode.UserCode;
    model.thirdOrderNo = dbMode.ThirdTransBussNo;
    model.outTradeNo = dbMode.MerchantOrderNo;

    model.outRejectNo = rejectNo; //商户退款单号	是	
    model.reqSysNo = _config.posp.SysTemNo + _config.posp.FenHangNo + dateUtil.Format(new Date(), 'yyyyMMddhhmmss') + _config.posp.terminalNo.substr(-6, 6); //日志跟踪号 =  4位系统号+4位分行号+8位日期+6位时间+银行卡终端号后6位 = 28 位
    model.guiYuanHao = dbMode.BankTellerNo; //	交易柜员号	是	例如：AEKR400
    model.oldTerminalNo = dbMode.BankTellerNo; //	原交易终端号	是	例如：终端上送00000139
    model.oldBatchNo = dbMode.BankTransBatchNo; //	原交易批次号  	是	例如：190610
    model.oldTraceNo = dbMode.BankTraceNo; //	原交易流水号   	是	例如：002132   终端号+批次号+流水号唯一
    model.rejectAmt = refundAmount; //退款金额	是		单位为元	 
    model.oldBankOrderNo = dbMode.BankPayOrderNo; //	原交易银行业务流水号	是	
    model.oldOutTradeNo = dbMode.MerchantOrderNo; //原交易商户交易单号		第	
    model.sndTpFlg = 1; //默认1
    model.memo = "" //备注	否	


    const JY5203 = require('../../service/pospTrans/JY5203')
    let jy5203 = new JY5203();
    let outmodel = await jy5203.execute(model)

    if (outmodel.respcode != "0000") {
      throw new Error("退款失败,原因" + outmodel.respmsg);
    }

    return outmodel;
  }

}

module.exports = new ReturnFee_Ctl;