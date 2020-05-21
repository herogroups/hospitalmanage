const IcbcNets = require('../IcbcNets')
const moment = require('moment')
const {
    pospLogger
} = require('../../Libs/logger')
//支付状态查询—银行
class QR2221 extends IcbcNets {

    package(datas) {
        let data = {
            tpAppId: "wxd836ab5f29d424a0",
            tpOpenId: "oTMHuvoLOHo3uIZmV-A6_YUjRNWo",
            OrderNo: "order" + moment().format('YYYYMMDDHHmmss'),
            reqClientIp: "127.0.0.1",
            cusName: '',
            attach: "12",
            amount: "0.01",
            goodsBody: '芬达',
            goodsDetail: {
                good_name: '芬达橙味300ml罐装',
                good_id: '1001',
                good_num: '1'
            },
            outTradeNo: "PD6" + moment().format('YYYYMMDDHHmmss'),
        }
        let model = {
            bussType: "自助挂号",
            pospOrderNo: "PD6" + moment().format('YYYYMMDDHHmmss'),
            thirdWindowNo: "000003",
            thirdOperatorNo: "LDZZ0001",
            thirdCusNo: "4947100007",
            thirdCusName: data.cusName,
            thirdCusTelNo: "13426295535",
            thirdOrderNo: data.OrderNo,
            thirdCusId: "4947-100007",
            thirdCusIDNum: "350781198810062434",
            thirdCusSex: "1",
            payBankCode: "01",
            payCode: "09",
            msgId: "MSgid" + moment().format('YYYYMMDDHHmmss'),
            channelId: "",
            tpAppId: data.tpAppId,
            tpOpenId: data.tpOpenId,
            outTradeNo: "PD6" + moment().format('YYYYMMDDHHmmss'),
            tranType: "OnlinePay",
            orderDate: moment().format('YYYYMMDDHHmmss'),
            endTime: moment().add(5, 'm').format('YYYYMMDDHHmmss'),
            goodsBody: data.goodsBody,
            goodsDetail: "{'good_name':'芬达橙味300ml罐装','good_id':'1001','good_num':'1'}",
            orderAmt: data.amount,
            attach: data.attach,
            spBillCreateIp: data.reqClientIp,
            installTimes: "1",
            merHint: "147",
            returnUrl: "http://www.lailai.club/payResult",
            payLimit: "",
            notifyUrl: "http://www.lailai.club/wechartMsg",
            notifyType: "HS",
            resultType: "0"
        }

        return model;
    }
    async execute(data) {

        this._pospSend_str = JSON.stringify(data)

        let sendObj = this.package(data);
        console.log('str:', sendObj);
        return await super.send('QR2221', "", sendObj, 'REFUNDPLATFORM');
    }


}
module.exports = QR2221;