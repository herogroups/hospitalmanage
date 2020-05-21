var fs = require('fs');
var archiver = require('archiver');

var output = fs.createWriteStream('archiver-unzip.zip');
var archive = archiver('zip');

archive.on('error', function(err){
    throw err;
});

archive.pipe(output);
archive.bulk([
    { src: ['archiver/**']}
]);
archive.finalize();
var fs = require("fs");
  var unzip = require("unzip");
  
  fs.createReadStream('archiver-unzip.zip').pipe(unzip.Extract({ path: 'unarchive' }));




  // 创建一个可写文件流，以便把压缩的数据导入
var output = fs.createWriteStream(zip_path);
//archiv对象，设置等级
var archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});
//管道连接
archive.pipe(output);
//压缩文件到压缩包
archive.file(DAT_path, { name: dat_name });
//压缩数据导压缩包
archive.append(rep.getRepFile(params),{name: rep_name});
//开始压缩
archive.finalize();
//监听压缩、传输数据过程中的错误回调
archive.on('error', function(err) {//压缩失败        
});
//监听压缩、传输数据结束
output.on('close', function() {//压缩完成
}) 

//判断压缩文件是否存在
if(!fs.existsSync(zip_path))  return;
//创建解压缩对象
let unzip_extract = unzip.Extract({path:taget_path});
//监听解压缩、传输数据过程中的错误回调
unzip_extract.on('error',(err)=>{
});
//监听解压缩、传输数据结束
unzip_extract.on('finish',()=>{
});
//创建可读文件流，传输数据
fs.createReadStream(zip_path).pipe(unzip_extract);