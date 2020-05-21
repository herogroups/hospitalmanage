 /**
  * 预约挂号成功通知
  * 您好，您已预约成功
  * 就诊人：胡艳
  * 就诊卡号：000014531
  * 挂号科室：神经内科
  * 看诊医生：王二
  * 就诊时间：2015-02-23 15:00-15:15
  * 请在就诊时间段15分钟前到达就诊科室候诊
  * @param {string} openid - 微信OpenId
 
  * @param {string} name - 名字
  * @param {string} hosCardNo - 卡号
  * @param {string} deptName - 科室
  * @param {string} doctorName  - 医生
  * @param {string} seeTime -就诊时间
 
  */
 function appointRegistTpl(options) {

     let params = {
         "touser": options.openid,
         "template_id": "TEfk69xT_vu4UuVbLkULDXy8Ff0eJP1eQQKrBnBTGHk",

         "data": {
             "first": {
                 "value": "尊敬的"+options.name + '您好，您已预约成功',
                 "color": "#173177"
             },
             "keyword1": {
                 "value": options.name,
                 "color": "#173177"
             },

             "keyword2": {
                 "value": options.hosCardNo,
                 "color": "#173177"
             },
             "keyword3": {
                 "value": options.deptName,
                 "color": "#173177"
             },
             "keyword4": {
                 "value": options.doctorName,
                 "color": "#173177"
             },
             "keyword5": {
                 "value": options.seeTime,
                 "color": "#173177"
             },
             "remark": {
                 "value": '请在就诊时间段15分钟前到达就诊科室候诊.',
                 "color": "#173177"
             }
         }
     };
     return params;
 }


 /**
  * 普通挂号的发送消息
  * 您已挂号成功，请前往对应科室候诊。
  * 就诊人：王二小
  * 医院：青岛妇女儿童医院
  * 科室：产科
  * 医生：高娟
  * 就诊时间：2017年12月7日 18:36
  * 请留意叫号信息，避免过号哦
  * @param {string} openid  - 微信OpenId
  
  * @param {string} name - 患者姓名
  * @param {string} hosName  - 医院名称
  * @param {string} deptName - 科室名称
  * @param {string} doctorName  -医生名称
  * @param {string} seeTime - 看病时间
 
  */
 function commRegistTpl(options) {

     let params = {
         "touser": options.openid,
         "template_id": "RJ7E_kx5fgG5waAJO3jLR5DFGpwVcB260Ghir8_rc50",

         "data": {
             "first": {
                 "value": "尊敬的"+options.name + '您好，您已挂号成功，请前往对应科室候诊',
                 "color": "#173177"
             },
             "keyword1": {
                 "value": options.name,
                 "color": "#173177"
             },

             "keyword2": {
                 "value": options.hosName,

             },
             "keyword3": {
                 "value": options.deptName,
                 "color": "#173177"
             },
             "keyword4": {
                 "value": options.doctorName,

             },
             "keyword5": {
                 "value": options.seeTime,
                 "color": "#173177"
             },
             "remark": {
                 "value": '请留意叫号信息，避免过号.',
                 "color": "#173177"
             }
         }
     };
     return params;
 }



 /**
  * 住院预交金支付成功通知
  * 例：住院预交金支付成功
  * 患者姓名：张三
  * 住院号：123456
  * 支付金额：100
  * 感谢你的使用。
  * @param {string} openid  - 微信OpenId
  * @param {string} first -  标题
  * @param {string} name - 患者姓名 
  * @param {string} hosInNo - 住院号
  * @param {string} amount  -支付金额 
  * @param {string} remark  -备注	EGur1WjuufW8AJOdaVeyY1Pem0upTIlcryZJs2-XD5o
  */
 function inPayTpl(options) {

     let params = {
         "touser": options.openid,
         "template_id": "EGur1WjuufW8AJOdaVeyY1Pem0upTIlcryZJs2-XD5o",

         "data": {
             "first": {
                 "value":"尊敬的"+ options.name + "您好，住院预交金支付成功",
                 "color": "#173177"
             },
             "keyword1": {
                 "value": options.name,
                 "color": "#173177"
             },

             "keyword2": {
                 "value": options.hosInNo,
                 "color": "#173177"
             },
             "keyword3": {
                 "value": options.amount,
                 "color": "#173177"
             },

             "remark": {
                 "value": '感谢您的使用',
                 "color": "#173177"
             }
         }
     };
     return params;
 }


 /**
  *门诊缴费通知
  * 例如 ：您好，你已缴费成功！
  * 姓名：张三 140021
  * 科室：皮肤科
  * 医生：刘春生
  * 总金额：200元
  * 缴费时间：2017-07-07 08
  * 如需详细信息请到历史记录中查询！
  * @param {string} openid  - 微信OpenId
  * @param {string} first -  标题
  * @param {string} name - 患者姓名
  * @param {string} deptName - 科室名称
  * @param {string} doctorName  -医生名称
  * @param {string} amount  - 金额
  * @param {string} seeTime - 看病时间
  * @param {string} remark  -备注
  */
 function outPayTpl(options) {

     let params = {
         "touser": options.openid,
         "template_id": "d_Q_wHR9ybH_MRQ4Lw3IuCokE4SflPYzmnvQS3qQOzQ",

         "data": {
             "first": {
                 "value": "尊敬的"+options.name + '您好，您已缴费成功！',
                 "color": "#173177"
             },
             "keyword1": {
                 "value": options.name,
                 "color": "#173177"
             },
             "keyword2": {
                 "value": options.deptName,
                 "color": "#173177"
             },
             "keyword3": {
                 "value": options.doctorName,
                 "color": "#173177"
             },
             "keyword4": {
                 "value": options.amount,
                 "color": "#173177"
             },
             "keyword5": {
                 "value": options.seeTime,
                 "color": "#173177"
             },
             "remark": {
                 "value": '如需详细信息请到历史记录中查询！',
                 "color": "#173177"
             }
         }
     };
     return params;
 }
/**
 * 
 */
 exports.msgSend = async (options) => {
     console.log('options===',options);
    const util = require('../Libs/util')
     let seeTime= util.dateFtt("yyyy年MM月dd日 hh:mm:ss", new Date());
     let defaults = {
         msgType: '01',
         openid: "",
         name: "",
         hosName: "张掖市第二人民医院",
         deptName: "",
         doctorName: "",
         hosCardNo:'',
         seeTime: seeTime,
         amount: "0.00",
     };
     let params = {};
     defaults = Object.assign(defaults, options)
     switch (defaults.msgType) {
         case '01':
             params = commRegistTpl(defaults);
             break;
         case '02':
             params = appointRegistTpl(defaults);
             break;
         case '03':
             params = outPayTpl(defaults);
             break;
         case '04':
             params = inPayTpl(defaults);
             break;
         default:
             break;
     }
     const WeChat = require('../Libs/wechat')
     const _config =require('../conf/config');
     new WeChat(_config.weichat);
     const axios = require('axios')
     let ACCESS_TOKEN = JSON.parse(await _config.getAccessToken()).access_token;
     let url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`;
     var res = await axios.post(url, params).catch((error) => {
         throw new Error('获取OpenId过程失败')
     });

     if (res.data.errcode != 0 || res.data.errcode == undefined) {
         throw new Error(res.data.errmsg)
     }
     return res;
 }