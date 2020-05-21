const router = require('koa-router')();
const send = require('koa-send');
router.prefix('/download')
router.get('*', async (ctx,next) => { 
    try {  
        const path = ctx.url;   
        ctx.attachment(path);
        await send(ctx, path);
    } catch (err) {
    
        ctx.log.error(err)
    }
})
module.exports = router