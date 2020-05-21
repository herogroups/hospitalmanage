const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
class Sys_Ref_DAO {
  /**
   * 获取数据列表
   *  {*} model 
   */
  async GetList() {
    let _sql = ` SELECT * from   sys_ref  `
    let result = await sqlUtil.query(_sql)
    return result;

  }
  /**
   * 根据Id号查询数据
   *  { REFID} id 
   */
  async GetDataById(id) {

    let _sql = ` SELECT * from   sys_ref where  REFID=?  limit 1`
    let result = await sqlUtil.query(_sql, [id])
    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  }
  async getSingle(model){
    let _sql = ` SELECT * from  sys_ref where ?  limit 1`
    let result = await sqlUtil.query(_sql, model) 
 
    return result[0].REFVALUE;
  }
  /**
   * 查询是否存在
   *  {*} model 
   */

  async IsExists(model) {

    let _sql = ` SELECT * from  sys_ref where ?  limit 1`
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

    let _sql = ` SELECT * from  sys_ref where ? and  REFID !=? limit 1`
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
    let _sql = `INSERT INTO sys_ref SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 更新数据否存在
   *  {*} model 
   */
  async Update(model, Id) {

    let _sql = ` update   sys_ref set  ?  where    REFID = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async Remove(id) {
    let _sql = ` delete  from sys_ref   where  REFID  =?   `
    let result = await sqlUtil.query(_sql, [id])
    return (result.affectedRows > 0) ? true : false;
  }
}

module.exports = new Sys_Ref_DAO;