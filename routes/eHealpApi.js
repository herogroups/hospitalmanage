const router = require('koa-router')()

const {
    imsLogger
} = require('../Libs/logger')
router.prefix('/eHealpApi')  

router.post('/', async (ctx, next) => {
    let response ={commonOut:{},rsp:{}};
    let body = ctx.request.body;
    ctx.log.info(body);
    try {

        const ehealth = require('../service/health/eHealthNet');
        let eh = new ehealth();
        let resp = await  eh.send(body.method,body.req)
        
        response.rsp =resp;
        response.commonOut.resultCode= 0;
        response.commonOut.errMsg= "成功";
    } catch (err) {      
        response.commonOut.resultCode= 1;
        response.commonOut.errMsg= err.message;
    } finally {
        console.log(JSON.stringify(response));
        imsLogger.info(JSON.stringify(response))
        ctx.body = response;


    }
})

module.exports = router