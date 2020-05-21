const db = require('../../DbLib/SystemManage/Sys_Module_DB')
const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class sys_module extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async Index(ctx, next) {

    await ctx.render('/SystemManage/Sys_Module/Index', {});
  }
  /***
   * 进入添加界面
   */
  async AddIndex(ctx, next) {
    await ctx.render('/SystemManage/Sys_Module/AddIndex', {});
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

    await ctx.render('/SystemManage/Sys_Module/UpdateIndex', {
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
    let condi = '';
    let config = [];
    try {
      let body = ctx.request.body;
      if (body.MODULECODE)  
      {
       condi += ` MODULECODE like ?  and `;
      config.push('%' + body.MODULECODE + '%');
      }
      if (!body.MODULENAME)  
      {
       condi += ` MODULENAME like ?  and `;
      config.push('%' + body.MODULENAME + '%');
      }
      if (!super.isEmpty(body.ICON))  
      {
       condi += ` ICON like ?  and `;
      config.push('%' + body.ICON + '%');
      }
      if (!super.isEmpty(body.URLADDRESS))  
      {
       condi += ` URLADDRESS like ?  and `;
      config.push('%' + body.URLADDRESS + '%');
      }
      if (body.PARENTID!=-1)  
      {
       condi += ` PARENTID = ?  and `;
      config.push(body.PARENTID );
      }
      if (!super.isEmpty(body.MEMO))  
      {
       condi += ` MEMO like ?  and `;
      config.push('%' + body.MEMO + '%');
      }
    
      result = await db.GetList(config, condi);
    } catch (err) {
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
        MODULENAME: body.MODULENAME
      })
      if (result) {
        throw new Error(`插入失败,[${body.MODULENAME}]已经存在`)
      }
      body.closed=0;
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
      result = await db.IsExistsOld({
        MODULENAME: body.MODULENAME
      }, body.MODULEID)
      if (result) {
        throw new Error(`修改失败,[${body.MODULENAME}]已经存在`)
      }
      result = await db.Update(body, body.MODULEID); //更新数据

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
    ctx.body = result;
  }
  /**
   * 下拉列表框数据获取
   *  {*} ctx 
   *  {*} next 
   */
  async GetComb(ctx, next) {
    let body =ctx.request.body;
    let result = await db.GetParentList(); //获取下拉列表框数据    
    let items = super.getCombox(result, "MODULEID", "MODULENAME", body.mark)
    ctx.body = items;
  }
  async GetCodeByParentId(ctx, next) {
    console.log('let body = ctx.request.body;', ctx.request.body);
    let moduleCode = ""
    let parentId = ctx.request.body.parentId;

    let result = await db.GetMaxCodeByParentId(parentId); //获取下拉列表框数据  
    if (!result.MODULECODE) {

      let presult = await db.GetCodeByParentId(parentId); //获取下拉列表框数据  

      moduleCode = presult.MODULECODE + "001"

    } else {

      moduleCode = result.MODULECODE;
    }


    ctx.body = {
      moduleCode
    };
  }
}
var body = new sys_module();
module.exports = body;