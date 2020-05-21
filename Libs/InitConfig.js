const config = require('../conf/config')
let singleInst;
var _appId = "";
var _appSecret = "";
var _token = "";
var _redirect_url = "";
var _hosServiceUrl = "";
var _hosCode = "";
var _tradeSrc = "";
var _operNo = "";
var _terminalNo="";
var _hosWelcomeMsg='';
class InitConfig {
    get appId() {

        return _appId;
    }
    get appSecret() {

        return _appSecret;
    }
    get token() {

        return _token;
    }
    get redirect_url() {

        return _redirect_url;
    }
    get hosServiceUrl() {

        return _hosServiceUrl;
    }
    get hosCode() {

        return _hosCode;
    }
    get tradeSrc() {

        return _tradeSrc;
    }
    get operNo() {

        return _operNo;
    }
    get terminalNo(){
       return  _terminalNo;
    }
    get hosWelcomeMsg(){
        return  _hosWelcomeMsg;
     }
    
    static async Instance() {

        if (!singleInst) {
            const sys_ref_db = require('../DbLib/SystemManage/Sys_Ref_DB')
            singleInst = new InitConfig();
            let list = await sys_ref_db.GetList();
            _appId = InitConfig.getItem(list,'appId');
            _appSecret = InitConfig.getItem(list,'appSecret');
            _redirect_url = InitConfig.getItem(list,'redirect_url');
            _hosServiceUrl = InitConfig.getItem(list,'hosServiceUrl');
            _hosCode = InitConfig.getItem(list,'hosCode');
            _tradeSrc = InitConfig.getItem(list,'tradeSrc');
            _terminalNo = InitConfig.getItem(list,'terminalNo');
            _operNo = InitConfig.getItem(list,'operNo');
            _hosWelcomeMsg = InitConfig.getItem(list,'hosWelcomeMsg');
            console.log('__hosWelcomeMsg',_hosWelcomeMsg)

            // _appId = await sys_ref_db.getSingle({
            //     REFNAME: 'appId'
            // });
          
            // _appSecret = await sys_ref_db.getSingle({
            //     REFNAME: 'appSecret'
            // });
            // _token = await sys_ref_db.getSingle({
            //     REFNAME: 'token'
            // });
            // _redirect_url = await sys_ref_db.getSingle({
            //     REFNAME: 'redirect_url'
            // });
            // _hosServiceUrl = await sys_ref_db.getSingle({
            //     REFNAME: 'hosServiceUrl'
            // });
            // _hosCode = await sys_ref_db.getSingle({
            //     REFNAME: 'hosCode'
            // });
            // _tradeSrc = await sys_ref_db.getSingle({
            //     REFNAME: 'tradeSrc'
            // });
            // _terminalNo = await sys_ref_db.getSingle({
            //     REFNAME: 'terminalNo'
            // });
            // _operNo = await sys_ref_db.getSingle({
            //     REFNAME: 'operNo'
            // });
            
            // let hosWelcomeMsg = await sys_ref_db.getSingle({
            //     REFNAME: 'hosWelcomeMsg'
            // });
        }
    }
    static async  getItem(list,refCode){
  
        let row = list.filter ((item)=>{
            return item.REFCODE ==refCode;
        })
        return row.REFNAME;
    }

}
module.exports = InitConfig;