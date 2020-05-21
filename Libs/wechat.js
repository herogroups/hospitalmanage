var koa2Req = require('koa2-request');
const baseUrl = "https://api.weixin.qq.com/";
const WxApi = {
    accessToken: baseUrl + "cgi-bin/token?grant_type=client_credential"
}
class WeChat {
    constructor(opts) {

        this.appId = opts.appId;
        this.appSecret = opts.appSecret;
        this.getAccessToken = opts.getAccessToken;
        this.saveAccessToken = opts.saveAccessToken;
        
        this.init(); //初始化
    }

    async init() {
        //获取access_token
        let data = await this.getAccessToken();
  
        //判断读取的内容是否存在、是否为空字符串，如果是的话进行更新
        if (data && data.length != 0) {
            data = JSON.parse(data);
            //判断是否合法
            if (!this.isValidAccessToken(data)) {
                data = await this.updateAccessToken();
            }else{
                data = await this.updateAccessToken();
            }
        } else {
            data = await this.updateAccessToken();
        }
        this.access_token = data.access_token;
        this.expires_in = data.expires_in;
        this.saveAccessToken(JSON.stringify(data));
    }

    isValidAccessToken(data) {
         
        if (!data || !data.access_token || !data.expires_in) {
            return false;
        }
        return new Date().getTime() < data.expires_in ? true : false;
    }

    updateAccessToken() {
        return new Promise(async (resolve, reject) => {
       
            var appId = this.appId;
            var appSecret = this.appSecret;
            var res = await koa2Req(WxApi.accessToken + "&appid=" + appId + "&secret=" + appSecret);
           
            var data = JSON.parse(res.body);
            data.expires_in = new Date().getTime() + (data.expires_in - 20) * 1000;
            resolve(data);
        });
    }
}
module.exports = WeChat;

// //全局配置参数 app.js部分代码
// const path=require('path');
// const util=require('./libs/util');
// const wechat_file=path.join(__dirname,'./config/wechat.txt');
// var config={
//     appId:'wx262288ac63b56167',
//     appSecret:'e302745d129d5f9520dfd6d2d2408b8f',
//     token:'mytestdemo',
//     getAccessToken:function(){
//         return util.readFileAsync(wechat_file,'utf-8');
//     },
//     saveAccessToken:function(data){
//         return util.writeFileAsync(wechat_file,data);
//     }
// }


// //util.js 存放在libs文件夹下
// var fs=require('fs');

// exports.readFileAsync=function(fpath,encodning){
//     return new Promise((resolve,reject)=>{
//         fs.readFile(fpath,encodning,(err,content)=>{
//             if(err){
//                 reject(err);
//             }
//             resolve(content);
//         });
//     });
// }

// exports.writeFileAsync=function(fpath,content){
//     return new Promise((resolve,reject)=>{
//         fs.writeFile(fpath,content,(err,content)=>{
//             if(err){
//                 reject(err);
//             }
//             resolve();
//         });
//     });
// }