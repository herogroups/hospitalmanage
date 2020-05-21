const db = require('../../DbLib/SystemManage/Sys_Role_DB')

const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class sys_role extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async Index(ctx, next) {

    await ctx.render('/SystemManage/Sys_Role/Index', {});
  }
  /***
   * 进入添加界面
   */
  async AddIndex(ctx, next) {
    await ctx.render('/SystemManage/Sys_Role/AddIndex', {});
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
    await ctx.render('/SystemManage/Sys_Role/UpdateIndex', {
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
    let config = [];
    let condi = '';
    try {
      if (!super.isEmpty(body.ROLECODE)) {
        condi += ` ROLECODE like ?  and `;
        config.push('%' + body.ROLECODE + '%');
      }
      if (!super.isEmpty(body.ROLENAME)) {
        condi += ` ROLENAME like ?  and `;
        config.push('%' + body.ROLENAME + '%');
      }
      result = await db.GetList(config, condi);
    } catch (err) {
      result = null;
    }
    ctx.body = result;
  }
  async GetRoleRights(ctx, next) {
    let result = {};
    let config = [];
    let condi = '';
    try {
      const authdb = require('../../DbLib/SystemManage/Sys_Roleauthorize_DB')
      let roleId = ctx.request.body.RoleId
      condi = 'RoleId =? and ';
      config.push(roleId)
      result = await authdb.GetList(config, condi);
    } catch (err) {
      console.log(err)
      result = null;
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
      result = await db.IsExists({
        ROLENAME: body.ROLENAME
      })
      if (result) {
        throw new Error(`插入失败,[${body.ROLENAME}]已经存在`)
      }
      let arr = [];
      if (body.rightIds) {

        arr = body.rightIds.split(',');

        delete body.rightIds;

      }
  
      body.closed = 0;
      let roleId = 0;

      result = await db.Add(body);


      if (result.affectedRows < 1) {
        throw new Error('添加失败');
      }
      roleId = result.insertId
      if (arr.length > 0) {
        const authdb = require('../../DbLib/SystemManage/Sys_Roleauthorize_DB')
       await authdb.Remove(roleId);
        for (var value in arr) {
          if (arr[value] === "#") continue
          let authModel = {};
          authModel.ROLEID = roleId;
          authModel.MODULEID = arr[value];
          let ret = await authdb.Add(authModel)
        }
      }
      result = {
        Success: true,
        Msg: '添加成功'
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
   * 修改提交数据并保存
   *  {*} ctx 
   *  {*} next 
   */
  async Update(ctx, next) {
    let result = {};
    try {

      let body = ctx.request.body;
      console.log('body====================================',body);
      result = await db.IsExistsOld({
        ROLENAME: body.ROLENAME
      }, body.ROLEID)
      console.log('body====================================',result);
      if (result) {
        throw new Error(`修改失败,[${body.ROLENAME}]已经存在`)
      }
      let arr = [];
      if (body.rightIds) {

        arr = body.rightIds.split(',');

        delete body.rightIds;

      }
      result = await db.Update(body, body.ROLEID); //更新数据
      if (arr.length > 0) {
        const authdb = require('../../DbLib/SystemManage/Sys_Roleauthorize_DB')
       await authdb.Remove(body.ROLEID);
        for (var value in arr) {
          if (arr[value] === "#") continue
          let authModel = {};
          authModel.ROLEID = body.ROLEID;
          authModel.MODULEID = arr[value];
          let ret = await authdb.Add(authModel)
        }
      }
      if (!result) {
  
        throw new Error('修改失败');
      }
      result = {
        Success: true,
        Msg: '修改成功'
      };

    } catch (err) {
      ctx
      result = {
        Success: false,
        Msg: err.message
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
        if (arr[el] == '1'){
          throw new Error('系统角色不允许删除');
        }
        bRet = await db.Update({
          closed: 1
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
      ctx.log.error(err);
      result = {
        Success: false,
        Msg: err.message
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
    let condi = "";
    let model = []
    try {
      let body = ctx.request.body;
      result = await db.GetList(model,condi); //获取下拉列表框数据    
      items = result.map((item, index) => {
        return {
          id: item.ROLEID,
          text: item.ROLENAME
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
var body = new sys_role();
module.exports = body;