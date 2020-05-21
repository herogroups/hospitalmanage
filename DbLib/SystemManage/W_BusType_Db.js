

const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
 class  w_busType_DAO{
  /**
   * 获取数据列表
   *  {*} model 
   */
 
  async GetList(model,condi) {
    let _sql = ` SELECT * from   w_busType where ${condi} 1=1 order by busTypeId desc `
    let result = await sqlUtil.query(_sql,model)
   
    return result;

  }
   
  async GetListBusTerminal(model,condi) {
    let _sql = `select a.*,if(b.busTypeId is not null,1,0) as IsAuth from  v_sys_terminal a LEFT JOIN (select *   from w_tb    where ${condi} 1=1) b ON a.TERMINALID =b.TerminalId order by TERMINALID `
    let result = await sqlUtil.query(_sql,model)
  
    return result;

  }
  /**
   * 根据Id号查询数据
   *  { busTypeId} id 
   */
  async GetDataById(id) {

    let _sql = ` SELECT * from   w_busType where  busTypeId=?  limit 1`
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

    let _sql = ` SELECT * from  w_busType where ?  limit 1`
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

    let _sql = ` SELECT * from  w_busType where ? and  busTypeId !=? limit 1`
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
    let _sql = `INSERT INTO w_busType SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  async AuthoTerminal(model) {
    let _sql = `INSERT INTO w_tb SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  
  /**
   * 更新数据否存在
   *  {*} model 
   */
  async Update(model, Id) {

    let _sql = ` update   w_busType set  ?  where    busTypeId = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async Remove(id) {
    let _sql = ` delete  from w_busType   where  busTypeId  =?   `
    let result = await sqlUtil.query(_sql, [id])
    return (result.affectedRows > 0) ? true : false;
  }  
    /**
   * 删除数据
   *  删除数据的ID
   */
  async RemoveTu(id) {
    let _sql = ` delete  from w_tb   where  busTypeId  =?   `
    let result = await sqlUtil.query(_sql, [id])
    return (result.affectedRows > 0) ? true : false;
  } 
}

module.exports = new w_busType_DAO;
