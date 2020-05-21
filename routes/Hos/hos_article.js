const db = require('../../DbLib/Hos/Hos_Article_DB')
const uploadFile = require('../../Libs/uploadFile')
const Ctrlbase = require('../CtrBase')
/**
 * 命令业务控制模块
 */
class hos_article extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */

  async Index(ctx, next) {
    let query = ctx.query;
    if (query.subTypeId == 1) {
      ctx.query.Id = 1;
      let result = await db.GetSingle({
        ArticleId: ctx.query.Id
      });
      await ctx.render(`/Hos/Hos_Article/${query.subTypeCode}/UpdateIndex`, {
        subTypeId: query.subTypeId,
        subTypeCode: query.subTypeCode,
        subTypeName: query.subTypeName,
        'Model': result
      });
      return;
    }
    await ctx.render(`/Hos/Hos_Article/${ query.subTypeCode}/Index`, {
      subTypeId: query.subTypeId,
      subTypeCode: query.subTypeCode,
      subTypeName: query.subTypeName
    });
  }
  async SinglePage(ctx,index){
    let query = ctx.query;
     
   
      let result = await db.GetSingle({
        subTypeId: ctx.query.subTypeId
      });
      await ctx.render(`/Hos/Hos_Article/${query.subTypeCode}/SinglePage`, {
        articleId:result.articleId,
        subTypeId: query.subTypeId,
        subTypeCode: query.subTypeCode,
        subTypeName: query.subTypeName,
        'Model': result
      });
     
     
  }
  /***
   * 进入添加界面
   */
  async AddIndex(ctx, next) {
    let query = ctx.query;

    await ctx.render(`/Hos/Hos_Article/${query.subTypeCode}/AddIndex`, {
      subTypeId: query.subTypeId,
      subTypeCode: query.subTypeCode,
      subTypeName: query.subTypeName
    });
  }


  /**
   * 进入修改界面
   *  {*} ctx 
   *  {*} next 
   */
  async UpdateIndex(ctx, next) {
    let query = ctx.query;

    try {
      let result = {};
      result = await db.GetDataById(ctx.query.Id);

      await ctx.render(`/Hos/Hos_Article/${query.subTypeCode}/UpdateIndex`, {
        subTypeId: query.subTypeId,
        subTypeCode: query.subTypeCode,
        subTypeName: query.subTypeName,
        'Model': result
      });
    } catch (err) {
      console.log(err)
      ctx.log.error(err)
    }

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
  
      config.push({subTypeId:body.subTypeId});
      result = await db.GetList(config);

    } catch (err) {
      result = null;
      ctx.log.error(err)
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
      body.author = ctx.User.UserName;
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
  async Update(ctx, next) {
    let result = {};
    try {
    
      let body = ctx.request.body;
      console.log(body)
      body.author = ctx.User.UserName;
      body.CREATEDATE = new Date();
      body.CLOSED = 0;
      result = await db.Update(body, body.articleId); //更新数据

      if (!result) {
        throw new Error('修改失败');
      }
      result = {
        Success: true,
        Msg: '修改成功'
      };

    } catch (err) {
      ctx.log.error(err)
      result = {
        Success: false,
        Msg: err.message
      };
    }
    ctx.body = result;
  }
  /**
   * 上传文件名
   * @param  ctx 
   * @param  next 
   */
  async upload(ctx, next) {
    // 上传文件
    try {
      const file = ctx.request.files.filename; // 获取上传文件  
      console.log(ctx.request.files)
      const newFile = uploadFile.upfile(file, `download/article/`);

      ctx.body = {
        aftername: newFile
      };
    } catch (err) {
      console.log(err)
      ctx.log.err(err);
    }
  }
  async uploadSingle(ctx, next) {
    // 上传单个文件
    try {
      const file = ctx.request.files.file; // 获取上传文件  
      console.log(ctx.request.files)
      const newFile = uploadFile.upfile(file, `download/article/`);

      ctx.body = {
        aftername: "/"+newFile.replace(/\\/g,"/")
      };
    } catch (err) {
      console.log(err)
   
    }
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
          id: item.articleId,
          text: item.imgUrl
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
module.exports = new hos_article;