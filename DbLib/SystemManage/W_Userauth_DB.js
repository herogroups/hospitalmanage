﻿const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
class W_Userauth_DAO {
  /**
   * 获取数据列表
   *  {*} model 
   */

  async GetList(model, condi) {
    let _sql = ` SELECT * from   w_userauth where ${condi} 1=1 order by AuId desc `
    let result = await sqlUtil.query(_sql, model)

    return result;

  }

  async GetListAuthTerminal(model, condi) {
    let _sql = `select a.*,if(b.AuId is not null,1,0) as IsAuth from  v_sys_terminal a LEFT JOIN (select *   from w_tu    where ${condi} 1=1) b ON a.TERMINALID =b.TerminalId order by TERMINALID `
    let result = await sqlUtil.query(_sql, model)

    return result;

  }
  /**
   * 根据Id号查询数据
   *  { AuId} id 
   */
  async GetDataById(id) {

    let _sql = ` SELECT * from   w_userauth where  AuId=?  limit 1`
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

    let _sql = ` SELECT * from  w_userauth where ?  limit 1`
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

    let _sql = ` SELECT * from  w_userauth where ? and  AuId !=? limit 1`
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
    let _sql = `INSERT INTO w_userauth SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  async AuthoTerminal(model) {
    let _sql = `INSERT INTO w_tu SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }

  /**
   * 更新数据否存在
   *  {*} model 
   */
  async Update(model, Id) {

    let _sql = ` update   w_userauth set  ?  where    AuId = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async Remove(id) {
    let _sql = ` delete  from w_userauth   where  AuId  =?   `
    let result = await sqlUtil.query(_sql, [id])
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async RemoveTu(id) {
    let _sql = ` delete  from w_tu   where  AuId  =?   `
    let result = await sqlUtil.query(_sql, [id])
    return (result.affectedRows > 0) ? true : false;
  }
}

module.exports = new W_Userauth_DAO;