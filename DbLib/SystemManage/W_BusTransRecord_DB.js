const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
 class  W_BusTransRecord_DAO{
  /**
   * 获取数据列表
   *  {*} model 
   */
 
  async GetList(model,condi) {
    let _sql = ` SELECT * from   W_BusTransRecord where ${condi} 1=1 order by recordId desc `
    let result = await sqlUtil.query(_sql,model)
   
    return result;

  }
    
}

module.exports = new W_BusTransRecord_DAO;
