const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
class weichat_Dept_DB {
  /**
   * 获取数据列表
   *  {*} model 
   */
  async GetList(model, condi) {

    let _sql = ` SELECT * from   weichat_dept where ${condi} closed=0 order by  deptId desc `
    let result = await sqlUtil.query(_sql, model)

    return result;
  }
  async GetDeptList(model) {

    let _sql = ` SELECT deptId,    deptCode,    deptName,    deptDesc,    address,    imgUrl,    telNo from   weichat_dept where  closed=0 order by  deptId desc `
    let result = await sqlUtil.query(_sql, model)

    return result;
  }
  async GetSingle(model) {
     
    
    let _sql = ` SELECT deptCode,deptName,deptDesc,ImgUrl from   weichat_dept where  ?  and closed=0 order by  deptId desc limit 1`
    let result = await sqlUtil.query(_sql, model)
    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  }
  /**
   * 根据Id号查询数据
   *  { deptId} id 
   */
  async GetDataById(id) {

    let _sql = ` SELECT * from   weichat_dept where  deptId=?  limit 1`
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

    let _sql = ` SELECT * from   weichat_dept where ?  limit 1`
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

    let _sql = ` SELECT * from   weichat_dept where ? and   deptId !=? limit 1`
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
    let _sql = `INSERT INTO  weichat_dept SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 更新数据否存在
   *  {*} model 
   */
  async Update(model, Id) {

    let _sql = ` update    weichat_dept set  ?  where     deptId  = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    return (result.changedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async Remove(id) {
    let _sql = ` delete  from  weichat_dept   where    deptId  =?   `
    let result = await sqlUtil.query(_sql, [id])

    return (result.affectedRows > 0) ? true : false;
  }
}

module.exports = new weichat_Dept_DB;