
var soap = require('soap');
const util = require('../../Libs/util')
const _config =require('../conf/config');
const { pospLogger } = require('../../Libs/logger');
//
/**
 * 注册新的居民健康
 * @param {*} url 
 * @param {*} args 
 */
function patientRegiste(url, args) {

  return new Promise((resolve, reject) => {
    soap.createClient(url, function (err, client) {

      if (err) {
        reject(err);
        return;
      }

      client.patientRegiste(args, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.HelloWorldResult);
        }
      });
    });
  })
}

/**
 * 查询居民健康平台参数
 * @param {*} url 
 * @param {*} args 
 */
async function patientSearch(url, args) {

  let req = {
    root: {
      request: {
        CITYCODE: '620700',

        YLJGDM: '620000075494',
        ZJLX: '01',
        ZJHM: '350426197512010059',
        XM: '柯永林',
        VUID: '',
        CHILDREN: ''
      }
    }
  }
  req = {
    root: {
      request: {
        YLJGDM: '620000075494',
        ZJHM: '',
        ZJLX: '00',
        XM: '',
        VUID: '0172B997509759ADA07C694A45446EA6974C9DDFAC3FAA475772B83707B43A05'
      }
    }
  }
  args = await util.parseJson2XML(req).replace(/\n/g, '')
  args="<![CDATA["+args+"]]>"
  console.log('args', args);
  return new Promise((resolve, reject) => {
    let options = { escapeXML: true }
    soap.createClient(url, options, function (err, client) {

      if (err) {
        reject(err);
        return;
      }
      console.log('arg66666666666666s', args);
      client.patientSearch(args, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.HelloWorldResult);
        }
      });
    });
  })
}

exports.healthService = async (data) => {

  // ; 医疗机构代码
  // YLJGDM = 620000075494
  //   ; 机构所在地区编码
  // CITYCODE = 620700
  //   ; 服务请求地址


  let req = {
    root: {
      request: {
        CITYCODE: '620700',
        SQFS: '2',
        YLJGDM: '620000075494',
        ZJLXDM: '01',
        ZJLXMC: '身份份证号码',
        ZJHM: '350426197512010059',
        XM: '柯永林',
        XBDM: '2',
        BRDHHM: '18106023331',
        MZDM: '01',
      }
    }
  }

  req = Object.assign(req.root.request, data)
  let args = util.parseJson2XML(req).replace(/\n/g, '')
  console.log('args', args);
  pospLogger.info('【healthInxml】：', args);
  const _config =require('../../conf/config');
  let param = {
    xmlStr: args
  };
 
  let ret = await patientSearch(_config.eHealthPosp.hosServiceUrl, args).catch(err => {
    throw new Error('连接居民健康接口出现异常' + err.message);
  })
  pospLogger.info('Outxml', ret);
  let msg = await util.parseXMLAsync(ret); //将字符串解析成XML 
  pospLogger.info('【outToJson】', ret);
  return msg.response;

};