
const FinancePospNet = require('../FinancePospNet')
const dateUtil = require('../../Libs/date-utils')
const {pospLogger}=  require('../../Libs/logger')
const _config = require('../../conf/config')
hosServiceUrl
//支付状态查询—银行
class QR2202 extends FinancePospNet {

    package(data) {
        let model = data;

        model.msgId = 'MsgId' + _config.posp.terminalNo + dateUtil.Format(new Date(), 'yyyyMMddhhmmss');

        return model;
    }
    async execute(data) {
       pospLogger.info("【支付状态查询—银行QR2202】")
        this._pospSend_str = JSON.stringify(data)
        let sendObj = this.package(data);

        return await super.send('QR2202', "", sendObj, 'REFUNDPLATFORM');
    }


}
module.exports =  QR2202;