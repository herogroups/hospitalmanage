const db = require('../../DbLib/HosDz/Tdz_Ioparam_DB')
const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class Tdz_Ioparam_Ctl extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async index(ctx, next) {
    await ctx.render('/HosDz/Tdz_Ioparam/Index', {
      IoModel: ctx.query.IoModel
    });

  }
  /***
   * 进入添加界面
   */
  async addIndex(ctx, next) {
    await ctx.render('/HosDz/Tdz_Ioparam/AddIndex', {
      IoModel: ctx.query.IoModel
    });

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
        IoParamId: ctx.query.Id
      });
    } catch (err) {
      result = null;
    }
    await ctx.render('/HosDz/Tdz_Ioparam/UpdateIndex', {
      IoModel: ctx.query.IoModel,
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
      let body = ctx.request.body;
      let condi = " IoModel = ?  and";
      let config = [body.IoModel];

      if (!super.isEmpty(body.Name)) {
        condi += ` Name like ?  and `;
        config.push('%' + body.Name + '%');
      }
      if (!super.isEmpty(body.Ip)) {
        condi += ` Ip like ?  and `;
        config.push('%' + body.Ip + '%');
      }
      if (!super.isEmpty(body.Port)) {
        condi += ` Port like ?  and `;
        config.push('%' + body.Port + '%');
      }
      if (!super.isEmpty(body.UserName)) {
        condi += ` UserName like ?  and `;
        config.push('%' + body.UserName + '%');
      }
      if (!super.isEmpty(body.Password)) {
        condi += ` Password like ?  and `;
        config.push('%' + body.Password + '%');
      }
      if (!super.isEmpty(body.Route)) {
        condi += ` Route like ?  and `;
        config.push('%' + body.Route + '%');
      }
      if (!super.isEmpty(body.SavePath)) {
        condi += ` SavePath like ?  and `;
        config.push('%' + body.SavePath + '%');
      }
      result = await db.getList(config, condi);
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
        Name: body.Name
      })
      if (result) {
        throw new Error(`插入失败,[${body.Name}]已经存在`)
      }
      body.CreateDate = new Date();
      body.DelMark = 0;
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
        Name: body.Name
      }, body.IoParamId)
      if (result) {
        throw new Error(`修改失败,[${body.Name}]已经存在`)
      }

      result = await db.update(body, body.IoParamId); //更新数据

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
        bRet = await db.update({delMark:1}, arr[el]); //删除数据
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
    let config = [ ];
    let condi = " IoModel = ?  and";
    try {
      let body = ctx.request.body;
      config.push(body.IoModel)    
      result = await db.getList(config,condi); //获取下拉列表框数据    
      items = result.map((item, index) => {
        return {
          id: item.IoParamId,
          text: item.Name
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
      ctx.log.error(err.message)
      result = null;
    }
    ctx.body = items;
  }
}
module.exports = new Tdz_Ioparam_Ctl;