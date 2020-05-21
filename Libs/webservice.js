var soap = require('soap');
const util = require('../Libs/util')
const _config =require('../conf/config')
const {pospLogger }  = require('../Libs/logger');

function callService(url, args) {
 
  return new Promise((resolve, reject) => {
    soap.createClient(url, function (err, client) {
  
      if (err) {
        reject(err);
        return ;
      }
    
      client.HelloWorld(args, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.HelloWorldResult);
        }
      });
    });
  })
}

exports.getHosService = async (busCode, data, bussType, bussName) => {
 
  let req ={request:{
    requestHead:{},
    data:{}
  }}
  let head = req.request.requestHead 

  head.busCode = busCode;
  head.hosCode = _config.posp.hosCode;
  head.tradeSrc = _config.posp.tradeSrc;
  head.terminalNo = _config.posp.terminalNo;
  head.operNo = _config.posp.operNo;
  head.tradeDate = util.dateFtt('yyyyMMdd', new Date());
  head.tradeTime = util.dateFtt('hhmmss', new Date());
  req.request.data = data;
  pospLogger.info('------------------------',busCode,'-', bussType,'-', bussName,'---------------------------');
  pospLogger.info('【inToJson】', JSON.stringify( req));
  let args = util.parseJson2XML(req).replace(/\n/g, '')
  
  pospLogger.info('【hosInxml】：', args);
  const YY9990 = require('../service/pospTrans/YY9990') //引入前置
    let yy9990= new YY9990();
   let ret= await yy9990.execute(req, bussType, bussName) //发送到前置 
   pospLogger.info('【Outxml】', ret);

   let msg = await util.parseXMLAsync(ret); //将字符串解析成XML 
  
  return msg.response;

};