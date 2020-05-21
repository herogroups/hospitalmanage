const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
class Sys_Module_DAO {
  /**
   * 获取数据列表
   *  {*} model 
   */
  async GetList(model, condi) {
    let _sql = ` SELECT * from   sys_module where ${condi} closed=0 order by SORTCODE `
    return await sqlUtil.query(_sql, model);
  }
  async GetParentList(model, condi) {
    let _sql = ` SELECT * from   sys_module where PARENTID=0 and closed=0 order by SORTCODE `
    return await sqlUtil.query(_sql, model);
  }
  async GetCodeByParentId(MODULEID) {
    let _sql = ` SELECT   MODULECODE from   sys_module where MODULEID=? and closed=0   `
    let result = await sqlUtil.query(_sql, [MODULEID])
    return result[0];
  }
  async GetMaxCodeByParentId(parentId) {
    let _sql = ` SELECT  LPAD( max(MODULECODE)+1,6,'0')  MODULECODE from   sys_module where parentId=? and closed=0   `
    let result = await sqlUtil.query(_sql, [parentId]);
    console.log('result',result);
    return result[0];
  }
  /** max(MODULECODE)+1  MODULECODE
   * 根据Id号查询数据
   *  { MODULEID} id 
   */
  async GetDataById(id) {

    let _sql = ` SELECT * from   sys_module where  MODULEID=?  limit 1`
    let result = await sqlUtil.query(_sql, [id])
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

    let _sql = ` SELECT * from  sys_module where ?  limit 1`
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

    let _sql = ` SELECT * from  sys_module where ? and  MODULEID !=? limit 1`
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
    let _sql = `INSERT INTO sys_module SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 更新数据否存在
   *  {*} model 
   */
  async Update(model, Id) {

    let _sql = ` update   sys_module set  ?  where    MODULEID = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async Remove(id) {
    let _sql = ` delete  from sys_module   where  MODULEID  =?   `
    let result = await sqlUtil.query(_sql, [id])
    return (result.affectedRows > 0) ? true : false;
  }
}

module.exports = new Sys_Module_DAO;