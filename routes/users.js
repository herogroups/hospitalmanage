const router = require('koa-router')()
var axios = require('axios')
 
router.prefix('/users') 
router.get('/', async function (ctx, next) {
  let opts = require('../conf/config')
  let data = await opts.getAccessToken(); 
  let appid=opts.appId;
  data = JSON.parse(data)

 
  var menu = {
    "button": [{ 
        "name": "门诊",
        "type": "view", 
        "url":`${encodeURI("http://www.lailai.club/#/main?nextPage=home")}`

      } ,
      { 
        "name": "住院",
        "type": "view", 
        "url":`${encodeURI("http://www.lailai.club/#/main?nextPage=inHos")}`

      } ,{ 
        "name": "微服务",
        "type": "view", 
        "url":`${encodeURI("http://www.lailai.club/#/main?nextPage=myInfo")}`

      } 
    ]
  }
  let url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`

  //删除菜单,发送http请求
  axios.post(url, null, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }).then(function (dt) {
    console.log('删除请求已发出', dt.data)
    url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`

    //创建菜单,发送http请求
    axios.post(url, menu, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then(function (dt) {
      console.log('创建菜单请求已发出', dt.data)
    })
  })
  ctx.body = {
    code: '00',
    msg: '创建成功'
  }

  // let data = [{
  //   hosCardType: ''
  // }, {
  //   hosCardNo: ''
  // }];
  // data[0].hosCardType = '01';
  // data[1].hosCardNo = '00000015800';

  // let xmljson = await Hosservice.getHosService('1002', data)

  // await ctx.render('/index', {});
})
// 1、用户同意授权，获取code
router.get('/goLogin', async (ctx, next) => {
 // console.log('http://www.lailai.club/#/users/goLogin',opts.redirect_url)
  let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + opts.appId +
    '&redirect_uri=' + opts.redirect_url +
    '&response_type=code' +
    '&scope=snsapi_userinfo' +
    '&state=STATE#wechat_redirect'
  //  console.log('http://www.lailai.club/#/users/goLogin',opts.redirect_url,url)
  ctx.response.redirect(url) // 重定向到这个地址
})

// 2、通过code换取网页授权access_token
router.get('/wxcallback', async (ctx, next) => { /// wxcallback?code=011k2BDK1gY6T30Cl7DK1kaxDK1k2BD8&state=STATE
  let code = ctx.query.code
  let access_token = ''
  let openid = ''
  await superagent.get('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + opts.appId +
      '&secret=' + opts.appSecret +
      '&code=' + code +
      '&grant_type=authorization_code')
    .then(res => {
      // 此处本来应该用res.body获取返回的json数据，但总是获取不到，只能用text代替
      let result = JSON.parse(res.text)
      access_token = result.access_token
      openid = result.openid
    })
    .catch(res => {
      console.log(res)
    })
});


router.get('/bar', function (ctx, next) {

  ctx.body = 'this is a users/bar response'
})
router.post('/', async function (ctx, next) {



  let data = await opts.getAccessToken();

  data = JSON.parse(data)

  var menu = {
    "button": [{

   
        
          "type": "view",
          "name": "门诊",
          "url": encodeURI('http://www.lailai.club/#/home')
       
      },
      {

     
        
          "type": "view",
          "name": "住院",
          "url": encodeURI('http://www.lailai.club/#/InHos')
       
      },
      {
 
          "type": "view",
          "name": "微服务",
          "url": encodeURI('http://www.lailai.club/#/myInfo')
       
      },
    ]
  }
  let url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`

  //删除菜单,发送http请求
  axios.post(url, null, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }).then(function (dt) {
    console.log('删除请求已发出', dt.data)
    url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`

    //创建菜单,发送http请求
    axios.post(url, menu, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then(function (dt) {
      console.log('创建菜单请求已发出', dt.data)
    })
  })
  ctx.body = {
    code: '00',
    msg: '创建成功'
  }

})
module.exports = router