var fs = require('fs');

var path = require('path');
var crypto = require('crypto');


function md5File(file) {

    let data = fs.readFileSync(file);
    let extname = path.extname(file);
    let stat = fs.statSync(file);
    var md5Value = crypto.createHash('md5').update(data, 'utf8').digest('hex');
    stat.md5 = md5Value;
    stat.extname = extname;
    return stat;

}
module.exports = md5File;