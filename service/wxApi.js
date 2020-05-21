var http = require('./naxios')
const _config = require('../conf/config')

//获取accexx_token和jsapi_ticket
exports.getToken_JsApi = async function () {
  var token = await http.get('https://api.weixin.qq.com/cgi-bin/token', {
    grant_type: 'client_credential',
    appid:  _config.weichat.appId,
    secret: _config.weichat.appSecret
  })

  var jsapi_ticket = await http.get(
    'https://api.weixin.qq.com/cgi-bin/ticket/getticket', {
      access_token: token.access_token,
      type: 'jsapi'
    }
  )

  return {
    access_token: token.access_token,
    jsapi_ticket: jsapi_ticket.ticket
  }
}

// 获取普通access_token和code , 并据此获得用户信息
exports.accessToken_openid = async function (ctx,next) {
  // access_token和code
  var token = await http.get(
    'https://api.weixin.qq.com/sns/oauth2/access_token', {
      appid: config.appID,
      secret: config.appsecret,
      code: ctx.query.code,
      grant_type: 'authorization_code'
    }
  )

  //用户信息
  var info = await http.get('https://api.weixin.qq.com/sns/userinfo', {
    access_token: token.access_token,
    openid: token.openid,
    lang: 'zh_CN'
  })

  return {
    access_token: token.access_token,
    openid: token.openid,
    info: info
  }
}
exports.getUserInfo = async function(token){
 
  var info = await http.get('https://api.weixin.qq.com/sns/userinfo', {
    access_token: token.access_token,
    openid: token.openid,
    lang: 'zh_CN'
  })
   return info;
  
 
}