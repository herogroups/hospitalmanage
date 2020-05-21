const db = require('../../DbLib/Ims/Ims_Bus_Record_DB')
const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class Ims_Bus_Record_Ctl extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async index(ctx, next) {
    await ctx.render('/Ims/Ims_Bus_Record/Index', {});

  }
  /***
   * 进入添加界面
   */
  async addIndex(ctx, next) {
    await ctx.render('/Ims/Ims_Bus_Record/AddIndex', {});

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
        busRecordId: ctx.query.Id
      });
    } catch (err) {
      result = null;
    }
    await ctx.render('/Ims/Ims_Bus_Record/UpdateIndex', {
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

      let config = [{
        closed: 0
      }];
      let body = ctx.request.body;
      if (!super.isEmpty(body.busCode)) {
        config.push({
          busCode: '%' + body.busCode + '%'
        });
      }
      if (!super.isEmpty(body.busName)) {
        config.push({
          busName: '%' + body.busName + '%'
        });
      }
      result = await db.getList(config);
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
  async add(ctx, next) {
    let result = {};
    try {

      let body = ctx.request.body;
      result = await db.isExists({
        busName: body.busName
      })
      if (result) {
        throw new Error(`插入失败,[${body.busName}]已经存在`)
      }
      body.CreateDate = new Date();
      body.closed = 0;
      result = await db.add(body);

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
  async update(ctx, next) {
    let result = {};
    try {

      let body = ctx.request.body;
      result = await db.isExistsOld({
        busName: body.busName
      }, body.busRecordId)
      if (result) {
        throw new Error(`修改失败,[${body.busName}]已经存在`)
      }

      result = await db.update(body, body.busRecordId); //更新数据

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
  async remove(ctx, next) {
    let result = {};
    try {

      let ids = ctx.request.body.ids;
      let bRet = false;
      let arr = ids.split(',');

      for (var el in arr) {
        if (arr[el] == '0') continue;
        bRet = await db.remove(arr[el]); //删除数据
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
  async getComb(ctx, next) {
    let result = {};
    let items = [];
    let config = [{
      closed: 0
    }];
    try {
      let body = ctx.request.body;
      result = await db.getList(config); //获取下拉列表框数据    
      items = result.map((item, index) => {
        return {
          id: item.busRecordId,
          text: item.busName
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
module.exports = new Ims_Bus_Record_Ctl;