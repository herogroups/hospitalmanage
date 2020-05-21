const bankHosPospNet = require('../BankHosPospNet')
const dateUtil = require('../../Libs/date-utils')
const util = require('../../Libs/util')
const { pospLogger } = require('../../Libs/logger')
var _config =require('../../conf/config')
//医院
class YY9990 extends bankHosPospNet {

    async package(data, bussType, bussName) {
        let additiondata = { requestHead: {}, requestBody: { payInfo: {} } };
        let header = additiondata.requestHead;
        let body = additiondata.requestBody;
        header.busCode = "YY9990";
        header.transChannel = "02";
        header.hisTermianlNo = _config.posp.terminalNo;
        header.operNo = _config.posp.terminalNo;
        header.transNo = dateUtil.Format(new Date(), 'yyyyMMddhhmmssS');
        header.tradeDate = dateUtil.Format(new Date(), 'yyyyMMdd');
        header.tradeTime = dateUtil.Format(new Date(), 'hhmmss');
        header.mzlx = "1";

        header.transChannel = '02'
        let pospData = {};

        if (data.request.data.hasOwnProperty('hosCardNo')) {
            //   console.log('data.request.requestHead.busCode ',data.request.requestHead.busCode );
            if (data.request.requestHead.busCode != "1002" && data.request.requestHead.busCode != "1001" && data.request.requestHead.busCode != "4009") {
                pospData = await this.getHosParent(data.request.data)

                body = Object.assign(body, pospData);

            }
        }

        if (data.request.data.hasOwnProperty('payAmount')) {
            body.payInfo.payAmount = data.request.data.payAmount; // 实际支付金额 是 支付的金额
            body.payInfo.merchantNo = _config.posp.MCHID;
            body.payInfo.terminalNo = _config.posp.terminalNo;
            body.payInfo.paymentDate = header.tradeDate;
            body.payInfo.paymentTime = header.tradeTime;

        }
        if (data.request.data.hasOwnProperty('payMethod')) {
            body.payMethod = '微信支付'; // 实际支付金额 是 支付的金额
        }
        if (data.request.data.hasOwnProperty('pospOrderNo')) {
            body.payInfo.reference = data.request.data.pospOrderNo;//前置订单号
        }

        body.hisBussCode = data.request.requestHead.busCode;
        //   pospLogger.info("body1:",body)
        pospData.bussType = bussType;
        pospData.bussName = bussName;
        const YY1000 = require('../../service/pospTrans/YY1000') //引入前置
        let yy1000 = new YY1000();
        let yy1000Resp = await yy1000.execute(pospData) //发送到前置
        let pospOrderNo = yy1000Resp.pospOrderNo;
        header.pospOrderNo = pospOrderNo;
        //  pospLogger.info("additiondata:",additiondata)
        return additiondata;



    }
    async execute(data, bussType, bussName) {
        //  pospLogger.info("【转发Hos数据YY9990】")
        let args = util.parseJson2XML(data).replace(/\n/g, '')
        let sendstr = await this.package(data, bussType, bussName);

        let resp = await super.send('YY9990', args, sendstr)

        let recvdata = JSON.parse(resp.postdata).recvdata;
        return recvdata;
    }
    async getHosParent(data) {

        let dbp = require('../../DbLib/Ims/Ims_Account_DB');

        pospLogger.info("hosCardNo==========", data.hosCardNo)
        let resp = await dbp.getSingleByHosCardNo(data.hosCardNo)

        if (Array.isArray(resp) && resp.length > 0) {
            pospLogger.info("卡查询结果", resp)
            return this.switchPosp(resp[0]);
        } else {

            throw new Error("卡无法查询到");
        }

    }
    /**
     * 把His信息转成Posp需要的信息
     * @param  hospPatient 
     */
    switchPosp(hospPatient) {
        let model = {}
        model.hosCardNo = hospPatient.hosCardNo;
        model.hosCardType = (hospPatient.hosCardType == "1") ? '院内就诊卡' : '甘肃电子就诊卡'; //卡类型 是 1 院内就诊卡    2 院内电子就诊卡    3 甘肃电子就诊卡
        //  model.hosCardFrom = hospPatient.hosCardFrom; //卡来源 是 0 实体就诊卡    1 电子就诊卡
        model.sex = hospPatient.sex;
        model.phone = hospPatient.phone;
        model.certNo = hospPatient.certNo;
        model.patientId = hospPatient.patientId;
        return model;
    }

}
module.exports = YY9990;