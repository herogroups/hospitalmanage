const bankHosPospNet = require('../BankHosPospNet')
const dateUtil = require('../../Libs/date-utils')
const util = require('../../Libs/util')
const {pospLogger}=  require('../../Libs/logger')
const _config = require('../../conf/config')
//获取前置订单号
class YY1000 extends bankHosPospNet {
   
    package(data) {
        let additiondata= {requestHead:{},requestBody:{}};
        let header= additiondata.requestHead;
        let body= additiondata.requestBody;
        header.busCode= "YY1000";
        header.transChannel= "02";
        header.hisTermianlNo= _config.posp.terminalNo;
        header.operNo= _config.posp.terminalNo;
        header.transNo=dateUtil.Format(new Date(), 'yyyyMMddhhmmssS');
        header.pospOrderNo =header.transNo;
        header.tradeDate= dateUtil.Format(new Date(), 'yyyyMMdd');
        header.tradeTime=dateUtil.Format(new Date(), 'hhmmss'); 
        header.mzlx="1"; 
      
        body.bussType=data.bussType;
        body.bussName=data.bussName ;
      
        return additiondata;
    }
    /**
     * 前置订单号获取
     * @param {附加数据} data 
     */
   async execute(data) {
       pospLogger.info("【获取前置订单号YY1000】")
        let sendstr =  this.package(data) ;   
  
        let resp=  await super.send('YY1000', '', sendstr);
        let additiondata = JSON.parse( resp.postdata).additiondata;
        if (additiondata.responseHead.retCode=="00"){
            return additiondata.responseBody;
        }
        else{
            throw new Error(additiondata.responseHead.retMsg)
        }
          
    }
   

}
module.exports = YY1000;