var async = require('async');
const path = require('path')
const fs = require('fs')
const _config =require('../conf/config');
const {

    systemLogger
} = require('../Libs/logger');
systemLogger.error('err')
var schedule = require("node-schedule");
var rule3 = new schedule.RecurrenceRule();
var times3 = [10];
rule3.hour = times3;
rule3.minute = 0;
schedule.scheduleJob(rule3, function () {//每天10点推送对账文件
    createPack();
});

async function createPack() {
    try {
        let now = new Date();
        const ftpclient = require('../Libs/ftpClient')
    

        const WxPay = require('../wechat/wxPay')
        const util = require('../Libs/util')
        const dateUtils = require('../Libs/date-utils')

        let wxpay = new WxPay()
        // let sDate = '20190621'
        let sDate = dateUtils.getYestoday('yyyyMMdd')
        let month = dateUtils.getYestoday('yyyyMM');

        let filePath = path.join(__dirname, '../billData', month);
        try {
            fs.statSync(filePath)
        } catch {
            var mkdirp = require('mkdirp');
            mkdirp.sync(filePath)
        }
        let billData = await wxpay.downloadbill(sDate)
        try {
            let xml = await util.parseXMLAsync(billData)
            systemLogger.error(xml) //对账文件xml解析成功说明不是对账文件没有数据 
            return;
        } catch {

        }
        filePath = path.join(filePath, 'WX_' +_config.weichat.MCHID + '_' + sDate) + '.txt'
        util.writeFileAsync(filePath, billData)
        let ftpc = new ftpclient();
        ftpc.UploadFileToFTP(filePath, path.join('wxBill', month))
    } catch (err) {
        console.log('err=', err);
        systemLogger.error(err)
    }

}

// var path = require('path');
// var fs = require('fs');
// var Promise = require('bluebird');
// var Client = require('ftp');

// var c = new Client();

// var connectionProperties = {
//     host: "172.22.3.100",
//     port:21,
//     user: "keyl",
//     password: "`123qwer"
// };

// c.on('ready', function () {
//     console.log('ready');
//     c.put('d:/BugReport.txt', 'foo.remote-copy.txt', function(err) {
//         if (err) throw err;
//         c.end();
//       });
//     // c.list(function (err, list) {
//     //     if (err) throw err;
//     //     list.forEach(function (element, index, array) {
//     //         //Ignore directories
//     //         if (element.type === 'd') {
//     //             console.log('ignoring directory ' + element.name);
//     //             return;
//     //         }
//     //         //Ignore non zips
//     //         if (path.extname(element.name) !== '.zip') {
//     //             console.log('ignoring file ' + element.name);
//     //             return;
//     //         }
//     //         //Download files
//     //         c.get(element.name, function (err, stream) {
//     //             if (err) throw err;
//     //             stream.once('close', function () {
//     //                 c.end();
//     //             });
//     //             stream.pipe(fs.createWriteStream(element.name));
//     //         });
//     //     }); 
//     // });
// });

// c.connect(connectionProperties);