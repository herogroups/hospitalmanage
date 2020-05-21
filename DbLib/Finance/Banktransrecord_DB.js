

const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
 class  Banktransrecord_DB{
  /**
   * 获取数据列表
   *  {*} model 
   */
  async getList(model,condi) {
  
      let _sql = ` SELECT * from   v_mis_banktransrecord where  ${condi}  0=0 order by  BankTransID desc `
    let result = await sqlUtil.query(_sql,model)
   
    return result;
  }
  async getPageList(model, condi, index, size) {
    const dateUtil = require('../../Libs/date-utils')
    let page = {
      total: 0,
      rows: []
    };
    let _sql = `SELECT * FROM v_mis_banktransrecord where  ${condi}  0=0 order by  BankTransDateTime desc LIMIT ${(index-1)*size} , ${size} `
    let _sql1 = `SELECT COUNT(*) AS total_count FROM v_mis_banktransrecord where  ${condi}  0=0  `
    let _sql2 = `SELECT sum(TotalAmt) AS total_amt  FROM v_mis_banktransrecord where  ${condi}  0=0  `
    
    let result = await sqlUtil.query(_sql, model)
    if (Array.isArray(result) && result.length > 0) {      
      page.total =  ( await sqlUtil.query(_sql1, model))[0].total_count;
      page.rows =result;
      page.total_amt =  ( await sqlUtil.query(_sql2, model))[0].total_amt;
    }
   
    return page;
  }
  /**
   * 根据Id号查询数据
   *  { BankTransID} id 
   */
  async getSingle(model) {

    let _sql = ` SELECT * from   v_mis_banktransrecord where  ?  and 0=0  limit 1`
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

    let _sql = ` SELECT * from   banktransrecord where ?   limit 1`
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

    let _sql = ` SELECT * from   banktransrecord where ? and   BankTransID !=?  and closed=0  limit 1`
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
   let _sql = `INSERT INTO  banktransrecord SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 更新数据否存在
   *  {*} model 
   */
  async update(model, Id) {

    let _sql = ` update    banktransrecord set  ?  where     BankTransID  = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async remove(id) {
    let _sql = ` delete  from  banktransrecord   where    BankTransID  =?   `
    let result = await sqlUtil.query(_sql, [id])
 
    return (result.affectedRows > 0) ? true : false;
  } 
  async getPaymodelList(model,condi) {
  
    let _sql = ` SELECT * from   com_paycode where  ${condi}  closed=0 order by  payCodeId desc `
  let result = await sqlUtil.query(_sql,model)
 
  return result;
}
async getBankCodeList(model,condi) {
  
  let _sql = ` SELECT * from    com_bankcode where  ${condi}  closed=0 order by  bankCodeId desc `
let result = await sqlUtil.query(_sql,model)

return result;
}

async GetPayResultList(model,condi) {
  
  let _sql = ` SELECT * from   mis_payresult where  ${condi}  0=0 order by  payResultId desc `
let result = await sqlUtil.query(_sql,model)

return result;
}


}

module.exports = new Banktransrecord_DB;
