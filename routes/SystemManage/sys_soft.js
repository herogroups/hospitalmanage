﻿const db = require('../../DbLib/SystemManage/Sys_Soft_DB')
const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class sys_soft extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async Index(ctx, next) {

    await ctx.render('/SystemManage/Sys_Soft/Index', {
      FILEPACKAGETYPE: 0,
      titleName: '应用软件'
    });
  }
  //轮播图
  async PicIndex(ctx, next) {

    await ctx.render('/SystemManage/Sys_Soft/Index', {
      FILEPACKAGETYPE: 1,
      titleName: '轮播图'
    });
  }
  /***
   * 进入添加界面
   */
  async AddIndex(ctx, next) {
    let packType = ctx.query.FILEPACKAGETYPE;
    let name = (packType == 0) ? '应用软件' : '轮播图';
    await ctx.render('/SystemManage/Sys_Soft/AddIndex', {
      FILEPACKAGETYPE: packType,
      titleName: name
    });
  }
  /**
   * 进入修改界面
   *  {*} ctx 
   *  {*} next 
   */
  async UpdateIndex(ctx, next) {
    let packType = 0;
    let name = '';
    let result = {};
    try {
      result = await db.GetDataById(ctx.query.Id);
      packType = result.FILEPACKAGETYPE;
      name = (packType == 0) ? '应用软件' : '轮播图';
    } catch (err) {
      result = null;
    }
    await ctx.render('/SystemManage/Sys_Soft/UpdateIndex', {
      'Model': result,
      FILEPACKAGETYPE: result.FILEPACKAGETYPE,
      titleName: name
    });
  }
  /**
   * 列表查询界面
   *  {*} ctx 
   *  {*} next 
   */
  async GetAllList(ctx, next) {

    let body = ctx.request.body;
    console.log('body', body);
    let result = {};
    try {
      result = await db.GetList(body.FILEPACKAGETYPE);
    } catch (err) {
      result = null;
    }
    ctx.body = result;
    if (body.FILEPACKAGETYPE == 0) {
      super.add_log(ctx, 0, '应用程序分类', 0);
    } else {
      super.add_log(ctx, 0, '录播图分类', 0);
    }
  }
  /**
   * 增加数据提交保存数据
   *  {*} ctx 
   *  {*} next 
   */
  async Add(ctx, next) {
    let result = {};
    let body = ctx.request.body;
    try {


      result = await db.IsExists({
        SOFTNAME: body.SOFTNAME
      }, body.FILEPACKAGETYPE)
      if (result) {
        throw new Error(`插入失败,[${body.SOFTNAME}]已经存在`)
      }
      result = await db.Add(body);

      if (!result) {
        throw new Error('添加失败');
      }
      result = {
        Success: true,
        Msg: '添加成功'
      };
      if (body.FILEPACKAGETYPE == 0) {
        super.add_log(ctx, 1, '应用程序分类', 0);
      } else {
        super.add_log(ctx, 1, '录播图分类', 0);
      }
    } catch (err) {
      result = {
        Success: false,
        Msg: err.message
      };
      if (body.FILEPACKAGETYPE == 0) {
        super.add_log(ctx, 1, '应用程序分类', 1);
      } else {
        super.add_log(ctx, 1, '录播图分类', 1);
      }
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
    let body = ctx.request.body;
    try {


      result = await db.IsExistsOld({
        SOFTNAME: body.SOFTNAME
      }, body.FILEPACKAGETYPE, body.SOFTID)
      if (result) {
        throw new Error(`修改失败,[${body.SOFTNAME}]已经存在`)
      }
      result = await db.Update(body, body.SOFTID); //更新数据

      if (!result) {
        throw new Error('修改失败');
      }
      result = {
        Success: true,
        Msg: '修改成功'
      };
      if (body.FILEPACKAGETYPE == 0) {
        super.add_log(ctx, 2, '应用程序分类', 0);
      } else {
        super.add_log(ctx, 2, '录播图分类', 0);
      }
    } catch (err) {
      if (body.FILEPACKAGETYPE == 0) {
        super.add_log(ctx, 2, '应用软件分类', 1);
      } else {
        super.add_log(ctx, 2, '录播图分类', 1);
      }
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

      super.add_log(ctx, 3, '应用程序分类', 0);

    } catch (err) {
      console.log(err)
      result = {
        Success: false,
        Msg: '该项已经在使用无法删除'
      };
      super.add_log(ctx, 3, '应用程序分类', 1);
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
      result = await db.GetList(body.FILEPACKAGETYPE); //获取下拉列表框数据    
      items = result.map((item, index) => {
        return {
          id: item.SOFTID,
          text: item.SOFTNAME
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
var body = new sys_soft();
module.exports = body;