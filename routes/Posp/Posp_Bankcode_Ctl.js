const db = require('../../DbLib/Posp/Posp_Bankcode_DB')
const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class Posp_Bankcode_Ctl extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async index(ctx, next) {
    await ctx.render('/Posp/Posp_Bankcode/Index', {});

  }
  /***
   * 进入添加界面
   */
  async addIndex(ctx, next) {
    await ctx.render('/Posp/Posp_Bankcode/AddIndex', {});

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
        bankCodeId: ctx.query.Id
      });
    } catch (err) {
      result = null;
    }
    await ctx.render('/Posp/Posp_Bankcode/UpdateIndex', {
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
      let pageindex = body.pageindex;
      let pageSize = body.pageSize;
  
      if (!super.isEmpty(body.bankCode)) {
        condi += ` bankCode like ?  and `;
        config.push('%' + body.bankCode + '%');
      }
      if (!super.isEmpty(body.bankCodeName)) {
        condi += ` bankCodeName like ?  and `;
        config.push('%' + body.bankCodeName + '%');
      }
      if (!super.isEmpty(body.remark)) {
        condi += ` remark like ?  and `;
        config.push('%' + body.remark + '%');
      }
      result = await db.getList(config, condi, pageindex, pageSize);
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
        bankCodeName: body.bankCodeName
      })
      if (result) {
        throw new Error(`插入失败,[${body.bankCodeName}]已经存在`)
      }

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
        remark: body.remark
      }, body.bankCodeId)
      if (result) {
        throw new Error(`修改失败,[${body.remark}]已经存在`)
      }

      result = await db.update(body, body.bankCodeId); //更新数据

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
  
  async updateClose(ctx, next) {
    console.log('ctx.request.body============================',ctx.request.body);
    let ids = ctx.request.body.ids;
    let flag = ctx.request.body.flag;
    flag = (flag == undefined) ? 1 : flag;
    let bRet = false;
    let arr = ids.split(',');

    for (var el in arr) {
      if (arr[el] == '0') continue;
      bRet = await db.update({
        closed: flag
      }, arr[el]); //删除数据
      if (!bRet) {
        break;
      }
    }
    ctx.body = {
      Success: true,
      Msg: '修改成功'
    };
  }
  /**
   * 删除提交的数据
   *  {*} ctx 
   *  {*} next 
   */
  async remove(ctx, next) {
    console.log('ctx.request.body============================',ctx.request.body);
    let result = {};
    try {

      let ids = ctx.request.body.ids;
      let bRet = false;
      let arr = ids.split(',');
      let flag = ctx.request.body.flag;
      console.log('flag=========333333333=====', flag);
      flag = (flag == undefined) ? 1 : flag;

      for (var el in arr) {
        if (arr[el] == '0') continue;
        bRet = await db.remove(  arr[el]); //删除数据
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
    let config = [{
      delMark: 0
    }];
    try {
      let body = ctx.request.body;
      result = await db.getList(config); //获取下拉列表框数据    
      items = result.map((item, index) => {
        return {
          id: item.bankCodeId,
          text: item.remark
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
module.exports = new Posp_Bankcode_Ctl;