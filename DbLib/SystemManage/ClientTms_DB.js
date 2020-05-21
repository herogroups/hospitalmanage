const sqlUtil = require('../../Libs/sqlUtil')
var terminal = {
  IsExistsTerminalCode: async function (terminalCode) {
    return terminal.getTerminal(terminalCode)
  },
  UpdateAppVersion: async function (appVersionCode, terminalCode) {
    let _sql = ` update   sys_terminal set APPVERSION=?  where TERMINALCODE=?   `
    let result = await sqlUtil.query(_sql, [appVersionCode, terminalCode])
    return result
  },
  UpdateAdvVersion: async function (VersionCode, terminalCode) {
    let _sql = ` update   sys_terminal set ADVERSION=?  where TERMINALCODE=?   `
    let result = await sqlUtil.query(_sql, [VersionCode, terminalCode])
    return result
  },
  UpLoadExeCmd: async function (terminalCode) {
    let _sql = ` update   sys_terminal set docmd=1  where TERMINALCODE=?   `
    let result = await sqlUtil.query(_sql, [terminalCode])


    return result
  },
  UpLoadLog: async function (model, terminalCode) {
    let _sql = `INSERT INTO sys_upload SET ?   `
    let result = await sqlUtil.query(_sql, model)
    _sql = ` update   sys_terminal set UPLOADLOGTIME=?  where TERMINALCODE=?   `
    await sqlUtil.query(_sql, [new Date(), terminalCode])
    return (result.affectedRows > 0) ? true : false;
  },
  UpLoadBusImg: async function (model) { //上传业务图片 地产
    let _sql = `INSERT INTO w_uploadbusimg SET ?   `
    let result = await sqlUtil.query(_sql, model)
    return (result.affectedRows > 0) ? true : false;
  },

  UpLoadBusData: async function (model, terminalCode) { //上传业务数据 地产
    let _sql = `INSERT INTO w_bustransrecord SET ?   `
    let result = await sqlUtil.query(_sql, model)

    return (result.affectedRows > 0) ? true : false;
  },


  UpLoadDeviceState: async function (EsamState, EsamDesc, CardReaderState, CardReaderDesc, PrinterDesc, IdReaderState, IdReaderDesc, terminalCode) {
    let _sql = ` update   sys_terminal set EsamState=? ,EsamDesc=? ,  CardReaderState =? ,    CardReaderDesc=? ,    PrinterDesc	=? ,    IdReaderState=?	,     IdReaderDes=? where TERMINALCODE=?   `
    let result = await sqlUtil.query(_sql, [EsamState, EsamDesc, CardReaderState, CardReaderDesc, PrinterDesc, IdReaderState, IdReaderDesc, terminalCode])
    return result
  },
  updateLastTime: async function (terminalCode) {
    let _sql = ` update   sys_terminal set LASTUPDATETIME=?  where TERMINALCODE=?   `
    let result = await sqlUtil.query(_sql, [new Date(), terminalCode])
  },
  downFile: async function (terminalCode, packagetype) {

    let _sql = ` SELECT * from sys_upfile b inner join sys_terminal a on a.appsoftid=b.softid inner join sys_soft c on c.softid=b.softid  where TERMINALCODE=? and FILEPACKAGETYPE=? order by fileid desc limit 1`

    let result = await sqlUtil.query(_sql, [terminalCode, packagetype])


    return result
  },
  getTerminal: async function (terminalCode) {
    terminal.updateLastTime(terminalCode)
    let _sql = ` SELECT * from sys_terminal where TERMINALCODE=?  limit 1`
    let result = await sqlUtil.query(_sql, [terminalCode])

    if ((Array.isArray(result)) && result.length > 0) {
      await terminal.updateLastTime(terminalCode)
    }
    return result;
  },

  getUpFileByTerminalCode: async function (terminalCode, FILEPACKAGETYPE) {

    let _sql = ` SELECT
      sys_upfile.VERSION,
      sys_terminal.TERMINALCODE,
      sys_upfile.PUBLISHTIME,
      sys_upfile.FILEID
 
    FROM
      sys_terminal
      INNER JOIN sys_soft ON sys_terminal.APPSOFTID = sys_soft.SOFTID
      INNER JOIN sys_upfile ON sys_upfile.SOFTID = sys_soft.SOFTID
    where terminalCode=? and FILEPACKAGETYPE=?
     order by FILEID desc LIMIT 1`

    let result = await sqlUtil.query(_sql, [terminalCode, FILEPACKAGETYPE])

    let version = ((Array.isArray(result)) && result.length > 0) ? result[0].VERSION.toString() : "0";
    return version;
  },
  getAuthoImage: async function (terminalCode) {

    let _sql = ` SELECT AuCode,AuName,AuImageUrl from w_userauth b inner join w_tu a on a.auid=b.auid inner join sys_terminal c on c.terminalid=a.terminalid  where TERMINALCODE=? order by b.auid`

    let result = await sqlUtil.query(_sql, [terminalCode])

    return result
  },
  GetBusType: async function (terminalCode) {
    let _sql = ` SELECT
      w_bustype.busCode,
      w_bustype.busName,
    IF
      ( tbId, 1, 0 ) AS isUse 
    FROM
      w_bustype
      LEFT JOIN ( SELECT w_tb.* FROM w_tb INNER JOIN sys_terminal ON w_tb.terminalId = sys_terminal.TERMINALID WHERE TERMINALCode = ? ) w_tb ON w_bustype.busTypeId = w_tb.busTypeId 
    ORDER BY
      isUse`;
    000002
    let result = await sqlUtil.query(_sql, [terminalCode])

    return result
  }
}
module.exports = terminal;