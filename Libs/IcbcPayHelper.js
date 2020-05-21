const path = require('path');
const fs = require('fs');
const moment = require('moment');
const crypto = require('crypto');
const v4 = require('uuid');
 
const conf = require('../conf/config')
let ALI_PAY_SETTINGS = {
    APP_ID: '10000000000000744001',
    APP_GATEWAY_URL: 'xxxxxxx', //用于接收支付宝异步通知
    AUTH_REDIRECT_URL: 'xxxxxxx', //第三方授权或用户信息授权后回调地址。授权链接中配置的redirect_uri的值必须与此值保持一致。
    APP_PRIVATE_KEY_PATH: path.join(__dirname, 'pem', 'remind', 'app-private.pem'), //应用私钥
    APP_PUBLIC_KEY_PATH: path.join(__dirname, 'pem', 'remind', 'app-public.pem'), //应用公钥
    ALI_PUBLIC_KEY_PATH: path.join(__dirname, 'pem', 'remind', 'ali-public.pem'), //阿里公钥
    AES_KEY: "2PvhN3xMo3J2Cps2wN8o/g==", //aes加密（暂未使用）
    RETURN_URL: 'www.lailai.clubpayResult',
    NOTIFY_URL: 'www.lailai.clubwechartMsg', //支付结果通知地址
    MER_ID: '240851030002', //商户号
    TP_APP_ID: '24050012652', // 公众账号ID e生活号:
    SERVICE_URL: 'https://gw.open.icbc.com.cn/ui/aggregate/payment/request/V2'
};


class IcbcPayHelper {

    /**
     * 构造方法
     * @param accountType 用于以后区分多支付账号
     */
    constructor(accountType) {
        this.accountType = accountType;
        this.accountSettings = ALI_PAY_SETTINGS;
    }

    /**
     * 构建app支付需要的参数
     * @param subject 商品名称
     * @param outTradeNo 自己商户的订单号
     * @param totalAmount 金额
     * @returns {string}
     */

