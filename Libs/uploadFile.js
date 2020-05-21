const fs = require('fs')
const path = require('path')
module.exports.upfile=function(file,upfilePath,orderName){
    console.log('file.path',file.path)
    const reader = fs.createReadStream(file.path); // 创建可读流 
    let fileExt ='';
    if (orderName==undefined ||orderName==''){
      fileExt = path.parse(file.path).name + path.parse(file.path).ext
    }else{
          fileExt = orderName  ;
    }
  
    const newFile = path.join(upfilePath, fileExt); 
    const upPath = path.dirname(newFile) + '\\';
 
    try {
      fs.statSync(upPath)

    } catch {
      var mkdirp = require('mkdirp');
      mkdirp.sync(upPath)
    //  fs.mkdirSync(upPath)
    } 
    const upStream = fs.createWriteStream(newFile); // 创建可写流 
    reader.pipe(upStream); // 可读流通过管道写入可写流 
    return newFile;
}