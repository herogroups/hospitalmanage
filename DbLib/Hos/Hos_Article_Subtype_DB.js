

const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
 class  weichat_Article_Subtype_DB{
  /**
   * 获取数据列表
   *  {*} model 
   */
  async GetList(model,condi) {
  
      let _sql = ` SELECT * from   weichat_article_subtype inner join weichat_article_type  where ${condi} weichat_article_type.typeid=weichat_article_subtype.typeid and weichat_article_subtype.closed=0 order by  subTypeId desc `
    let result = await sqlUtil.query(_sql,model)
 
    return result;
  }
  /**
   * 根据Id号查询数据
   *  { subTypeId} id 
   */
  async GetDataById(id) {

    let _sql = ` SELECT * from   weichat_article_subtype inner join weichat_article_type  where   weichat_article_type.typeid=weichat_article_subtype.typeid and weichat_article_subtype.closed=0  and subTypeId=?  limit 1`
     let result = await sqlUtil.query(_sql,[id])
      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      } else {
        return null;
      } 
  }
  /**
   * 查询是否存在
   *  {*} model 
   */

  async IsExists(model) {

    let _sql = ` SELECT * from   weichat_article_subtype where ?  limit 1`
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
  async IsExistsOld(model,Id) {

    let _sql = ` SELECT * from   weichat_article_subtype where ? and   subTypeId !=? limit 1`
    let result = await sqlUtil.query(_sql, [model,Id])
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
   let _sql = `INSERT INTO  weichat_article_subtype SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 更新数据否存在
   *  {*} model 
   */
  async Update(model, Id) {

    let _sql = ` update    weichat_article_subtype set  ?  where     subTypeId  = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    return (result.changedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async Remove(id) {
    let _sql = ` delete  from  weichat_article_subtype   where    subTypeId  =?   `
    let result = await sqlUtil.query(_sql, [id])
 
    return (result.affectedRows > 0) ? true : false;
  } 
}

module.exports = new weichat_Article_Subtype_DB;
