const FinancePospNet = require('../FinancePospNet')
const dateUtil = require('../../Libs/date-utils')
const {pospLogger}=  require('../../Libs/logger')
const _config =require('../conf/config');
/**
 *  交易前预通知
 */
class TY1001 extends FinancePospNet {
     
    package(data) {
        let model = {};
        model.bussType = data.bussType; //	业务类型	是	业务类型 签约办卡 预约挂号取号  自助挂号  门诊充值缴费 住院预交金缴费 处方缴费
        model.transType = data.transType; //	交易类型	是	1 正交易 2 反交易
        model.pospOrderNo = data.pospOrderNo;//	前置订单号	是	终端上送，规则：P+终端号+yyyyMMddHHmmss
        model.merchantOrderNo = data.merchantOrderNo; //	商户订单号	否	
        model.rejectNo = data.rejectNo; //退款订单号	否	终端上送，规则：R+终端号+yyyyMMddHHmmss
        model.thirdWindowNo = _config.posp.winNo; //窗口号	是	用于对账文件，可填终端号后4位
        model.thirdOperatorNo = _config.posp.operNo; //操作员号	是	用于对账文件，可填终端号后4位
        model.thirdCusName = data.thirdCusName; //	第三方用户名	否	用于对账文件
        model.thirdCusTelNo = data.thirdCusTelNo; //	第三方电话号码	否	用于对账文件
        model.thirdCusId = data.thirdCusId; //	第三方用户ID		用于对账文件，例如病人ID
        model.thirdCusIDNum = data.thirdCusIDNum; //	第三方用户身份证号		用于对账文件
        model.thirdCusSex = data.thirdCusSex; //	第三方用户性别		详见附录二
        model.thirdCusNo = data.thirdCusNo; //	第三方用户号	是	比如就诊卡号  住院号等
        model.thirdOrderNo = data.thirdOrderNo; //	第三方交易单号	否	
        model.merchantNo =  _config.posp.MCHID; //	商户号	否	商户编号
        model.terminalNo = _config.posp.terminalNo; //	终端号	否	终端编号
        model.batchNo = data.batchNo; //批次号	否	批次号
        model.traceNo = data.traceNo; //流水号	否	流水号
        model.cusAccNo = data.cusAccNo; //支付账号	是	银行卡号或者微信用户的openid等
        model.payModel = data.payModel; //支付方式	是	详见附录一
        model.orderAmt = data.orderAmt; //订单金额	是	单位：元 73.00  消费时，订单金额，退款时，原交易订单金额
        model.rejectAmt = data.rejectAmt; //退款金额	否	单位：元 73.00  退款时必输
        model.tradeDate = dateUtil.Format(new Date(), 'yyyyMMdd');//交易日期	是	yyyyMMdd
        model.tradeTime = dateUtil.Format(new Date(), 'hhmmss');//交易时间	是	HHmmss
        model.oldSystemRefNo = data.oldSystemRefNo; //原交易系统检索号	否	退款时，必输
        model.oldTradeDate = data.oldTradeDate; //原交易日期	否	退款时，必输
        model.ChannelType='02';
        return model;
    }
   async execute(data) {
   pospLogger.info("【交易前预通知TY1001】")
        this._pospSend_str=JSON.stringify(data)
        let sendObj =  this.package(data) ;
     
        return await super.send('TY1001', "", sendObj,'WECHAT');
    }
   

}
module.exports = TY1001;