    //  params.set('notify_url', this.accountSettings.APP_GATEWAY_URL);
    buildParams(content) {

          content = this._buildBizContent(content)
        let params = new Map();
        params.set('app_id', this.accountSettings.APP_ID);
        params.set('msg_id', 'Msgid'+ moment().format('YYYYMMDDHHmmss'));
        params.set('charset', 'UTF-8');
        params.set('sign_type', 'RSA2');
        params.set('timestamp', moment().format('YYYY-MM-DD HH:mm:ss'));
        params.set('encrypt_type', 'AES');
        params.set('format', 'json');
        params.set('biz_content',content);
        params.set('sign', this._buildSign(params));
        params.delete("biz_content")

    // params.set('app_id', this.accountSettings.APP_ID);
    //     params.set('msg_id', 'Msgid01');
    //     params.set('charset', 'UTF-8');
    //     params.set('sign_type', 'RSA2');
    //     params.set('timestamp', '2017-04-25 10:27:22');
    //     params.set('encrypt_type', 'AES');
    //     params.set('format', 'json');
    //     params.set('biz_content',content);
    //     params.set('sign', this._buildSign(params));
    //     params.delete("biz_content")

       let json=  this.mapToObj(params)
      
        // const QS = require('qs');
        // console.log('444444444---------------------',QS.stringify(json)); 
         let strUrl = Object.keys(json).map(function (key) {     
            return encodeURIComponent(key) + "=" + encodeURIComponent(json[key] );
        }).join("&");
        let mydata ="2017-04-25 10:27:22"
        console.log('-------------------------------------00000000000000000000000:', encodeURIComponent( mydata))


        // let urlObj =new URL(this.accountSettings.SERVICE_URL+strUrl)
        //  console.log('url',urlObj.toString()) ;
  
        let url= this.accountSettings.SERVICE_URL+"?"+strUrl;
        return  {url,content}//

    }
    mapToObj(strMap) {
        let obj = {};
        for (let [k, v] of strMap) {
            obj[k] = v;
        }
        return obj;
    }
    /**
     * 根据参数构建签名
     * @param paramsMap Map对象
     * @returns {number|PromiseLike<ArrayBuffer>}
     * @private
     */
    _buildSign(paramsMap) {
        //1.获取所有请求参数，不包括字节类型参数，如文件、字节流，剔除sign字段，剔除值为空的参数
        let paramsList = [...paramsMap].filter(([k1, v1]) => k1 !== 'sign' && v1);
        //2.按照字符的键值ASCII码递增排序
        paramsList.sort();
        //3.组合成“参数=参数值”的格式，并且把这些参数用&字符连接起来
        let paramsString = paramsList.map(([k, v]) => `${k}=${v}`).join('&');
        let path = new  URL(ALI_PAY_SETTINGS.SERVICE_URL).pathname;
        paramsString = path + "?" + paramsString;
        let privateKey = fs.readFileSync(this.accountSettings.APP_PRIVATE_KEY_PATH, 'utf8').toString();
        let signType = paramsMap.get('sign_type');
      //  paramsString ="/ui/aggregate/payment/request/V2?app_id=10000000000000744001&biz_content=3IZTp3MPLQUE0SjMNRrTo16mHQQM1Tj180vbVvA6t72wvE55KgRiSUYNDu+Yxv0XT9Ue6l/jcp6ovvrSEC3r8HRfttjlUDy9yVtvM6Ssm6D8YacZnSL8n7RHbw7zBtUmH1BYFO0JyUh3niXcHvkwKU7+p0LewVo3MaoJoDw/Q8IfVKjkzj4T8haWrCWv8UACAHnIu25xjEvQRS60c+oEB4aDm37VH+Re22q/8LAFjYXlekR9tQOG08I9BqUn+v/fW7dVS9R6632z9EpJLrBdc85ubWre5HIdcP27rVNaTU7BEGj18aQv7nnvJQ0S2s5uAJh3EESfHhfTfgGd20u3nw7yFvs1Vy6bXAtH7cdSqyal7NRR+M/uKnT5mpb7DeC7eEioFU6hJtYTpoAhiiIEwAi/iVGErgCIEXi6KrsnR+yrZ50v0QZKRrsZX5Ho8UwrDwpYp/zJnTwvc93n5wmo9/8jbPJ68ep8EwNzdsiW21vBmHCwqaJisU9xaKa1lv6BX7pzdthLvRUsNmL/U+/nQ+EetDq7LQLaExstJTShvARz6yHIYfjxmfN77SgSXHvGh1zFEcrNJK4vD/KUrkqBdGVfQQ6dCYhBlXax7xuCkOueyxUXIZNxWy/+OZlBcwvw32c6U3eJjOWEtJdQb+opBS28dUUOI9GtQq0SFhplZG5b9egGbA/+BnSKL+qdxovVNkffl8peR8Y+co1DM/vXfkz57MjeVj9hTF5yimeQOPAD5hoEtUaY9Erijzv7ouRKQrjZPbKvvRwX+40HnTlFokurqbsDvNjDkgXnyN27iUGnPeuFjlQYcMIMdZ5UdE8gnAXr9heBeUitV43PRrFRwg==&charset=UTF-8&encrypt_type=AES&format=json&msg_id=Msgid20200319163421&sign_type=RSA2&timestamp=2020-03-19 16:34:23"
         let result = this._signWithPrivateKey(signType, paramsString, privateKey);

      
        return result
    }

    /**
     * 通过私钥给字符串签名
     * @param signType 返回参数的签名类型：RSA2或RSA
     * @param content 需要加密的字符串
     * @param privateKey 私钥
     * @returns {number | PromiseLike<ArrayBuffer>}
     * @private
     */
    _signWithPrivateKey(signType, content, privateKey) {
        let sign;
        if (signType.toUpperCase() === 'RSA2') {

            sign = crypto.createSign("RSA-SHA256");
            console.log('-------------------------------------------------------------------------------------------------');

        } else if (signType.toUpperCase() === 'RSA') {
            sign = crypto.createSign("RSA-SHA1");

        } else {
            throw new Error('请传入正确的签名方式，signType：' + signType);
        }

        sign.update(  content);
       let result = sign.sign(privateKey, 'base64')
       console.log("content:",content)
       console.log('sign:',result);

        return result;
    }

