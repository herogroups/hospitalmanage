const socketClient = require('../Libs/socketClient')
const dateUtil = require('../Libs/date-utils')
const _uuid = require('uuid')
const {pospLogger}=  require('../Libs/logger')
var _config =require('../conf/config');
class BankHosPospNet {
    constructor(){
      
    }
    
    packData(transtype, sendBody, additionBody) {
        let sendData={};
        let postData = {};
        postData.senddata = sendBody;
        postData.additiondata =additionBody;//透传数据
      
        let spostdata = JSON.stringify(postData)
        let dataLen = Buffer.from(spostdata).length;
        sendData.version = "1.0.0"; 
        sendData.msgsender = "WECHAT";
        sendData.msgrecv = "POSP";
        sendData.imei = _config.posp.terminalNo;
        sendData.transno = dateUtil.Format(new Date(), 'yyyyMMddhhmmssS');
       
        sendData.transtype = transtype;
        sendData.transdate = dateUtil.Format(new Date(), 'yyyyMMdd');
        sendData.transtime = dateUtil.Format(new Date(), 'hhmmss');
        sendData.guidcode = _uuid.v4().replace(/\-/g, "");
        sendData.requestkey = "asdfghjkl";
        sendData.encrypttype = "0";
        sendData.postlength = dataLen;
        sendData.postdata = spostdata; //":{\"requestHead\":{\"busCode\":\"YY1007\",\"transChannel\":\"01\",\"terminalNo\":\"00000018\",\"operNo\":\"8912\",\"transNo\":\"000000182019042312083646847\",\"tradeDate\":\"20190423\",\"tradeTime\":\"120836\",\"mzlx\":\"1\",\"pospOrderNo\":\"PON0000001820190423120907\",\"deptId\":\"10035\"},\"requestBody\":{\"schedulingDate\":\"20190423\",\"schedulingType\":\"01\",\"orderId\":\"1\",\"typeId\":\"1\",\"deptId\":\"10035\",\"requestPage\":\"1\",\"pageSize\":\"50\"}}}",
        sendData.macvalue = null;
        sendData.respcode = null;
        sendData.respmsg = null;
        sendData.port = 0
        return JSON.stringify(sendData)
    }
    async send(transtype, senddata, additiondata) {
   
        let packstr = this.packData(transtype, senddata, additiondata) 
      
        
        let config = {
            transPort: _config.posp.BankHosPospPort,
            transIp: _config.posp.BankHosPospIp
        }
      
        let pagebody = Buffer.from(packstr)
        let len = pagebody.length;
        let head = Buffer.from(transtype.substr(0,2))
        let buflen = Buffer.alloc(4, 0);
        buflen[2] = parseInt(len / 256)
        buflen[3] = parseInt(len % 256)

        let sendData = Buffer.concat([head, buflen, pagebody], len + buflen.length + head.length); 
        let sc = new socketClient(config);
      
        let rec= await sc.start(sendData)
        pospLogger.info('[接收]：',rec)
        return rec;
    }

}
module.exports = BankHosPospNet;