const router = require('koa-router')()
const moment = require('moment');
const {
    imsLogger
} = require('../Libs/logger')
router.prefix('/icbcApi')
router.get('/', async (ctx, next) => {
    console.log('ctx',ctx);
});
router.post('/', async (ctx, next) => {

    let req = ctx.request.body;
    console.log('req=',req);
    let response = {};
    let heads = {};
    let data = {};
    let QR2221 = require('../service/Icbc/QR2221')
    let qr2221 = new QR2221();
    try {
        let resp = await qr2221.execute("");
        let body = JSON.parse(resp.postdata).additiondata;
        data = {
            content: body.biz_content,
            url: body.url,

        }




        // let IcbcPayHelper = require('../Libs/IcbcPayHelper')
        // try {
        //     let payHelper = new IcbcPayHelper("AAT_REMIND");
        //     let content = {
        //         openid: req.data.openid,
        //         subject: '芬达',
        //         goods_detail: "",
        //         outTradeNo:  moment().format('YYYYMMDDHHmmss'),
        //         totalAmount: '1',
        //         attach: '',
        //         spbill_create_ip:  ctx.request.ip.replace('::ffff:', '') ,
        //     }
        //     let obj = payHelper.buildParams(content);



        //     data =obj  ;
        //   //  let http = require('../Libs/http')
        //     // let resp = await http.httpRequest(url, {biz_content:obj.content})
        //     // console.log('resp:', resp);



        heads.retCode = '00';
        heads.retMsg = '成功';
    } catch (err) {
        imsLogger.error(err)
        console.log(err)
        heads.retCode = '01';
        heads.retMsg = err.message;
    } finally {
        response.responseHead = heads;
        response.data = data;
        console.log(JSON.stringify(response));
        imsLogger.info(JSON.stringify(response))
        ctx.body = response;


    }
})

function parseDom(arg) {
    var objE = document.createElement("div");
    objE.innerHTML = arg;
    return objE.childNodes;
};
module.exports = router