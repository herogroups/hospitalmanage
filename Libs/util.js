var fs = require('fs');

exports.readFileAsync = function (fpath, encodning) {
    return new Promise((resolve, reject) => {
        fs.readFile(fpath, encodning, (err, content) => {
            if (err) {
                reject(err);
            }
            resolve(content);
        });
    });
}

exports.writeFileAsync = function (fpath, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fpath, content, (err, content) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}


// exports.parseXMLAsync = function (xml) {
//     return new Promise((resolve, reject) => {
//         var xml2js = require('xml2js');
//         //  var json = xml2js.toJson(xml,);
//         xml2js.parseString(xml, {
//             trim: true
//         }, function (err, content) {
//             if (err) {
//                 reject(err);
//             }
//             return resolve(content);
//         });
//     });
// }
exports.parseXMLAsync = function (xmlstr) {
    return new Promise((resolve, reject) => {
        var parseString = require('xml2js').parseString;
        parseString(xmlstr, {explicitArray : false},function (err, result) {

         
            if (err)
                reject(err);
            resolve(result);
        });
    });
}

exports.parseJson2XML = function (obj) {
    var xml2js = require('xml2js');
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    return xml;
}


function formatMessage(result) {
    var message = {};
    if (typeof result === 'object') {
        var keys = Object.keys(result);
        for (let i = 0; i < keys.length; i++) {
            var item = result[keys[i]];
            var key = keys[i];
            if (!(item instanceof Array) || item.length === 0) {
                continue;
            } else if (item.length === 1) {
                var val = item[0];
                if (typeof val === 'object') {
                    messgae[key] = formatMessage(val);
                } else {
                    message[key] = (val || '').trim();
                }
            } else {
                message[key] = [];
                for (var j = 0, k = item.length; j < k; j++) {
                    message[key].push(formatMessage(item[j]));
                }
            }
        }
    }
    return message;
}

exports.formatMessage = formatMessage
/**************************************时间格式化处理************************************/
exports.dateFtt = function dateFtt(fmt, date) { //author: meizz   
    var o = {
        "M+": date.getMonth() + 1, //月份   
        "d+": date.getDate(), //日   
        "h+": date.getHours(), //小时   
        "m+": date.getMinutes(), //分   
        "s+": date.getSeconds(), //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

exports.padLeft = function padLeft(num, length, char) {
    return (Array(length).join(char) + num).slice(-length);
}
//解析身份证信息
exports.IdCard=function(UUserCard, num) {
    if (num == 1) {
        //获取出生日期
        birth = UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
        return birth;
    }
    if (num == 2) {
        //获取性别
        if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
            //男
            return "1";//"男";
        } else {
            //女
            return "2"  //"女";
        }
    }
    if (num == 3) {
        //获取年龄
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
        return age;
    }
}
/* 部分隐藏处理
** str 需要处理的字符串
** frontLen  保留的前几位
** endLen  保留的后几位
** cha  替换的字符串
*/
exports.plusXing=function(str, frontLen, endLen,cha) {
    var len = str.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
        xing += cha;
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
}; 
exports.isNull=function(str) {
    return str == undefined || str == null || str.length === 0 || str === '';
}  
exports.listIsExist=function(List,obj,objName){
    console.log('List,obj,objName===========', JSON.stringify(List) ,obj,objName);
    let ret = false;
    if (Array.isArray(List) && List.length > 0) {
        let findRet = List.find((item, index) => {
          return item[objName] == obj;
        }); 
        if (!myUtils.isNull(findRet)) { 
            ret=true ;
        }
      }
      console.log('ret ===',ret);
      return ret ;
}