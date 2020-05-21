const crypto = require('crypto');
const crypt = require('../Libs/crypt')
const sys_user_db = require('../DbLib/SystemManage/Sys_User_DB');
class Sys_User_Bll {
    async queryUser(opCode, password) {

        let md5 = crypto.createHash('md5');
        let userpassword = md5.update(password).digest('hex');
        let result = await sys_user_db.GetByUserPassword( opCode, userpassword);
        
        if ((Array.isArray(result)) && result.length == 0) {
            throw new Error('查找的用户或密码不正确')
        }
            let row =result[0];
            
            let OperatorModel={};
            console.log('row',result)
            OperatorModel.UserId=row.OPID;
            OperatorModel.UserCode =row.ACCOUNT;
            OperatorModel.UserName =row.OPNAME;
            //OperatorModel.TenantName=row.TENANTNAME;
          
       
            OperatorModel.SHOPNAME=row.SHOPNAME;
            OperatorModel.SHOPID=row.SHOPID;
            OperatorModel.RoleId=row.ROLEID;            
            OperatorModel.LoginToken ="";
    
            OperatorModel.LoginTime=new Date().toLocaleString();
           let  cryptstr = JSON.stringify(OperatorModel);   
                  
            let value= Buffer.from(cryptstr).toString('base64');          
         
                // let info=ctx.cookies.get('loginuserkey');
                //  let newvalue=Buffer.from(info,'base64').toString();
                // console.log(newvalue)
               

            return value;
      
    }
}
// let OperatorModel={  
// UserId=0,
// UserCode ="",
// UserName ="",
// TenantName="",
 

// SHOPNAME="",
// SHOPID=0,
// RoleId=0,
// RoleType=0,
// LoginToken ="",
// HeadIcon="",
// LoginTime=""
// }
module.exports = new Sys_User_Bll