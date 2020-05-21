const router = require('koa-router')()
const axios = require("axios");

router.prefix('/AliLiftCodeMsg')

router.post('/', async function (ctx, next) {
    let data = ctx.request.body;
    console.log(data);
    const koa2Req = require('koa2-request');
    let url = "http://localhost:51190/api/CallAlisdk"
    var options = {
        method: 'post',
        url: url,
        json: JSON.stringify(data) ,
        headers: {
           // 'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    const res = await koa2Req(options).catch((err) => {
        console.log('我是错误的', err); 
    })

    console.log("-----------------",res.body);
    ctx.body = res.body;

});

module.exports = router