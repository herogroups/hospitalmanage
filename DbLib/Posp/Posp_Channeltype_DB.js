

const sqlUtil = require('../../Libs/sqlUtil')
/**
 *操作数据类
 */
 class  Com_Channeltype_DB{
  /**
   * 获取数据列表
   *  {*} model 
   */
  async getList(model,condi) {
  
      let _sql = ` SELECT * from   com_channeltype where  ${condi}  0=0 order by  ChannelTypeId desc `
    let result = await sqlUtil.query(_sql,model)
 
    return result;
  }
  /**
   * 根据Id号查询数据
   *  { ChannelTypeId} id 
   */
  async getSingle(model) {

    let _sql = ` SELECT * from   com_channeltype where  ?  and 0=0  limit 1`
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

    let _sql = ` SELECT * from   com_channeltype where ?   limit 1`
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

    let _sql = ` SELECT * from   com_channeltype where ? and   ChannelTypeId !=?    limit 1`
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
   let _sql = `INSERT INTO  com_channeltype SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 更新数据否存在
   *  {*} model 
   */
  async update(model, Id) {

    let _sql = ` update    com_channeltype set  ?  where     ChannelTypeId  = ?   `
    let result = await sqlUtil.query(_sql, [model, Id])
    return (result.affectedRows > 0) ? true : false;
  }
  /**
   * 删除数据
   *  删除数据的ID
   */
  async remove(id) {
    let _sql = ` delete from     com_channeltype    where  ChannelTypeId  =?   `
    let result = await sqlUtil.query(_sql, [id])
 
    return (result.affectedRows > 0) ? true : false;
  } 
}

module.exports = new Com_Channeltype_DB;