    /**
     * 生成业务请求参数的集合
     * @param subject 商品的标题/交易标题/订单标题/订单关键字等。
     * @param outTradeNo 商户网站唯一订单号
     * @param totalAmount 订单总金额，单位为元，精确到小数点后两位，取值范围[0.01,100000000]
     * @returns {string} json字符串
     * @private   openid, subject,goods_detail, outTradeNo, totalAmount,attach,spbill_create_ip
     */
    _buildBizContent(content) {
        let bizContent = {
            interface_version: '1.0.0.1', //	str	true	7	接口号，目前仅支持上送1.0.0.1	1.0.0.1
            mer_id: ALI_PAY_SETTINGS.MER_ID, //15	商户号	020001020461
            channel_id:'',//	str	false	30	渠道商号；商户通过渠道商接入时必送。目前暂不支持上送。	C020001020121
            tp_app_id: conf.weichat.appId, //	str	false	32	第三方应用ID；商户在微信公众号内接入时必送，上送微信分配的公众账号ID；商户通过支付宝生活号接入时必送，上送支付宝分配的应用ID。目前暂不支持上送。	wx8987989999999
            tp_open_id: content.openid, //	str	false	128	第三方用户标识；商户在微信公众号/支付宝生活号内接入时必送，上送用户在商户appid下的唯一标识。 目前暂不支持上送。	oUSDOusdsdISLSDlskdf
            out_trade_no: content.outTradeNo, //	str	true	35	商户订单号；需保证商户系统唯一	20171213102409655518
            tran_type: 'OnlinePay', //	str	true	10	交易类型。用于区分交易场景为线上支付还是线下支付，对应数据字典：OfflinePay-线下支付，OnlinePay-线上支付。商户需按实际交易场景上送，如上送错误可能影响后续交易的进行；比如线上支付场景，上送OfflinePay-线下支付，使用微信支付时，微信会对实际交易场景进行检查，一旦发现不符，微信侧会拒绝对应交易请求	OfflinePay
            order_date:'20200319214522', //str	true	14	交易提交时间， 格式为：YYYYMMDDHHmmss	20171213102409
            end_time:'20200319215822' , //	str	true	14	交易过期时间，格式为：YYYYMMDDHHmmss。建议上送为order_date之后的五分钟或者固定为每晚11点这种形式。	20171213102909
            goods_body: content.subject, //	str	true	30	商品描述	芬达
            goods_detail: content.goods_detail, //	str	true	128	商品详情	{‘good_name’:’芬达橙味300ml罐装’,’good_id’:’1001’,’good_num’:’1’}
            attach: content.attach, //	str	false	100	附加数据。商户可上送定制信息（如商户会话ID、终端设备编号等），在支付结束后的支付结果通知报文中该字段原样返回,该字样可以在对账单中体现	友宝
            order_amount: content.totalAmount, //	str	true	10	总金额（单位：分）	10000
            spbill_create_ip:'172.22.3.1', //	str	true	30	终端ip	
            install_times: '1', //	str	true	30	分期期数。目前仅支持1-不分期	1
            mer_hint: '特殊商品，支付后不退不换', //	str	false	100	商家提示。目前暂无处理，后续可用于在交易页面回显给客户	特殊商品，支付后不退不换
            return_url:   ALI_PAY_SETTINGS.RETURN_URL, //	str	true	100	支付成功回显页面。支付成功后，客户端引导跳转至该页面显示	http://paycenter.uboxol.com/payment/notify/icbcpay_wap
            pay_limit: 'no_credit', //	str	false	100	支付方式限定；上送”no_credit“表示不支持信用卡支付；不上送或上送空表示无限制；上送“no_balance”表示仅支持银行卡支付（需要微信审批通过后可以接入）	no_credit
            notify_url:  ALI_PAY_SETTINGS.NOTIFY_URL, //	str	true	100	支付结果通知地址；上送互联网可访问的完整URL地址（必须包含协议）；应支持受理同一笔订单的多次通知场景	https://www.scgsj.com/notify.do
            notify_type: 'HS', //	str	true	2	通知类型，表示在交易处理完成后把交易结果通知商户的处理模式。 取值“HS”：在交易完成后将通知信息，主动发送给商户，发送地址为notify_url指定地址； 取值“AG”：在交易完成后不通知商户	HS
            result_type: '0', //str	true	1	结果发送类型，通知方式为HS时有效。取值“0”：无论支付成功或者失败，银行都向商户发送交易通知信息；取值“1”，银行只向商户发送交易成功的通知信息	0
            backup1: "",
            backup2: "",
            backup3: "",
            backup4: "",
            channel_id: "",
        };


        // bizContent=  {
        //     "attach": "",
        //     "backup1": "",
        //     "backup2": "",
        //     "backup3": "",
        //     "backup4": "",
        //     "channel_id": "",
        //     "end_time": "20200319155813",
        //     "goods_body": "芬达",
        //     "goods_detail": "{'good_name':'芬达橙味300ml罐装','good_id':'1001','good_num':'1'}",
        //     "install_times": "1",
        //     "interface_version": "1.0.0.1",
        //     "mer_hint": "特殊商品，支付后不退不换",
        //     "mer_id": "240851030002",
        //     "notify_type": "HS",
        //     "notify_url": "www.lailai.club\/wechartMsg",
        //     "order_amount": "1",
        //     "order_date": "20200319155313",
        //     "out_trade_no": "P20200319155313",
        //     "pay_limit": "no_credit",
        //     "result_type": "0",
        //     "return_url": "www.lailai.club\/payResult",
        //     "spbill_create_ip": "172.22.3.1",
        //     "tp_app_id": "wxd836ab5f29d424a0",
        //     "tp_open_id": "oTMHuvoLOHo3uIZmV-A6_YUjRNWo",
        //     "tran_type": "OnlinePay"
        // }
        

        console.log('==============');
        console.log(bizContent);
        console.log('==============');
        let strJson = JSON.stringify(this.sortObjByKey(bizContent))
         // strJson ="{\"attach\":\"\",\"backup1\":\"\",\"backup2\":\"\",\"backup3\":\"\",\"backup4\":\"\",\"channel_id\":\"\",\"end_time\":\"20200319215822\",\"goods_body\":\"芬达\",\"goods_detail\":\"\",\"install_times\":\"1\",\"interface_version\":\"1.0.0.1\",\"mer_hint\":\"特殊商品，支付后不退不换\",\"mer_id\":\"240851030002\",\"notify_type\":\"HS\",\"notify_url\":\"www.lailai.club\\/wechartMsg\",\"order_amount\":\"1\",\"order_date\":\"20200319214522\",\"out_trade_no\":\"P122222\",\"pay_limit\":\"no_credit\",\"result_type\":\"0\",\"return_url\":\"www.lailai.club\\/payResult\",\"spbill_create_ip\":\"172.22.3.1\",\"tp_app_id\":\"wxd836ab5f29d424a0\",\"tp_open_id\":\"oTMHuvoLOHo3uIZmV-A6_YUjRNWo\",\"tran_type\":\"OnlinePay\"}"
       console.log(strJson);
        console.log("+++++++++++++++++++++++++++++++++++");
        let aesutil = require('./aesutil');
        let strContent = aesutil.encrypt(ALI_PAY_SETTINGS.AES_KEY, strJson)  
        return strContent;
    }
    sortObjByKey(obj) {
        var keys = Object.keys(obj).sort();
        var newObj = {}
        for (var i = 0; i < keys.length; i++) {
            var index = keys[i];
            newObj[index] = obj[index];
        }
        return newObj;
    }

