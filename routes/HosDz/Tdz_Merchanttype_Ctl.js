﻿const db = require('../../DbLib/HosDz/Tdz_Merchanttype_DB')
const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class Tdz_Merchanttype_Ctl extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async index(ctx, next) {
    await ctx.render('/HosDz/Tdz_Merchanttype/Index', {});

  }
  /***
   * 进入添加界面
   */
  async addIndex(ctx, next) {
    await ctx.render('/HosDz/Tdz_Merchanttype/AddIndex', {});

  }
  /**
   * 进入修改界面
   *  {*} ctx 
   *  {*} next 
   */
  async updateIndex(ctx, next) {

    let result = {};
    try {
      result = await db.getSingle({
        MerchantTypeId: ctx.query.Id
      });
    } catch (err) {
      result = null;
    }
    await ctx.render('/HosDz/Tdz_Merchanttype/UpdateIndex', {
      'Model': result
    });
  }
  /**
   * 列表查询界面
   *  {*} ctx 
   *  {*} next 
   */
  async getAllList(ctx, next) {
    let result = {};
    try {
      let condi = "";
      let config = [];
      let body = ctx.request.body;
      if (!super.isEmpty(body.MerchantSpec)) {
        condi += ` MerchantSpec like ?  and `;
        config.push('%' + body.MerchantSpec + '%');
      }
      if (!super.isEmpty(body.MerchantTypeName)) {
        condi += ` MerchantTypeName like ?  and `;
        config.push('%' + body.MerchantTypeName + '%');
      }
      result = await db.getList(config, condi);
    } catch (err) {
      console.log(err)
      ctx.log.error(err)
      result = null;
    }
    ctx.body = result;
  }
  /**
   * 增加数据提交保存数据
   *  {*} ctx 
   *  {*} next 
   */
  async add(ctx, next) {

    let result = {};
    try {

      let body = ctx.request.body;
      result = await db.isExists({
        MerchantTypeName: body.MerchantTypeName
      })
      if (result) {
        throw new Error(`插入失败,[${body.MerchantTypeName}]已经存在`)
      }
      body.CreateDate = new Date();
      body.delMark = 0;
      result = await db.add(body);

      if (!result) {
        throw new Error('添加失败');
      }
      result = {
        Success: true,
        Msg: '添加成功'
      };

    } catch (err) {
      console.log(err)
      ctx.log.error(err)
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
  async update(ctx, next) {
    let result = {};
    try {

      let body = ctx.request.body;
      result = await db.isExistsOld({
        MerchantTypeName: body.MerchantTypeName
      }, body.MerchantTypeId)
      if (result) {
        throw new Error(`修改失败,[${body.MerchantTypeName}]已经存在`)
      }

      result = await db.update(body, body.MerchantTypeId); //更新数据

      if (!result) {
        throw new Error('修改失败');
      }
      result = {
        Success: true,
        Msg: '修改成功'
      };

    } catch (err) {
      console.log(err)
      ctx.log.error(err)
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
  async remove(ctx, next) {
    let result = {};
    try {

      let ids = ctx.request.body.ids;
      let bRet = false;
      let arr = ids.split(',');

      for (var el in arr) {
        if (arr[el] == '0') continue;
        bRet = await db.update({
          delMark: 1
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
      console.log(err)
      ctx.log.error(err)
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
  async getComb(ctx, next) {
    let result = {};
    let items = [];
    let condi = "";
    let config = [ ];
    try {
      let body = ctx.request.body;
      result = await db.getList(config,condi); //获取下拉列表框数据    
      items = result.map((item, index) => {
        return {
          id: item.MerchantTypeId,
          text: item.MerchantTypeName
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
      console.log(err)
      ctx.log.error(err)
      result = null;
    }
    ctx.body = items;
  }
}
module.exports = new Tdz_Merchanttype_Ctl;