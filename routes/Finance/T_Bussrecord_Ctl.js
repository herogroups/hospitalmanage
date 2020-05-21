const db = require('../../DbLib/Finance/T_Bussrecord_DB')
const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class T_Bussrecord_Ctl extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async index(ctx, next) {
    await ctx.render('/Finance/T_Bussrecord/Index', {});

  }
  /***
   * 进入添加界面
   */
  async addIndex(ctx, next) {
    await ctx.render('/Finance/T_Bussrecord/AddIndex', {});

  }
  /**
   * 进入修改界面
   *  {*} ctx 
   *  {*} next 
   */
  async showSingle(ctx, next) {

    let result = {};
    try {
      result = await db.getSingle({
        bussId: ctx.query.Id
      });
    } catch (err) {
      result = null;
    }
    await ctx.render('/Finance/T_Bussrecord/showSingle', {
      'Model': result
    });
  }
  /**
   * 列表查询界面
   *  {*} ctx 
   *  {*} next 
   */
  async getAllList(ctx, next) {
    let ret = {};
    try {
      let condi = "";
      let config = [];
      let body = ctx.request.body;
      let pageindex = body.pageindex;
      let pageSize = body.pageSize;
      if (!super.isEmpty(body.transChannel)) {
        condi += ` transChannel like ?  and `;
        config.push('%' + body.transChannel + '%');
      }
      if (!super.isEmpty(body.pospOrderNo)) {
        condi += ` pospOrderNo like ?  and `;
        config.push('%' + body.pospOrderNo + '%');
      }
      if (!super.isEmpty(body.agentCode)) {
        condi += ` agentCode like ?  and `;
        config.push('%' + body.agentCode + '%');
      }
      if (!super.isEmpty(body.terminalNo)) {
        condi += ` terminalNo like ?  and `;
        config.push('%' + body.terminalNo + '%');
      }
      if (!super.isEmpty(body.hisTerminalNo)) {
        condi += ` hisTerminalNo like ?  and `;
        config.push('%' + body.hisTerminalNo + '%');
      }
      if (!super.isEmpty(body.hosCardNo)) {
        condi += ` hosCardNo like ?  and `;
        config.push('%' + body.hosCardNo + '%');
      }
      if (!super.isEmpty(body.patientName)) {
        condi += ` patientName  like ?  and `;
        config.push('%' + body.patientName + '%');
      }
      if (!super.isEmpty(body.bussName)) {
        condi += ` bussName like ?  and `;
        config.push('%' + body.bussName + '%');
      }
      if (!super.isEmpty(body.result)) {
        condi += ` result = ?  and `;
        config.push( body.result );
      }
      if (!super.isEmpty(body.userId)) {
        condi += ` userId like ?  and `;
        config.push('%' + body.userId + '%');
      }
      if (!super.isEmpty(body.description)) {
        condi += ` description like ?  and `;
        config.push('%' + body.description + '%');
      }
      if (!super.isEmpty(body.StartDate)) {
        condi += ` startTime >= ?  and `;
        config.push(body.StartDate);
      }
      
      if (!super.isEmpty(body.EndDate)) {

        condi += ` startTime < ?  and `;
        config.push(super.addDate(body.EndDate, 1));
      }
      console.log('condi===',condi);
      ret = await db.getPageList(config, condi,pageindex,pageSize);
    } catch (err) {
      console.log(err)
      ctx.log.error(err)
      ret = null;
    }
    ctx.body = ret;
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
        hisTerminalNo: body.hisTerminalNo
      })
      if (result) {
        throw new Error(`插入失败,[${body.hisTerminalNo}]已经存在`)
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
        hisTerminalNo: body.hisTerminalNo
      }, body.bussId)
      if (result) {
        throw new Error(`修改失败,[${body.hisTerminalNo}]已经存在`)
      }

      result = await db.update(body, body.bussId); //更新数据

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
    let config = [{
      delMark: 0
    }];
    try {
      let body = ctx.request.body;
      result = await db.getList(config); //获取下拉列表框数据    
      items = result.map((item, index) => {
        return {
          id: item.bussId,
          text: item.hisTerminalNo
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
module.exports = new T_Bussrecord_Ctl;