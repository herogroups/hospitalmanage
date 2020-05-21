﻿

const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
 class  Tdz_Detail_DB{
  /**
   * 获取数据列表
   *  {*} model 
   */
  async getList(model,condi) {
  
      let _sql = ` SELECT * from   v_tdz_detail where  ${condi}  delMark=0 order by  DetailId desc `
      console.log(_sql)
    let result = await sqlUtil.query(_sql,model)
 
    return result;
  }
  /**
   * 根据Id号查询数据
   *  { DetailId} id 
   */
  async getSingle(model) {

    let _sql = ` SELECT * from   v_tdz_detail where  ?    limit 1`
     let result = await sqlUtil.query(_sql,[model])
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

  async isExists(model) {

    let _sql = ` SELECT * from   tdz_detail where ?  limit 1`
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
  async isExistsOld(model,Id) {

    let _sql = ` SELECT * from   tdz_detail where ? and   DetailId !=? limit 1`
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
  async add(model) {
   let _sql = `INSERT INTO  tdz_detail SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 更新数据否存在
   *  {*} model 
   */
  async update(model, Id) {

    let _sql = ` update    tdz_detail set  ?  where     DetailId  = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async remove(id) {
    let _sql = ` delete  from  tdz_detail   where    DetailId  =?   `
    let result = await sqlUtil.query(_sql, [id])
 
    return (result.affectedRows > 0) ? true : false;
  } 
}

module.exports = new Tdz_Detail_DB;
