var http = require('../naxios')
const path = require('path');
const util = require('../../libs/util');
const eHealth_file = path.join(__dirname, '../../conf/eHealth.txt');
const _uuid = require('uuid')
const { pospLogger } = require('../../Libs/logger')
const config = require('../../conf/config')
const crypto = require('crypto');

class eHealthNet {

    constructor() {

    }

    async send(method, reqRef) {

        await this.getAppToken();
        let url = config.healthUrl;
        let reqBody = {
            commonIn: this.getCommonIn(),
            req:reqRef,
        }
    
     
        let sign= this.getSign(reqBody)
   
        reqBody.commonIn.sign =sign;
        pospLogger.info("-----------------------------------"+method+"-------------------------------------------")
        pospLogger.info("健康平台【发送】：",JSON.stringify(reqBody))
        var resp = await http.post(url + method, reqBody)
        pospLogger.info("健康平台【接收】：",JSON.stringify(resp))
      
        if (resp.commonOut) {
            if (resp.commonOut.resultCode == 0) {
                return resp.rsp;
            } else {
                throw new Error(resp.commonOut.errMsg)
            }
        } else {
            throw new Error(resp.commonOut.errMsg)
        }


    }
    /**
  * 获取接口调用凭证appToken接口
  */
    async   getAppToken() {



        //获取access_token
        let data = await this.getAccessToken();
        //判断读取的内容是否存在、是否为空字符串，如果是的话进行更新
        if (data && data.length != 0) {
            data = JSON.parse(data);
            //判断是否合法
            if (!this.isValidAccessToken(data)) {
                data = await this.updateAccessToken();
            }
        } else {
            data = await this.updateAccessToken();
        }
        this.appToken = data.appToken;
        this.expiresIn = data.expiresIn;
        this.saveAccessToken(JSON.stringify(data));


    }

    /**
     * 判断AccessToken
     * @param {*} data 
     */

    isValidAccessToken(data) {

        if (!data || !data.appToken || !data.expiresIn) {
            return false;
        }
        return new Date().getTime() < data.expiresIn ? true : false;
    }
    //更新AccessToken
    async updateAccessToken() {

        let url = config.healthUrl;

        let req = { appId: config.healthAppid }
        let reqBody = {
            commonIn: this.getCommonIn(),
            req: req,
        }
        reqBody.commonIn.appToken = '';

        reqBody.commonIn.sign = this.getSign(reqBody)
        console.log('reqBody',reqBody)
        var res = await http.post('https://p-healthopen.tengmed.com/rest/auth/HealthCard/HealthOpenAuth/AuthObj/getAppToken', reqBody)
       console.log(res)

        var data = res.commonOut;

        if (data != undefined) {
            if (data.resultCode == 0) {
                let rsp = res.rsp
                rsp.expiresIn = new Date().getTime() + (rsp.expiresIn - 20) * 1000;
                return rsp;
            } else {
                throw new Error(data.errMsg)
            }
        } else {
            throw new Error("异常错误")
        }


    }
    //设置报文commonIn对象
    getCommonIn() {
        let commonIn = {
            appToken: this.appToken,
            requestId: _uuid.v4().replace(/\-/g, ""),
            hospitalId: config.healthHospitalId,
            timestamp: Math.floor(Date.now() / 1000),
            channelNum: config.healthChannelNum

        }

        return commonIn;
    }
    /**
     * 获取AccessToken
     */
    getAccessToken() {
        return util.readFileAsync(eHealth_file, 'utf-8');
    }
    /**
     * 保存AccessToken
     * @param {} data 
     */
    saveAccessToken(data) {
        return util.writeFileAsync(eHealth_file, data);
    }
    //获取签名字符串
    getSign(reqBody) {


        let commonIn ={}
        Object.assign(commonIn, reqBody.commonIn);
        let req = reqBody.req; 
        var rkeys = Object.keys(req); 
        rkeys.forEach((item) => { 
            if (typeof (req[item]) != "Object") {
                commonIn[item] = req[item];
            } else {
                commonIn[item] = JSON.stringify(req[item]);
            }

        });

        let sortstr = this.sortObj(commonIn)

        return crypto.createHash('sha256').update(sortstr).digest("base64");

    }
    //对数据进行排序
    sortObj(args) {
        var keys = Object.keys(args);
        // console.log('keys=====', args);
        keys = keys.sort()
        var newArgs = {};

        keys.forEach(function (key) {
            let newValue = args[key]; // (args[key]).replace(/(^\s*)|(\s*$)/g, "");

            if (newValue != undefined && newValue != "") {
                newArgs[key] = newValue;
            }


        });

        var string = '';
        for (var k in newArgs) {
            string += '&' + k + '=' + newArgs[k];
        }

        string = string.substr(1) + config.healthAppsecret;

        return string;
    }

}
//全局配置参数 app.js部分代码




module.exports = eHealthNet;