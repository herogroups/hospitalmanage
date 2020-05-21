const healthNet = require('../healthNet')
const dateUtil = require('../../Libs/date-utils')
const util = require('../../Libs/util')
const { pospLogger } = require('../../Libs/logger')

//电子健康卡注册
class GP1002 extends healthNet {

    package(data) {
        let additiondata = {
            SQFS: '2',
            ZJLXDM: '01',
            ZJLXMC: '身份证号码',
            ZJHM: '',
            XM: '',
            XBDM: '',
            BRDHHM: '',
            MZDM: '',
            CSRQ: ''
        };
        additiondata = Object.assign(additiondata, data)
        additiondata.CSRQ = util.IdCard(data.ZJHM,1);
        additiondata.XBDM = util.IdCard(data.ZJHM,2);
        return additiondata;
    }
      
    /**
     * 前置订单号获取
     * @param {附加数据} data 
     */
    async execute(data) {
        pospLogger.info("【获取电子健康前置订单号GP1001】")
        let sendstr = this.package(data);

        let resp = await super.send('GP1002', '', sendstr);
        let additiondata = JSON.parse(resp.postdata).additiondata;
        if (additiondata.RESCODE == "0") {
            return additiondata;
        }
        else {
            throw new Error(additiondata.RESMSG)
        }
    }

}

module.exports = GP1002;