    /**
     * 验证支付宝异步通知的合法性
     * @param params 支付宝异步通知结果的参数
     * @returns {*}
     */
    verifySign(params) {
        try {
            let sign = params['sign']; //签名
            let signType = params['sign_type']; //签名类型
            let paramsMap = new Map();
            for (let key in params) {
                paramsMap.set(key, params[key]);
            }
            let paramsList = [...paramsMap].filter(([k1, v1]) => k1 !== 'sign' && k1 !== 'sign_type' && v1);
            //2.按照字符的键值ASCII码递增排序
            paramsList.sort();
            //3.组合成“参数=参数值”的格式，并且把这些参数用&字符连接起来
            let paramsString = paramsList.map(([k, v]) => `${k}=${decodeURIComponent(v)}`).join('&');
            let publicKey = fs.readFileSync(this.accountSettings.ALI_PUBLIC_KEY_PATH, 'utf8');
            return this._verifyWithPublicKey(signType, sign, paramsString, publicKey);
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * 验证签名
     * @param signType 返回参数的签名类型：RSA2或RSA
     * @param sign 返回参数的签名
     * @param content 参数组成的待验签串
     * @param publicKey 支付宝公钥
     * @returns {*} 是否验证成功
     * @private
     */
    _verifyWithPublicKey(signType, sign, content, publicKey) {
        try {
            let verify;
            if (signType.toUpperCase() === 'RSA2') {
                verify = crypto.createVerify('RSA-SHA256');
            } else if (signType.toUpperCase() === 'RSA') {
                verify = crypto.createVerify('RSA-SHA1');
            } else {
                throw new Error('未知signType：' + signType);
            }
            verify.update(content);
            return verify.verify(publicKey, sign, 'base64')
        } catch (err) {
            console.error(err);
            return false;
        }
    }



}

module.exports = IcbcPayHelper;