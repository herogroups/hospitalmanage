const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
class T_Bussrecord_DB {
  /**
   * 获取数据列表
   *  {*} model 
   */
  async getList(model, condi) {

    let _sql = ` SELECT * from   v_hos_bussallinfo where  ${condi}  0=0 order by  bussId desc `
    let result = await sqlUtil.query(_sql, model)

    return result;
  }
  async getPageList(model, condi, index, size) {
    let util = require("../../Libs/util")
    let page = {
      total: 0,
      rows: []
    };
    let _sql = `SELECT * FROM v_hos_bussallinfo where  ${condi}  0=0 order by  startTime desc LIMIT ${(index-1)*size} , ${size} `
    let _sql1 = `SELECT COUNT(*) AS total_count FROM v_hos_bussallinfo where  ${condi}  0=0  `


    let result = await sqlUtil.query(_sql, model)
    console.log('row===1',Array.isArray(result));
    if (Array.isArray(result) && result.length > 0) {
      result = result.map((row, index) => {
        console.log('row===',row);
        if ( !util.isNull(row.hosCardNo)  && row.hosCardNo.length>20){
          row.hideHosCardNo = util.plusXing(row.hosCardNo, 4, 4, 8,"*")
        } 
       
        return row;
      });
      
      page.total = (await sqlUtil.query(_sql1, model))[0].total_count;
      page.rows = result;

    }

    return page;
  }
  /**
   * 根据Id号查询数据
   *  { bussId} id 
   */
  async getSingle(model) {

    let _sql = ` SELECT * from   v_hos_bussallinfo where  ?  and 0=0  limit 1`
    let result = await sqlUtil.query(_sql, [model])
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

    let _sql = ` SELECT * from   t_hos_bussrecord where ?   limit 1`
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
  async isExistsOld(model, Id) {

    let _sql = ` SELECT * from   t_bussrecord where ? and   bussId !=?  and closed=0  limit 1`
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
    let _sql = `INSERT INTO  t_bussrecord SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 更新数据否存在
   *  {*} model 
   */
  async update(model, Id) {

    let _sql = ` update    t_bussrecord set  ?  where     bussId  = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async remove(id) {
    let _sql = ` update     t_bussrecord  set closed=1  where    bussId  =?   `
    let result = await sqlUtil.query(_sql, [id])

    return (result.affectedRows > 0) ? true : false;
  }
}

module.exports = new T_Bussrecord_DB;