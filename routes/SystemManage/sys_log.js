const db = require('../../DbLib/SystemManage/Sys_Log_DB')
 

const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class sys_log extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async Index(ctx, next) {
       
    await ctx.render('/SystemManage/Sys_Log/Index', {});
  }
  /***
   * 进入添加界面
   */
  async AddIndex(ctx, next) {
    await ctx.render('/SystemManage/Sys_Log/AddIndex', {});
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
    await ctx.render('/SystemManage/Sys_Log/UpdateIndex', {
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
    let condi = "";
    let config = [];
    let body = ctx.request.body;
    try {
      if (!super.isEmpty(body.Account)) { 
        condi += `  Account like ? and `
        config.push('%'+body.Account+'%');
      }
      if (!super.isEmpty(body.NickName)) { 
        condi += `  NickName like ? and `
        config.push('%'+body.NickName+'%');
      }
      if (!super.isEmpty(body.IPAddress)) { 
        condi += `  IPAddress like ? and `
        config.push('%'+body.IPAddress+'%');
      }
      if (!super.isEmpty(body.MEMO)) { 
        condi += `  MEMO like ? and `
        config.push('%'+body.MEMO+'%');
      }
      if (!super.isEmpty(body.StartDate)) { 
        condi += `  CreatorTime >= ? and `
        config.push(body.StartDate);
      }
      if (!super.isEmpty(body.EndDate)) { 
        condi += `  CreatorTime <= ? and `
        config.push (super.addDate(body.EndDate,1));
      }
      result = await db.GetList(config,condi);
     super.add_log(ctx, 0,'系统日志',0);
    } catch (err) {
      result = null;
     super.add_log(ctx, 0,'系统日志',1);
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
        NickName: body.NickName
      })
      if (result) {
        throw new Error(`插入失败,[${body.NickName}]已经存在`)
      }
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
        NickName: body.NickName
      }, body.LogId)
      if (result) {
        throw new Error(`修改失败,[${body.NickName}]已经存在`)
      }
      result = await db.Update(body, body.LogId); //更新数据

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
  async ExportLog(ctx,next){
  
    super.add_log(ctx, 4, ctx.request.body.title,0);
    ctx.body={};
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
      result = await db.GetList(); //获取下拉列表框数据    
      items = result.map((item, index) => {
        return {
          id: item.LogId,
          text: item.NickName
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
var body = new sys_log();
module.exports = body;