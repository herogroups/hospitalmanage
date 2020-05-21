const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
class weichat_Article_DB {
  /**
   * 获取数据列表
   *  {*} model 
   */
  async GetList(model) {

    let _sql = ` SELECT *  FROM  v_ims_article where  ?  and closed=0 order by  articleId desc `
    let result = await sqlUtil.query(_sql, model)

    return result;
  }
  async GetDataById(id) {

    let _sql = ` SELECT *  FROM  v_ims_article where articleId= ?  and closed=0 order by  articleId desc `
    let result = await sqlUtil.query(_sql, [id])

    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  }

  /**
   * 获取单条记录
   * @param {array} model 
   * @param {string} condi 
   */
  async GetSingle(model) {

    let _sql = ` SELECT *  FROM v_ims_article    where   ? and closed=0  limit 1`
    let result = await sqlUtil.query(_sql, model)
    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  }
  
  /**
   * 获取文章内容
   * @param {array} model 
   * @param {string} condi 
   */
  // async GetArticleSingle(model,condi) {

  //   let _sql = ` SELECT title,contents,weichat_article.createDate FROM  weichat_article INNER JOIN weichat_article_subtype ON weichat_article.subTypeId = weichat_article_subtype.subTypeId    where   ${condi} weichat_article.closed=0  limit 1`
  //    let result = await sqlUtil.query(_sql,model)
  //     if (Array.isArray(result) && result.length > 0) {
  //       return result[0];
  //     } else {
  //       return null;
  //     } 
  // }
  async GetArticleSingle(model) {

    let _sql = ` SELECT title,contents,weichat_article.createDate FROM  v_ims_article   where   ? and closed=0  limit 1`
    let result = await sqlUtil.query(_sql, model)
    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  }
  /**
   * 查询是否存在
   *  {string} model 
   */

  async IsExists(model) {

    let _sql = ` SELECT * from   weichat_article where ${condi}  limit 1`
    let result = await sqlUtil.query(_sql, [model])
    if (Array.isArray(result) && result.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * 修改数据前判断旧的数据是否存在相同名称的数据
   * {*} model 
   * {*} Id 
   */
  async IsExistsOld(model, Id) {

    let _sql = ` SELECT * from   weichat_article where ${condi} and   articleId !=? limit 1`
    let result = await sqlUtil.query(_sql, [model, Id])
    if (Array.isArray(result) && result.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * 添加数据
   *  {*} model 
   */
  async Add(model) {
    let _sql = `INSERT INTO  weichat_article SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 更新数据否存在
   *  {*} model 
   */
  async Update(model, Id) {

    let _sql = ` update    weichat_article set  ?  where     articleId  = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    return (result.changedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async Remove(id) {
    let _sql = ` delete  from  weichat_article   where    articleId  =?   `
    let result = await sqlUtil.query(_sql, [id])

    return (result.affectedRows > 0) ? true : false;
  }
}

module.exports = new weichat_Article_DB;