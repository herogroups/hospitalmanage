const db = require('../../DbLib/SystemManage/Sys_Roleauthorize_DB')
const moduledb = require('../../DbLib/SystemManage/Sys_Module_DB')
const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class sys_roleauthorize extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async Index(ctx, next) {

    await ctx.render('/SystemManage/Sys_Roleauthorize/Index', {});
  }
  /***
   * 进入添加界面
   */
  async AddIndex(ctx, next) {
    await ctx.render('/SystemManage/Sys_Roleauthorize/AddIndex', {});
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
    await ctx.render('/SystemManage/Sys_Roleauthorize/UpdateIndex', {
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
      result = await db.GetList();
    } catch (err) {
      result = null;
    }
    ctx.body = result;
  }
  async GetCurrentUserAllModel(ctx, next) {
    let result = [];
    let condi = '';
    let config = [];
    console.log(ctx.User);
    if (ctx.User.UserId == 1) {

    result = await moduledb.GetList(config, condi);
    } else {

      condi += ` RoleId like ?  and `;
      config.push(ctx.User.RoleId);
      
      result = await db.GetList(config, condi);

    } 
    ctx.body = sys_roleauthorize.TreeDataCreat(result, 0)
  }




  static TreeDataCreat(model, pid) {
 
    let treeList = [];
    Object.keys(model).forEach(function (key) {
      
      let item = model[key];
      if (item.PARENTID == pid) {     
        let tItem = {};
        tItem.text = item.MODULENAME;
        tItem.id = item.MODULEID;
        tItem.url = item.URLADDRESS;
        tItem.children = sys_roleauthorize.TreeDataCreat(model, item.MODULEID);
        treeList.push(tItem);
      } 
    });
  
    return treeList;
  }
  //  if ( Object.keys(model).length>0){
  //       for(var item in model)   {
  //         console.log(item)
  //         if (item.ParentId == pid) {
  //           let tItem = {};
  //           tItem.text = item.FullName;
  //           tItem.id = item.ModuleId;
  //           tItem.url = item.UrlAddress;
  //           tItem.children = TreeDataCreat(model, item.ModuleId);
  //           treeList.push(tItem);
  //         }
  //       }
  //     }
  //     return treeList;
  //   }
  /**
   * 增加数据提交保存数据
   *  {*} ctx 
   *  {*} next 
   */
  async Add(ctx, next) {
    let result = {};
    try {

      let body = ctx.request.body;


      result = await db.Add(body);

      if (!result) {
        throw new Error('添加失败');
      }
      result = {
        Success: true,
        Msg: '添加成功'
      };

    } catch (err) {
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

      result = await db.Update(body, body.ROLEAUTHORIZEID); //更新数据

      if (!result) {
        throw new Error('修改失败');
      }
      result = {
        Success: true,
        Msg: '修改成功'
      };

    } catch (err) {

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
        bRet = await db.Remove(arr[el]); //删除数据
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
      console.log(err)
      result = {
        Success: false,
        Msg: err.message
      };
    }
    ctx.body = items;
  }


}
var body = new sys_roleauthorize();
module.exports = body;