const db = require('../../DbLib/SystemManage/Sys_User_DB')
const Ctrlbase = require('../CtrBase')
const crypto = require('crypto');
const conf = require('../..//Libs/InitConfig')
/**
 * 命令业务控制模块
 */
class sys_user extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async Index(ctx, next) {
   

 
    await ctx.render('/SystemManage/Sys_User/Index', {});
  }
  /***
   * 进入添加界面
   */
  async AddIndex(ctx, next) {
    await ctx.render('/SystemManage/Sys_User/AddIndex', {});
  }
  async ResetPassword(ctx, next) {

    let result = {};
    try {
      if (ctx.query.Id == undefined)

        ctx.query.Id = ctx.User.UserId;
      result = await db.GetDataById(ctx.query.Id);
      await ctx.render('/SystemManage/Sys_User/ResetPassword', {
        'Model': result
      });

    } catch (err) {
      result = null;
    }
  }
  async ModifyUserPwd(ctx, next) {

    let result = {};
    try {

      let body = ctx.request.body;
      let md5 = crypto.createHash('md5');
      let userpassword = md5.update(body.UserPassword).digest('hex');
      let pwdObj = {
        'UserPassword': userpassword
      }
      result = await db.UpdatePassword(pwdObj, body.OPID); //更新数据

      if (!result) {
        throw new Error('修改失败');
      }
      result = {
        Success: true,
        Msg: '密码重置成功'
      };

    } catch (err) {
      console.log(err)
      result = {
        Success: false,
        Msg: err.message
      };
    }
    ctx.body = result;

  }


  /**
   * 进入修改界面
   *  {*} ctx 
   *  {*} next 
   */
  async UpdateIndex(ctx, next) {

    let result = {};
    try {
      result = await db.GetDataById(ctx.query.Id);
    } catch (err) {
      result = null;
    }
    await ctx.render('/SystemManage/Sys_User/UpdateIndex', {
      'Model': result
    });
  }
  /**
   * 列表查询界面
   *  {*} ctx 
   *  {*} next 
   */
  async GetAllList(ctx, next) {
    let result = {};
    try {
      let condi = "";
      let config = [];
      console.log('3333333333333333333333333333333333333333333333333333333');

      let body = ctx.request.body;
      if (!super.isEmpty(body.ACCOUNT)) {
        condi += `  ACCOUNT like ? and `
        config.push('%' + body.ACCOUNT + '%');
      }

      if (!super.isEmpty(body.OPNAME)) {
        condi += `  OPNAME like ? and `
        config.push('%' + body.OPNAME + '%');
      }

      if (body.ROLEID != -1 && body.ROLEID != 0) {
        condi += `  ROLEID = ?  and `
        config.push(body.ROLEID);
      }
      if (body.SHOPID != -1 && body.SHOPID != 0) {
        condi += `  SHOPID = ? and `
        config.push(body.SHOPID);
      }
      if (ctx.User.RoleId > 1) {
        condi += `  ROLEID != 1   and  ` 
       }
        result = await db.GetList(config, condi);
    

    } catch (err) {
      ctx.log.error(err)
      result = [];
    }
    ctx.body = result;
  }
  /**
   * 增加数据提交保存数据
   *  {*} ctx 
   *  {*} next 
   */
  async Add(ctx, next) {
    let result = {};
    try {

      let body = ctx.request.body;

      body.USERPASSWORD = 'e10adc3949ba59abbe56e057f20f883e';
      body.CLOSED = 0;
      body.CREATETIME = new Date();
      result = await db.Add(body);

      if (!result) {
        throw new Error('添加失败');
      }
      result = {
        Success: true,
        Msg: '添加成功'
      };

    } catch (err) {
      ctx.log.error(err)
      result = {
        Success: false,
        Msg: "新增失败"
      };
    }
    ctx.body = result;
  }
  /**
   * 修改提交数据并保存
   *  {*} ctx 
   *  {*} next 
   */
  async Update(ctx, next) {
    let result = {};
    try {

      let body = ctx.request.body;
      // result = await db.IsExistsOld({
      //   OPNAME: body.OPNAME
      // }, body.OPID)
      // if (result) {
      //   throw new Error(`修改失败,[${body.OPNAME}]已经存在`)
      // }
      result = await db.Update(body, body.OPID); //更新数据

      if (!result) {
        throw new Error('修改失败');
      }
      result = {
        Success: true,
        Msg: '修改成功'
      };

    } catch (err) {
      ctx.log.error(err)
      result = {
        Success: false,
        Msg: '修改失败'
      };
    }
    ctx.body = result;
  }
  /**
   * 删除提交的数据
   *  {*} ctx 
   *  {*} next 
   */
  async Remove(ctx, next) {
    let result = {};
    try {

      let ids = ctx.request.body.ids;
      let bRet = false;
      let arr = ids.split(',');

      for (var el in arr) {
        if (arr[el] == '0') continue;
        if (arr[el] == '1') {
          throw new Error('0001系统账号不允许删除');
        }
        bRet = await db.Update({
          CLOSED: 1
        }, arr[el]); //删除数据
        if (!bRet) {
          break;
        }
      }

      if (!bRet) {
        throw new Error('删除失败');
      }
      result = {
        Success: true,
        Msg: '删除成功'
      };

    } catch (err) {
      ctx.log.error(err)
      result = {
        Success: false,
        Msg: '删除失败,原因：' + err.message
      };
    }
    ctx.body = result;
  }
  /**
   * 下拉列表框数据获取
   *  {*} ctx 
   *  {*} next 
   */
  async GetComb(ctx, next) {
    let result = {};
    let items = [];
    try {
      let body = ctx.request.body;
      let condi = "";
      let config = [];
      result = await db.GetList(config, condi); //获取下拉列表框数据    
      items = result.map((item, index) => {
        return {
          id: item.OPID,
          text: item.OPNAME
        }
      });
      let mark = body.mark;
      if (mark == "1") {
        items.splice(0, 0, {
          id: -1,
          text: '全部'
        }); //items在数组最前边插入一条记录
      }
    } catch (err) {
      ctx.log.error(err.message)
      result = null;
    }
    ctx.body = items;
  }
}
var body = new sys_user();
module.exports = body;