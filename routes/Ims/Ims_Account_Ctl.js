const db = require('../../DbLib/Ims/Ims_Account_DB')

const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class Ims_Account_Ctl extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
  async index(ctx, next) {
    await ctx.render('/Ims/Ims_Account/Index', {});

  }
  /***
   * 进入添加界面
   */
  async addIndex(ctx, next) {
    await ctx.render('/Ims/Ims_Account/AddIndex', {});

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
        accountId: ctx.query.Id
      });
    } catch (err) {
      result = null;
    }
    await ctx.render('/Ims/Ims_Account/UpdateIndex', {
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
      if (!super.isEmpty(body.openid)) {
        condi += ` openid like ?  and `;
        config.push('%' + body.openid + '%');
      }
      if (!super.isEmpty(body.hosCardNo)) {
        condi += ` hosCardNo like ?  and `;
        config.push('%' + body.hosCardNo + '%');
      }
      if (!super.isEmpty(body.nickname)) {
        condi += ` nickname like ?  and `;
        config.push('%' + body.nickname + '%');
      }
      if (!super.isEmpty(body.sex)) {
        condi += ` sex like ?  and `;
        config.push('%' + body.sex + '%');
      }
      if (!super.isEmpty(body.province)) {
        condi += ` province like ?  and `;
        config.push('%' + body.province + '%');
      }
      if (!super.isEmpty(body.city)) {
        condi += ` city like ?  and `;
        config.push('%' + body.city + '%');
      }
      if (!super.isEmpty(body.country)) {
        condi += ` country like ?  and `;
        config.push('%' + body.country + '%');
      }
      if (!super.isEmpty(body.headimgurl)) {
        condi += ` headimgurl like ?  and `;
        config.push('%' + body.headimgurl + '%');
      }
      if (!super.isEmpty(body.name)) {
        condi += ` name like ?  and `;
        config.push('%' + body.name + '%');
      }
      if (!super.isEmpty(body.phone)) {
        condi += ` phone like ?  and `;
        config.push('%' + body.phone + '%');
      }
      if (!super.isEmpty(body.certNo)) {
        condi += ` certNo like ?  and `;
        config.push('%' + body.certNo + '%');
      }
      if (!super.isEmpty(body.hosCardType)) {
        condi += ` hosCardType like ?  and `;
        config.push('%' + body.hosCardType + '%');
      }
      if (!super.isEmpty(body.hosCardFrom)) {
        condi += ` hosCardFrom like ?  and `;
        config.push('%' + body.hosCardFrom + '%');
      }
      if (!super.isEmpty(body.certType)) {
        condi += ` certType like ?  and `;
        config.push('%' + body.certType + '%');
      }
      if (!super.isEmpty(body.patientId)) {
        condi += ` patientId like ?  and `;
        config.push('%' + body.patientId + '%');
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
        hosCardNo: body.hosCardNo
      })
      if (result) {
        throw new Error(`插入失败,[${body.hosCardNo}]已经存在`)
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
   * 增加数据提交保存数据
   *  {*} ctx 
   *  {*} next 
   */
  async add(ctx, next) {
    let result = {};
    try {

      let body = ctx.request.body;
      result = await db.isExists({
        hosCardNo: body.hosCardNo
      })
      if (result) {
        throw new Error(`插入失败,[${body.hosCardNo}]已经存在`)
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
        hosCardNo: body.hosCardNo
      }, body.accountId)
      if (result) {
        throw new Error(`修改失败,[${body.hosCardNo}]已经存在`)
      }

      result = await db.update(body, body.accountId); //更新数据

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
          id: item.accountId,
          text: item.hosCardNo
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
module.exports = new Ims_Account_Ctl;