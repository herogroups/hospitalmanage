const bankHosPospNet = require('../BankHosPospNet')
const dateUtil = require('../../Libs/date-utils')
const util = require('../../Libs/util')
const _config = require('../../conf/config')
const { pospLogger } = require('../../Libs/logger')
//获取前置订单号
class YY9991 extends bankHosPospNet {

    package(data) {
        let additiondata = { requestHead: {}, requestBody: {} };
        let header = additiondata.requestHead;
        let body = additiondata.requestBody;
        header.busCode = "YY9991";
        header.transChannel = "02";
        header.hisTermianlNo = _config.posp.terminalNo;
        header.operNo = _config.terminalNo;
        header.transNo = dateUtil.Format(new Date(), 'yyyyMMddhhmmssS');
        header.pospOrderNo = data.pospOrderNo;
        header.tradeDate = dateUtil.Format(new Date(), 'yyyyMMdd');
        header.tradeTime = dateUtil.Format(new Date(), 'hhmmss');
        header.mzlx = "1";
        header.operationFlow = '业务结束';
        body.bussResult = data.bussResult;
        body.description = data.description;

        return additiondata;
    }
    /**
     * 前置订单号获取
     * @param {附加数据} data 
     */
    async execute(data) {
        pospLogger.info("【交易通知YY9991】")
        let sendstr = this.package(data);

        let resp = await super.send('YY9991', '', sendstr);
        let additiondata = JSON.parse(resp.postdata).additiondata;
        if (additiondata.responseHead.retCode == "00") {
            return additiondata.responseBody;
        }
        else {
            throw new Error(additiondata.responseHead.retMsg)
        }

    }


}
module.exports = YY9991;