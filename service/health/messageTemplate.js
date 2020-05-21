/**
 * 电子健康卡注册成功发送的消息
 * @param {string} openid  微信公众号OpenId
 * @param {string} first   标题
 * @param {string} keyword1 
 * @param {string} keyword2 
 * @param {string} keyword3 
 * @param {string} remark 
 */
async function registEHealthCardSuccess (openid,first,keyword1,keyword2,keyword3,remark)  {
    const WeChat = require('../../Libs/wechat')
    var _config =require('../../conf/config');   
   
    var wechat = new WeChat( _config.weichat); 
    const axios = require('axios')
    let params =  {
        "touser":openid,
        "template_id":"-7qJEhu-TYbh9ytxOznDTOXKm38wp9ecaetybI-Nu80",
               
        "data":{
                "first": {
                    "value":first,
                    "color":"#173177"
                },
                "keyword1":{
                    "value":keyword1,
                    "color":"#173177"
                },
                "keyword2": {
                    "value":keyword2,
                    "color":"#173177"
                },
                "keyword3": {
                    "value":keyword3,
                    "color":"#173177"
                },
                "remark":{
                    "value":remark,
                    "color":"#173177"
                }
        }
    };
    let ACCESS_TOKEN= JSON.parse(await  _config.getAccessToken()).access_token;;
 
    let url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`;

    var res = await axios.post(url, params ).catch((error) => {

        throw new Error('获取OpenId过程失败')
    })

    if (res.data.errcode != 0 || res.data.errcode == undefined) {
        throw new Error(res.data.errmsg)
    }
 
    return res;
}
exports.registEHealthCardSuccess = registEHealthCardSuccess