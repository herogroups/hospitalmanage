﻿const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
class Ims_Account_DB {
  /**
   * 获取数据列表
   *  {*} model 
   */
  async getList(model, condi) {

    let _sql = ` SELECT * from   ims_account where ${condi} 1=1  order by  accountId desc `
    let result = await sqlUtil.query(_sql, model)

    return result;
  }
  async getListByOpenId(model) {

    let _sql = ` SELECT * from   ims_account where ?  order by isDefault, accountId desc `
    let result = await sqlUtil.query(_sql, model)

    return result;
  }
  /**
   * 根据Id号查询数据
   *  { accountId} id 
   */
  async getSingle(model) {

    let _sql = ` SELECT * from   ims_account where  ?    limit 1`
    let result = await sqlUtil.query(_sql, model)
    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  }
  async getSingleByHosCardNo(hosCardNo) {
    console.log('hoscardno=', hosCardNo);
    let _sql = ` SELECT * from   ims_account where  hosCardNo=?    limit 1`
    let result = await sqlUtil.query(_sql, [hosCardNo])
    return result;
  }
  /**
   * 查询是否存在
   *  {*} model 
   */

  async isExists(model) {

    let _sql = ` SELECT * from   ims_account where ?  limit 1`
    let result = await sqlUtil.query(_sql, [model])
    if (Array.isArray(result) && result.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  async isExistsByOpenIdAndHosCardNo(openid, hosCardNo) {
    console.log('openid,hosCardNo', openid, hosCardNo);
    let _sql = ` SELECT * from   ims_account where openid=? and hosCardNo =?  `
    console.log('sql', _sql);
    let result = await sqlUtil.query(_sql, [openid, hosCardNo])

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
  async isExistsOld(model, Id) {

    let _sql = ` SELECT * from   ims_account where ? and   accountId !=? limit 1`
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
  async add(model) {
    let _sql = `INSERT INTO  ims_account SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 更新数据否存在
   *  {*} model 
   */
  async update(model, Id) {

    let _sql = ` update    ims_account set  ?  where     accountId  = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    return (result.affectedRows > 0) ? true : false;
  }
  async updateIsDefaultSetFalse(openid) {

    let _sql = ` update    ims_account set IsDefault=0  where     openid  = ?    `
    let result = await sqlUtil.query(_sql, [openid])
    return (result.affectedRows > 0) ? true : false;
  }

  /**
   * 删除数据
   *  删除数据的ID
   */
  async remove(id) {
    let _sql = ` delete  from  ims_account   where    accountId  =?   `
    let result = await sqlUtil.query(_sql, [id])

    return (result.affectedRows > 0) ? true : false;
  }
}

module.exports = new Ims_Account_DB;