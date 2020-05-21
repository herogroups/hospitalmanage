const router = require('koa-router')()
const sys_user_bll = require('../Bll/Sys_User_bll')
const db = require('../DbLib/SystemManage/Sys_User_DB')
const util = require('../Libs/util')
 
router.prefix('/Login')

router.post('/LoginTenant', async (ctx, next) => {


  let ret = {};
  try {

    let result = await sys_user_bll.queryUser(ctx.request.body.tenantcode, ctx.request.body.password);

    if (result.length < 1) {
      throw new Error('输入的账号或密码不正确')
    }


    ctx.cookies.set(
      'loginuserkey',
      result, {
        maxAge: 1000 * 160 * 1000, // cookie有效时长 
    //  maxAge:  1000, // cookie有效时长 
        httpOnly: true, // 是否只用于http请求中获取

      });
    console.log('usr', ctx.request.body.tenantcode)
    let usr = await db.GetByUserCode(ctx.request.body.tenantcode)

    let data = {
      LOGONCOUNT: usr[0].LOGONCOUNT + 1,
      LASTLOGINIP: ctx.request.ip.replace('::ffff:', ''),
      LASTLOGINTIME: util.dateFtt('yyyy-MM-dd hh:mm:ss', new Date()),
    }

    await db.Update(data, usr[0].OPID)
    ret = {
      Success: true,
      Msg: '登录成功'
    };
  } catch (err) {
    ctx.log.error(err.message)
    ret = {
      Success: false,
      Msg: err.message
    };
  }

  ctx.body = ret;

})

router.get('/OutLogin', async (ctx, next) => {
  ctx.cookies.set('loginuserkey', '', {
    signed: false,
    maxAge: 0
  })
  return ctx.redirect("/");
})

router.post('/LoginUser', async (ctx, next) => {

  let ret = {};
  try {
    // let result = await sys_tenants_bll.GetByMobileNum(ctx.request.body.tenantcode);
 
    let result = await sys_user_bll.queryUser(ctx.request.body.account, ctx.request.body.password);
    ctx.cookies.set(
      'loginuserkey',
      result, {
        maxAge: 1000 * 60 * 1000, // cookie有效时长 
        httpOnly: true, // 是否只用于http请求中获取

      });
    ret = {
      Success: true,
      Msg: '登录成功'
    };
  } catch (err) {
    ret = {
      Success: false,
      Msg: err.message
    };
  }

  ctx.body = ret;
})

module.exports = router