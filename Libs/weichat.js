//wechat.js主要代码
const baseUrl="https://api.weixin.qq.com/";
const WxApi={
    accessToken:baseUrl+"cgi-bin/token?grant_type=client_credential"
}
class WeChat{
    constructor(opts){
        this.appId=opts.appId;
        this.appSecret=opts.appSecret;
        this.getAccessToken=opts.getAccessToken;
        this.saveAccessToken=opts.saveAccessToken;
        this.init();//初始化
    }

    async init(){
        //获取access_token
        let data=await this.getAccessToken();
        //判断读取的内容是否存在、是否为空字符串，如果是的话进行更新
        if(data && data.length!=0){
            data=JSON.parse(data);
            //判断是否合法
            if(!this.isValidAccessToken(data)){
                data=await this.updateAccessToken();
            }
        }else{
            data=await this.updateAccessToken();
        }
        this.access_token=data.access_token;
        this.expires_in=data.expires_in;
        this.saveAccessToken(JSON.stringify(data));
    }

    isValidAccessToken(data){
        if(!data || !data.access_token || !data.expires_in){
            return false;
        }
        return new Date().getTime() < data.expires_in ?  true : false;
    }

    updateAccessToken(){
        return new Promise(async (resolve,reject)=>{
            var appId=this.appId;
            var appSecret=this.appSecret;
            var res = await koa2Req(WxApi.accessToken+"&appid="+appId+"&secret="+appSecret);
            var data=JSON.parse(res.body);
            data.expires_in=new Date().getTime() + (data.expires_in-20)*1000;
            resolve(data);    
        });
    }
}


//全局配置参数 app.js部分代码
const path=require('path');
const util=require('./libs/util');
const wechat_file=path.join(__dirname,'./config/wechat.txt');
var config={
    appId:'wx262288ac63b56167',
    appSecret:'e302745d129d5f9520dfd6d2d2408b8f',
    token:'mytestdemo',
    getAccessToken:function(){
        return util.readFileAsync(wechat_file,'utf-8');
    },
    saveAccessToken:function(data){
        return util.writeFileAsync(wechat_file,data);
    }
}


//util.js 存放在libs文件夹下
var fs=require('fs');

exports.readFileAsync=function(fpath,encodning){
    return new Promise((resolve,reject)=>{
        fs.readFile(fpath,encodning,(err,content)=>{
            if(err){
                reject(err);
            }
            resolve(content);
        });
    });
}

exports.writeFileAsync=function(fpath,content){
    return new Promise((resolve,reject)=>{
        fs.writeFile(fpath,content,(err,content)=>{
            if(err){
                reject(err);
            }
            resolve();
        });
    });
}


const sha1=require('sha1');
const getRawBody=require('raw-body');
const util=require('./util');
module.exports=function(opts){
    var wechat=new WeChat(opts);
    return async function(ctx){
        const signature=ctx.query.signature,
              timestamp=ctx.query.timestamp,
              nonce=ctx.query.nonce,
              token=opts.token;
        //字典排序
        const str=[token,timestamp,nonce].sort().join('');
        const result=sha1(str);
        if(result===signature){
            if(ctx.request.method==="GET"){
                ctx.body=ctx.query.echostr;
            }else if(ctx.request.method==="POST"){
                try{
                    var data=await getRawBody(ctx.req,{
                        length: ctx.request.length,
                        limit: "1mb",
                        encoding: ctx.request.charset
                    });
                    var content=await util.parseXMLAsync(data);
                    console.log(content);
                }catch(err){
                    console.log(err);
                }
            }
        }else{
            ctx.body={
                code:-1,
                msg:"fail"
            }
        }
    }   
}


//util.js部分代码
var xml2js=require('xml2js');
exports.parseXMLAsync=function(xml){
    return new Promise((resolve,reject)=>{
        xml2js.parseString(xml,{trim:true},function(err,content){
            if(err){
                reject(err);
            }
            resolve(content);
        });
    });
}


function formatMessage(result){
    var message={};
    if(typeof result ==='object'){
        var keys=Object.keys(result);
        for(let i=0;i<keys.length;i++){
            var item=result[keys[i]];
            var key=keys[i];
            if(!(item instanceof Array) || item.length===0){
                continue;
            }
            else if(item.length===1){
                var val=item[0];
                if(typeof val === 'object'){
                    messgae[key]=formatMessage(val);
                }else{
                    message[key]=(val || '').trim();
                }
            }
            else{
                message[key]=[];
                for(var j=0,k=item.length;j<k;j++){
                    message[key].push(formatMessage(item[j]));
                }
            }
        }
    }
    return message;
}

exports.formatMessage=formatMessage


if(result===signature){
    if(ctx.request.method==="GET"){
        ctx.body=ctx.query.echostr;
    }else if(ctx.request.method==="POST"){
        try{
            var data=await getRawBody(ctx.req,{
                length: ctx.request.length,
                limit: "1mb",
                encoding: ctx.request.charset
            });
            var content=await util.parseXMLAsync(data);
            var message=util.formatMessage(content.xml);
            if(message.MsgType==='event'){
                if(message.Event==='subscribe'){//关注
                    var now = Date.parse(new Date())/1000;
                    ctx.type='application/xml';
                    var reply=`<xml> 
                                <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                                <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                                <CreateTime>${now}</CreateTime>
                                <MsgType><![CDATA[text]]></MsgType>
                                <Content><![CDATA[终于等到你，还好我没放弃，欢迎关注lk儒家测试公众号！]]></Content>
                            </xml>`;
                    ctx.body=reply;
                }
            }
        }catch(err){
            console.log(err);
        }
    }
}else{
    ctx.body={
        code:-1,
        msg:"fail"
    }
}

const Koa=require('koa2');
const sha1=require('sha1');
const app=new Koa();

var config={
    appId:'wxxxxxxxxxxxxxx167',
    appSecret:'e30xxxxxxxxx5f9xxxxxx6dxxxxxxb8f',
    token:'mytestdemo'
}

app.use(async ctx=>{
    const signature=ctx.query.signature,
          timestamp=ctx.query.timestamp,
          nonce=ctx.query.nonce,
          token=config.token;
    //字典排序
    const str=[token,timestamp,nonce].sort().join('');
    const result=sha1(str);
    if(result===signature){
        ctx.body=ctx.query.echostr;
    }else{
        ctx.body={
            code:-1,
            msg:"fail"
        }
    }
});

app.listen(443);