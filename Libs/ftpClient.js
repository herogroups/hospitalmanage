 let fs = require("fs");
 let sftp = require('ftp');
 var Promise = require('bluebird');
 const _config =require('../conf/config');
 class ftpClient {
     constructor() {

         let connectionProperties = {
             host: _config.weibill.wxBillHost,
             port:_config.weibill.wxBillPort,
             user:_config.weibill.wxBillUser,
             password:_config.weibill.wxBillPassword,
         };
         this.connectionProperties = connectionProperties;
     }
     async UploadFileToFTP(sourcePath, tragetPath) {
         let that = this;
         let fileDirectory = sourcePath; //"D:/photo/test";
         if (fs.existsSync(fileDirectory)) {
             fs.readdir(fileDirectory, function (err, files) {
                 if (err) {
                     console.log(err);
                     return;
                 }
                 let count = files.length;
                 let results = {};
                 files.forEach(function (filename) {
                     fs.readFile(filename, function (data) {
                         results[filename] = data; 
                         console.log("success:" + filename); // 对所有文件进行处理   
                         let ftp = new sftp();
                         let filePath = tragetPath; //目标文件地址              

                         ftp.connect(that.connectionProperties);
                         ftp.on('ready', async function () {

                             for (let i = 0; i < files.length; i++) {
                                 var a = new Promise(function (resolve, reject) { //判断文件夹是否存在，不存在就创建文件夹 
                                     ftp.get(filePath, function (err) {
                                         console.log("filePath:" + filePath);
                                         if (err) {
                                             ftp.mkdir(`${tragetPath}`, false, function () {
                                                 let putFile = `${fileDirectory}` + "/" + `${filename}`;
                                                 let targetFile = `${tragetPath}` + "/" + `${filename}`;
                                                 console.log(targetFile, '-------------------------------------------', putFile);
                                                 ftp.put(putFile, targetFile, function (err) {
                                                     if (err) {
                                                         console.log("上传文件到服务器失败...");
                                                         reject(err);
                                                     }
                                                     console.log("上传文件到服务器成功...");
                                                     resolve(true);
                                                 });
                                             });
                                         }
                                     })
                                 })
                                 console.log(i + "-文件处理中...");
                                 let b = await a;
                                 console.log(b);
                             }
                             ftp.end();
                         }).on('error', async function (e) {
                             console.log(e);
                         });
                     });
                 });
             });
         } else {
             console.log(fileDirectory + "  Not Found!");
         }
     }
     async UploadBill(sourcePath, tragetPath) {
         let filename = sourcePath;


         let ftp = new sftp();
         let filePath = tragetPath; //目标文件地址              

         ftp.connect(that.connectionProperties);
         ftp.on('ready', async function () {

             for (let i = 0; i < files.length; i++) {
                 var a = new Promise(function (resolve, reject) { //判断文件夹是否存在，不存在就创建文件夹 
                     ftp.get(filePath, function (err) {
                         console.log("filePath:" + filePath);
                         if (err) {
                             ftp.mkdir(`${tragetPath}`, false, function () {
                                 let putFile = `${fileDirectory}` + "/" + `${filename}`;
                                 let targetFile = `${tragetPath}` + "/" + `${filename}`;
                                 console.log(targetFile, '-------------------------------------------', putFile);
                                 ftp.put(putFile, targetFile, function (err) {
                                     if (err) {
                                         console.log("上传文件到服务器失败...");
                                         reject(err);
                                     }
                                     console.log("上传文件到服务器成功...");
                                     resolve(true);
                                 });
                             });
                         }
                     })
                 })
                 console.log(i + "-文件处理中...");
                 let b = await a;
                 console.log(b);
             }
             ftp.end();
         }).on('error', async function (e) {
             console.log(e);
         });


     }
 }
 module.exports = ftpClient;