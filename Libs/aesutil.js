var crypto = require('crypto');

/**
 * 加密方法
 * @param key 加密key
 * @param iv       向量
 * @param data     需要加密的数据
 * @returns string
 */
// var encrypt = function (key,   data) {
//     data='{"attach":"","backup1":null,"backup2":null,"backup3":null,"backup4":null,"channel_id":null,"end_time":"20200318212218","goods_body":"芬达","goods_detail":"","install_times":"1","interface_version":"1.0.0.1","mer_hint":"特殊商品，支付后不退不换","mer_id":"240851030002","notify_type":"HS","notify_url":"http:\/\/www.lailai.club\/payResult","order_amount":"1","order_date":"20200318211718","out_trade_no":"P20200318211718","pay_limit":"no_credit","result_type":"0","return_url":"http:\/\/www.lailai.club\/payResult","spbill_create_ip":"172.22.3.1","tp_app_id":"wxd836ab5f29d424a0","tp_open_id":"oTMHuvoLOHo3uIZmV-A6_YUjRNWo","tran_type":"OnlinePay"}';
//     // iv = Buffer.from(iv,'hex'); 
//      let buf = Buffer.alloc(16, key, 'base64');  
//     let iv =  Buffer.alloc(32,0);
//     var cipher = crypto.createCipheriv('aes-128-cbc', buf, iv);
//     var crypted = cipher.update(data, 'utf8', 'binary'); 
//     crypted += cipher.final('binary'); 
//     crypted = new Buffer(crypted, 'binary').toString('base64');
//     console.log('===================');
//     console.log(crypted);
//     console.log('------------------------------------');
//     return crypted;
// };
var encrypt = function (key, data) {
   // data="{\"attach\":\"\",\"backup1\":\"\",\"backup2\":\"\",\"backup3\":\"\",\"backup4\":\"\",\"channel_id\":\"\",\"end_time\":\"20200319163919\",\"goods_body\":\"芬达\",\"goods_detail\":\"{}\",\"install_times\":\"1\",\"interface_version\":\"1.0.0.1\",\"mer_hint\":\"特殊商品，支付后不退不换\",\"mer_id\":\"240851030002\",\"notify_type\":\"HS\",\"notify_url\":\"www.lailai.club\\/wechartMsg\",\"order_amount\":\"1\",\"order_date\":\"20200319163419\",\"out_trade_no\":\"P20200319163419\",\"pay_limit\":\"no_credit\",\"result_type\":\"0\",\"return_url\":\"www.lailai.club\\/payResult\",\"spbill_create_ip\":\"172.22.3.1\",\"tp_app_id\":\"wxd836ab5f29d424a0\",\"tp_open_id\":\"oTMHuvoLOHo3uIZmV-A6_YUjRNWo\",\"tran_type\":\"OnlinePay\"}"
    let iv = Buffer.alloc(16, 0); 
    let buf = Buffer.alloc(16, key, 'base64'); 
    let ety = Buffer.from( data,'utf-8')
    console.log('ety=========',ety);
    let decipher = crypto.createCipheriv('aes-128-cbc', buf, iv);
    // decipher.setAutoPadding(true);
    let result = decipher.update(ety, 'utf8', 'base64') + decipher.final('base64');
    console.log('result =======================================',result);
    return result;
}
/**
 * 解密方法
 * @param key      解密的key
 * @param iv       向量
 * @param crypted  密文
 * @returns string
 */
var decrypt = function (key, iv, crypted) {
    crypted = new Buffer(crypted, 'base64').toString('binary');
    var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};
module.exports = {
    encrypt,
    decrypt
}