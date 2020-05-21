const healthNet = require('../healthNet')
const dateUtil = require('../../Libs/date-utils')
const util = require('../../Libs/util')
const { pospLogger } = require('../../Libs/logger')

//从电子健康平台获取二维码数据
class GP1001 extends healthNet {

    package(data) {

        let additiondata = { ZJHM: '', ZJLX: '01', XM: '' }
        additiondata = Object.assign(additiondata, data)
        return additiondata;
    }
    /**
     * 从电子健康平台获取二维码数据
     * @param {附加数据} data 
     */
    async execute(data) {
        pospLogger.info("【获取电子健康前置订单号GP1002】",data)
        let sendstr = this.package(data);

        let resp = await super.send('GP1001', '', sendstr);
        let additiondata = JSON.parse(resp.postdata).additiondata;
      
        if (additiondata.RESCODE == "0") {
            return additiondata;
        }
        else {
            throw new Error(additiondata.RESMSG)
        }

    }


}
module.exports = GP1001;