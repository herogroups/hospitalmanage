const sha1 = require('sha1');
const getRawBody = require('raw-body');
const util = require('../Libs/util');
const WeChat = require('../Libs/wechat')
const _config = require('../conf/config')
const tools = require('../Libs/tools')
//const api = require('../service/api')
const autoReply = require('./autoReply')
exports.Get = async function (ctx, next) {
    ctx.log.info("get消息请求数据：",ctx);
   
   
    var wechat = new WeChat(_config.weichat);
    const signature = ctx.query.signature,
        timestamp = ctx.query.timestamp,
        nonce = ctx.query.nonce,
        token = opts.token;
    //字典排序
    const str = [token, timestamp, nonce].sort().join('');

    const result = sha1(str);

    if (result === signature) {

        ctx.body = ctx.query.echostr;

    } else {
        ctx.body = {
            code: -1,
            msg: "fail"
        }
    }
}

exports.Post = async function (ctx, next) {
   
    var content = '';
    let buf = ''
    const _config = require('../conf/config')
   
    var wechat = new WeChat(_config.weichat);
     
 
    try {
        var data = await getRawBody(ctx.req, {
            length: ctx.request.length,
            limit: "2mb",
            encoding: ctx.request.charset
        });
        ctx.log.info("数据通知原始数据：",data);
        var content = await util.parseXMLAsync(data);
        ctx.log.info("数据通知解析成：",content)
        ctx.type = 'application/xml'; 
        ctx.body = await autoReply.autoReply(content.xml)
        ctx.log.info("通知应答：", ctx.body)
        // if (message.MsgType === 'event') {
        //     if (message.Event === 'subscribe') { //关注 
        //         sengd = tools.getXml(content, backTime, `欢迎关注l测试公众号！`)
        //         api.accessToken_openid()
        //     } else {

        //     }
        // } else if (message.MsgType === 'text') {

        //     sengd = tools.getXml(content, backTime, `你发"${content.xml.Content}"过来干啥？`)

        // }
        //  ctx.body = sengd;

    } catch (err) {
  
        ctx.body = {
            code: -1,
            msg: err.message
        }
    }

    // } else {
    // ctx.body = {
    //     code: -1,
    //     msg: "fail"
    //}
    //}
}