const router = require('koa-router')();
const send = require('koa-send');
router.prefix('/public')
router.get('/upload/:name', async (ctx) => {
    try {
        const name = ctx.params.name;
        const path = `/public/upload/${name}`;
        
        ctx.attachment(path);
        await send(ctx, path);
    } catch (err) {}
})
module.exports = router