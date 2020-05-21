const db = require('../../DbLib/SystemManage/Sys_Upfile_DB')
const Ctrlbase = require('../CtrBase')
const fs = require('fs')
const path = require('path')

var adm_zip = require('adm-zip');
/**
 * 命令业务控制模块
 */
class sys_upfile extends Ctrlbase {
  /***
   * 进入查询索引控制页面
   */
   /***
   * 进入查询索引控制页面
   */
  async Index(ctx, next) {

    await ctx.render('/SystemManage/Sys_Upfile/Index', {
      FILEPACKAGETYPE: 0,
      titleName: '应用软件'
    });
  }

  async PicIndex(ctx, next) {

    await ctx.render('/SystemManage/Sys_Upfile/Index', {
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
    await ctx.render('/SystemManage/Sys_Upfile/AddIndex', {
      FILEPACKAGETYPE: packType,
      titleName: name
    });
  }

  /**
   * 列表查询界面
   *  {*} ctx 
   *  {*} next 
   */
  async GetAllList(ctx, next) {

    let result = {};
    let body = ctx.request.body;
    try {
    
      let condi = "";
      let config = [];
      if (body.SOFTID != -1) {
        condi += ` SOFTID = ? and `;
        config.push(body.SOFTID);
      }
      if (!super.isEmpty(body.UPBEFOREFILENAME)) {

        condi += `  UPBEFOREFILENAME like ? and `
        config.push('%' + body.UPBEFOREFILENAME + '%');
      }


      condi += `  FILEPACKAGETYPE = ? and `
      config.push(body.FILEPACKAGETYPE);

      result = await db.GetList(config, condi);
      let memo = (body.FILEPACKAGETYPE==0)?"应用程序上传":'轮播图上传';
      super.add_log(ctx, 0,memo, 0);
    } catch (err) {
      let memo = (body.FILEPACKAGETYPE==0)?"应用程序上传":'轮播图上传';
      super.add_log(ctx, 0,memo, 1);
      console.log(err)
      result = [];
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
    let body = ctx.request.body;
    try {
    
      body.USERID = ctx.User.UserId;
      body.UPTIME = new Date();
      result = await db.Add(body);
      if (result.affectedRows < 1) {
        throw new Error('添加失败');
      }
      let filepath = 'download/' + result.insertId
      if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath)
      }

      // fs.createReadStream(body.UPFILENAME).pipe(unzip.Extract({
      //   path: filepath
      // }), {
      //   encoding: 'base64'
      // });
     
      var unzip = new adm_zip(body.UPFILENAME);  
      unzip.extractAllTo(filepath, /*overwrite*/true);

      // yauzl.open(body.UPFILENAME, {
      //   lazyEntries: true,
      
      // }, function (err, zipfile) {
      //   if (err) throw err;
      //   zipfile.readEntry();
      //   zipfile.on("entry", function (entry) {
      //     filepath = path.join('./' + filepath, entry.fileName)
      //     console.log('filepath', filepath);
      //     if (/\/$/.test(entry.fileName)) {
      //       if (!fs.existsSync(filepath)) {
      //         fs.mkdirSync(filepath);
      //       }
      //       zipfile.readEntry();
      //     } else {
      //       zipfile.openReadStream(entry, function (err, readStream) {
      //         if (err) throw err;
      //         readStream.on("end", function () {
      //           zipfile.readEntry();
      //         });
      //         readStream.pipe(fs.createWriteStream(filepath),{});
      //       });
      //     }
      //   }).on("close", function () {
      //     console.log("解压完成");
      //   });
      // });
      result = {
        Success: true,
        Msg: '添加成功'
      };

    } catch (err) {
      ctx.log.error(err);
      console.log('err',err);
      result = {
        Success: false,
        Msg: err.message
      };
    }
    ctx.body = result;
  }
  async upload(ctx, next) {
    // 上传单个文件
    const file = ctx.request.files.txt_file; // 获取上传文件 
    ctx.body = {
      aftername: file.path
    };
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
        UPFILENAME: body.UPFILENAME
      }, body.FILEID)
      if (result) {
        throw new Error(`修改失败,[${body.UPFILENAME}]已经存在`)
      }
      result = await db.Update(body, body.FILEID); //更新数据

      if (!result) {
        throw new Error('修改失败');
      }
      result = {
        Success: true,
        Msg: '修改成功'
      };

    } catch (err) {
      ctx.log.error(err);
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
    try {
      let body = ctx.request.body;
      result = await db.GetList(); //获取下拉列表框数据    
      items = result.map((item, index) => {
        return {
          id: item.FILEID,
          text: item.UPFILENAME
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
var body = new sys_upfile();
module.exports = body;