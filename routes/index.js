const router = require('koa-router')()
 
router.get('/', async (ctx, next) => {
  await ctx.render('login',{"layout":'layout'})
})

router.get('/login', async (ctx, next) => {
 
  await ctx.render('login', {
    title: 'Hello Koa 2!' ,
    layout:'layout'
  })
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
