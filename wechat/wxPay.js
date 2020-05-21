//接口配置

const wxpayapi = require('wxpay-nodejs');
var _uuid = require('uuid');
var _md = require('md5');
var _config =require('../conf/config')
const path = require('path');
const fs = require('fs');

var mainConfig = {
    APPID: _config.weichat.appId, //微信分配的公众账号ID（企业号corpid即为此appId）
    MCHID: _config.weichat.MCHID, //微信支付分配的商户号
    KEY: _config.weichat.KEY,
    APPSECRET:_config.weichat.appSecret,
    CERT_FILE: path.resolve(__dirname, 'cert/apiclient_cert.pem'),
    CERT_KEY_FILE: path.resolve(__dirname, 'cert/apiclient_key.pem'),
    CA_FILE: path.resolve(__dirname, 'cert/apiclient_cert.p12'),
    TIMEOUT: 3000,
    NOTIFY_URL:_config.weichat.notify_url
};
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

    var sign = crypto.createHash('md5').update(temp + "key=" + key, 'utf8').digest('hex');
    return sign.toUpperCase();
}
class WxPay {
    constructor() {
        console.log('mainConfig', mainConfig)
        wxpayapi.initialize(mainConfig);
    }
    //2.统一下单
    unifiedorder(openid, attach, body, out_trade_no, total_fee) {
        let wxpayUtil = require('./wxpayUtil')
        const { imsLogger } = require('../Libs/logger')
        let nonce_str = wxpayUtil.createNonceStr()
        let notify_url = mainConfig.NOTIFY_URL;
        imsLogger.info('获取金额前', total_fee)
        total_fee = wxpayUtil.getmoney(total_fee);
        imsLogger.info('wxpayUtil.getmoney', total_fee)
        var data = {
            openid: openid,
            attach: attach,
            body: body,
            nonce_str: nonce_str,
            notify_url: notify_url,
            out_trade_no: out_trade_no,
            total_fee: total_fee,
            trade_type: "JSAPI"
        };
        console.log('统一下单', data)
        return new Promise((resolve, reject) => {

            wxpayapi.unifiedorder(data).then((res) => {
                if (res.result_code != 'SUCCESS') {
                    reject(new Error(res.err_code_des))
                }
                let data = {};
                data.appId = res.appid
                data.timeStamp = wxpayUtil.createTimeStamp();

                data.nonceStr = res.nonce_str;
                data.package = "prepay_id=" + res.prepay_id;
                data.signType = 'MD5'
                let sign = genSignature(data, _config.weichat.KEY);
                data.prepay_id = res.prepay_id;
                data.paySign = sign;
                data.signature = sign;
                resolve(data)
            }, (e) => {
                reject(e)
            });
        });
    }
    //3.查询订单
    /** */
    orderquery(trade_no) {
        var data = {
            out_trade_no: trade_no
        };
        return new Promise((resolve, reject) => {
            wxpayapi.orderquery(data).then((res) => {
                if (res.result_code != 'SUCCESS') {
                    reject(new Error(res.err_code_des))
                }
                resolve(res)
            }, (e) => {
                reject(e)
            });
        });

    }
    //4.关闭订单
    closeOrder(trade_no) {
        var data = {
            out_trade_no: trade_no
        };
        return new Promise((resolve, reject) => {
            wxpayapi.closeorder(data).then((res) => {
                if (res.result_code != 'SUCCESS') {
                    reject(new Error(res.err_code_des))
                }
                resolve(res)
            }, (e) => {
                reject(e)
            });
        });

    }
    //5.退款
    refund(out_trade_no, out_refund_no, total_fee, refund_fee, refund_desc) {
        var data = {};
        data.out_trade_no = out_trade_no; //	商户订单号String(32)	1217752501201407033233368018	商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。
        data.out_refund_no = out_refund_no;	//商户退款单号是	String(64)	1217752501201407033233368018	商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
        data.total_fee = Number(total_fee) * 100;	 //标价金额是	Int	888	标价金额，单位为该币种最小计算单位，只能为整数，详见标价金额
        data.refund_fee = Number(refund_fee) * 100; //	退款金额是	Int	100	退款总金额，订单总金额，单位为分，只能为整数，详见支付金额
        //  data.refund_fee_type=refund_fee_type; //商户退款币种	否	String(8)	GBP	退款币种必须和标价币种一致，币种列表详见标价币种
        data.refund_desc = refund_desc;	//退款原因否	String(80)	商品已售完	若商户传入，会在下发给用户的退款消息中体现退款原因
        let fs = require("fs");
        let option = {
            cert: fs.readFileSync(mainConfig.CERT_FILE),
            key: fs.readFileSync(mainConfig.CERT_KEY_FILE),
        }
        console.log('fs', option);
        return new Promise((resolve, reject) => {
            wxpayapi.refund(data).then((res) => {
                if (res.result_code != 'SUCCESS') {
                    reject(new Error(res.err_code_des))
                }
                resolve(res)
            }, (e) => {
                reject(e)
            });
        });

    }
    //6.查询退款
    refundQuery(transaction_id, out_trade_no, device_info, refund_no, refund_id) {
        var data = {
            transaction_id: transaction_id,
            out_trade_no: out_trade_no,
            device_info: device_info,
            out_refund_no: refund_no,
            refund_id: refund_id
        };
        return new Promise((resolve, reject) => {
            wxpayapi.refundquery(data).then((res) => {
                if (res.result_code != 'SUCCESS') {
                    reject(new Error(res.err_code_des))
                }
                resolve(res)
            }, (e) => {
                reject(e)
            });
        });

    }
    //7.下载对账文件
    /** 
     * https://api.mch.weixin.qq.com/pay/downloadbill
     */

    downloadbill(bill_date) {
        var data = {
            bill_date: bill_date,
            bill_type: 'ALL'
        };
        var axios = require('axios');
        let url = 'https://api.mch.weixin.qq.com/pay/downloadbill'
        console.log('this.mainConfig=', mainConfig);
        let sendData = makeRequestBody(data, mainConfig)
        return new Promise((resolve, reject) => {
            axios.post(url, sendData, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }).then(function (res) {
                if (res.result_code == 'FAIL') {
                    reject(new Error(res.return_msg))
                }

                resolve(res.data);
            }).catch(function (err) {
                reject(err)
            });
        })

        // return new Promise((resolve, reject) => {
        //     wxpayapi.downloadbill(data).then((res) => {
        //      console.log('res==',res);
        //         if (res.result_code == 'FAIL') {
        //             reject(new Error(res.return_msg))
        //         }
        //         resolve(res)
        //     });
        // });

    }
}
makeRequestBody = function (data, _config) {

    var temp = Object.assign({}, data);
    temp.appid = _config.APPID;
    temp.mch_id = _config.MCHID;

    temp.nonce_str = genNonceStr();
    var body = getSignXML(temp, _config.KEY);

    return body;
};

function genNonceStr() {

    return _uuid.v4().replace(/\-/g, "");
}
/**
 * 参数签名并转成xml
 * @param params
 * @param key
 */
/**
 * Created by linyi on 16/8/8.
 */
function getSignXML(params, key) {
    var _xml2js = require('xml2js');
    params["sign"] = genSignature(params, key);
    var builder = new _xml2js.Builder({
        rootName: "xml"
    });
    return builder.buildObject(params);
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
    var sign = _md(temp + "key=" + key).toUpperCase();
    return sign;
}

module.exports = WxPay;