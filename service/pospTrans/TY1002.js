const FinancePospNet = require('../FinancePospNet')
const dateUtil = require('../../Libs/date-utils')
const {pospLogger}=  require('../../Libs/logger')
/**交易结果通知 */
class TY1002 extends FinancePospNet {
   
    package(data) {
        let model = {};
        model.transType = data.transType;	//交易类型	是	1 正交易2 反交易
        model.pospOrderNo = data.pospOrderNo; //	前置订单号	是	预通知时上送的前置订单号一致
        model.merchantOrderNo = data.merchantOrderNo;	//商户订单号	否	商户订单号 消费时，商户订单号，退款时，原商户订单号
        model.rejectNo = data.rejectNo;	//退款订单号	否	预通知时上送的退款订单号一致
        model.bankOrderNo = data.bankOrderNo;	//银行订单号	否	银行订单号
        model.systemRefNo = data.systemRefNo;	//系统检索号	是	系统检索号
        model.result = data.result	;//交易结果	是	详见附录四
        model.description = data.description	;//交易结果	是	详见附录四
       
        return model;
    }
   async execute(data) {
   pospLogger.info("【交易结果通知TY1002】")
        let sendstr =  this.package(data) ;
 
        return await super.send('TY1002', "", sendstr,'WECHAT');
    }


}
module.exports = TY1002;