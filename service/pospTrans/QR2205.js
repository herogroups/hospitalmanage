const FinancePospNet = require('../FinancePospNet')
const dateUtil = require('../../Libs/date-utils')
const {pospLogger}=  require('../../Libs/logger')
const _config =require('../../conf/config');
//退款查询
class QR2205 extends FinancePospNet {
     
    package(data) {
        let model = data;
      
        model.msgId='MsgId'+_config.posp.terminalNo+dateUtil.Format(new Date(), 'yyyyMMddhhmmssS');
   
        return model;
    }
   async execute(data) {
   pospLogger.info("【退款查询QR2205】")
        this._pospSend_str=JSON.stringify(data)
        let sendObj =  this.package(data) ;
     
        return await super.send('QR2205', "", sendObj,'REFUNDPLATFORM');
    }
   

}
module.exports = QR2205;