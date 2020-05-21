const koa2Req = require('koa2-request');
const v4 = require('uuid');
const QS = require('qs');
const dateUtil = require('../Libs/date-utils')
// const fxp = require('fast-xml-parser');
const URL = require('url');
const httpRequest = async (address, json) => {
  console.log(address);
  console.log(json);
  // const addr = encodeURI(address)
  //   let url = `http://localhost:2222/wx/api/ship/getShipFee`
  var options = {
    method: 'post',
    url: address,
    json,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }
  }
 
  const res = await koa2Req(options).catch((err) => {
    console.log('我是错误的', err);
  })
  console.log(res.statusCode, res.body)
  return res.body.data
}
/**
 * 参数签名
 * @param params json参数
 * @param key 密钥
 * @returns {string}
 */
function genSignature(params, key) {
  var temp = "";
  Object.keys(params).sort().forEach(function (v, i) {
    if (v !== 'sign' && params[v]) {
      temp += v + "=" + params[v] + "&";
    }
  });
  var crypto = require('crypto');

  var sign = crypto.createHash('RSA').update(temp + "key=" + key, 'utf8').digest('hex');
  return sign.toUpperCase();
}
module.exports = {
  httpRequest
}