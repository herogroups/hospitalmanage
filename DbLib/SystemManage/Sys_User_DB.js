const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
class Sys_User_DAO {
  /**
   * 获取数据列表
   *  {*} model 
   */
  /**
   * 获取数据列表
   *  {*} model 
   */

  async GetList(model, condi) {
    console.log(model,condi);
    let _sql = ` SELECT * from  v_sys_user where   ${condi} closed=0 order by Opid desc`
    console.log('---------------------mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm---------------------------',_sql );
    let result = await sqlUtil.query(_sql, model)
    console.log('------------------------------------------------------',result);
    return result;
  }
  async GetByUserPassword(acctount, password) {

    let _sql = ` SELECT * from  v_sys_user where   ACCOUNT=?  and USERPASSWORD =? limit 1`
    console.log(password);
    let result = await sqlUtil.query(_sql, [acctount, password]);
    if (result.code != null) {
      throw new Error('连接数据库失败')
    }
    return result;
  }
  async GetByUserCode(acctount) {

    let _sql = ` SELECT * from  v_sys_user where   ACCOUNT=?   limit 1`

    let result = await sqlUtil.query(_sql, [acctount]);
    return result;
  }



  /**
   * 根据Id号查询数据
   *  { OPID} id 
   */
  async GetDataById(id) {

    let _sql = ` SELECT * from   sys_user where  OPID=?  limit 1`
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

    let _sql = ` SELECT * from  sys_user where ?  limit 1`
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

    let _sql = ` SELECT * from  sys_user where ? and  OPID !=? limit 1`
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
    let _sql = `INSERT INTO sys_user SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 更新数据否存在
   *  {*} model 
   */
  async Update(model, Id) {

    let _sql = ` update   sys_user set  ?  where    OPID = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    console.log(result);
    return (result.affectedRows > 0) ? true : false;
  }
  async UpdatePassword(model, Id) {

    let _sql = ` update   sys_user set  ?  where    OPID = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async Remove(id) {
    let _sql = ` delete  from sys_user   where  OPID  =?   `
    let result = await sqlUtil.query(_sql, [id])
    return (result.affectedRows > 0) ? true : false;
  }
}

module.exports = new Sys_User_DAO;