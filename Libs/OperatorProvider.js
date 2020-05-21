module.exports =(ctx)=>{
    let info=ctx.cookies.get('loginuserkey');
    if (info!=null)
    {
    let result=Buffer.from(info,'base64').toString();
    let value = JSON.parse(result)
     return value;
    }else{return null}
 
}