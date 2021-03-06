﻿const db = require('../../DbLib/Hos/Hos_Article_Subtype_DB')
const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class hos_article_subtype extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async Index(ctx, next) {
    await ctx.render('/Hos/Hos_Article_Subtype/Index', {});

  }
  /***
   * 进入添加界面
   */
  async AddIndex(ctx, next) {
    await ctx.render('/Hos/Hos_Article_Subtype/AddIndex', {});

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
    await ctx.render('/Hos/Hos_Article_Subtype/UpdateIndex', {
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
      let body = ctx.request.body;
      if (!super.isEmpty(body.subTypeCode)) {
        condi += `  subTypeCode like ? and `
        config.push('%' + subTypeCode + '%');
      }
      if (!super.isEmpty(body.subTypeName)) {
        condi += `  subTypeName like ? and `
        config.push('%' + subTypeName + '%');
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
        subTypeName: body.subTypeName
      })
      if (result) {
        throw new Error(`插入失败,[${body.subTypeName}]已经存在`)
      }
      body.CREATEDATE = new Date();
      body.CLOSED = 0;
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
        subTypeName: body.subTypeName
      }, body.subTypeId)
      if (result) {
        throw new Error(`修改失败,[${body.subTypeName}]已经存在`)
      }
      console.log('body', body)
      result = await db.Update(body, body.subTypeId); //更新数据

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
    let result = {};
    let items = [];
    let condi = "";
    let config = [];
    try {
      let body = ctx.request.body;
      result = await db.GetList(config, condi); //获取下拉列表框数据    
      items = result.map((item, index) => {
        return {
          id: item.subTypeId,
          text: item.subTypeName
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
module.exports = new hos_article_subtype;