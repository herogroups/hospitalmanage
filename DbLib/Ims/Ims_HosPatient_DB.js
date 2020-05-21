

const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
 class  Ims_HosPatient_DB{
 
  /**
   * 根据Id号查询数据
   *  { accountId} id 
   */
  async getSingle(model) {

    let _sql = ` SELECT * from   ims_hospatient where  ?    limit 1`
     let result = await sqlUtil.query(_sql,model)
      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      } else {
        return null;
      } 
  }
  
  /**
   * 添加数据
   *  {*} model 
   */
  async add(model) {
   let _sql = `INSERT INTO  ims_hospatient SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
 
   
}

module.exports = new Ims_HosPatient_DB;
