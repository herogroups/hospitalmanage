const sqlUtil = require('../../Libs/sqlUtil')
/**
 * 终端功能数据操作数类
 */
class hos_func_DAO {
  /**
   * 获取数据列表
   *  {*} model 
   */
  async GetList(model,condi) {
    
    let _sql = ` SELECT * from  hos_func where ${condi} 1=1 and closed=0 order by isUse `
    let result = await sqlUtil.query(_sql,model)
 
     return result;
    
  }
  
  /**
   * 根据Id号查询数据
   * @param {funcId} id 
   */
  async GetDataById(id) {

    let _sql = ` SELECT * from  hos_func where funcId=?  limit 1`
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

    let _sql = ` SELECT * from  hos_func where ?  limit 1`
    let result = await sqlUtil.query(_sql, [model])
    if (Array.isArray(result) && result.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * 修改数据前判断旧的数据是否存在相同名称的数据
   * @param {*} model 
   * @param {*} Id 
   */
  async IsExistsOld(model,Id) {

    let _sql = ` SELECT * from  hos_func where ? and funcId !=? limit 1`
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
    let _sql = `INSERT INTO hos_func SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 更新数据否存在
   *  {*} model 
   */
  async Update(model, Id) {

    let _sql = ` update   hos_func set  ?  where   funcId = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async Remove(id) {
    let _sql = ` update   hos_func  set closed=1  where funcId  =?   `
    console.log('_sql',_sql,id);
    let result = await sqlUtil.query(_sql, [id])
    return (result.affectedRows > 0) ? true : false;
  } 
}

module.exports = new hos_func_DAO;