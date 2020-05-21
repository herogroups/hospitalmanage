

const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
 class  Ims_Pay_DB{
  /**
   * 获取数据列表
   *  {*} model 
   */
  async getList(model,condi) {
  
      let _sql = ` SELECT * from   ims_pay where  ${condi} 1=1 order by  payId desc `
    let result = await sqlUtil.query(_sql,model)
 
    return result;
  }
  /**
   * 根据Id号查询数据
   *  { payId} id 
   */
  async getSingleById(model) {
 
    let _sql = ` SELECT * from   ims_pay where  ?  limit 1`
     let result = await sqlUtil.query(_sql,[model])
     console.log('mysql',_sql,);
      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      } else {
        return null;
      } 
  }
  async getSingle(model) {
 
    let _sql = ` SELECT * from   ims_pay where  orderCode=? and openid=? limit 1`
     let result = await sqlUtil.query(_sql,[model.orderCode,model.openid])
     console.log('mysql',_sql,);
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

    let _sql = ` SELECT * from   ims_pay where ?  limit 1`
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

    let _sql = ` SELECT * from   ims_pay where ? and   payId !=? limit 1`
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
   let _sql = `INSERT INTO  ims_pay SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return result;
  }
  /**
   * 更新数据
   *  {*} model 
   */
  async update(model, payId) {

    let _sql = ` update    ims_pay set  ?  where     payId  = ? `
    let result = await sqlUtil.query(_sql, [model, payId ]) 
    return (result.affectedRows > 0) ? true : false;
  }
 
  async updateByorderCode(model, orderCode) {

    let _sql = ` update    ims_pay set  ?  where     orderCode  = ?   `
    let result = await sqlUtil.query(_sql, [model, orderCode])
    return (result.affectedRows > 0) ? true : false;
  }
  async updateRefunByorderCode(transState,refundFee, orderCode) {
  
    let _sql = ` update    ims_pay set  transState=? ,refundFee=refundFee+? where     orderCode  = ?   `
    let result = await sqlUtil.query(_sql, [transState,refundFee, orderCode])
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async remove(id) {
    let _sql = ` delete  from  ims_pay   where    payId  =?   `
    let result = await sqlUtil.query(_sql, [id])
 
    return (result.affectedRows > 0) ? true : false;
  } 
}

module.exports = new Ims_Pay_DB;
