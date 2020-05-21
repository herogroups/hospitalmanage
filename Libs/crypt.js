/***
 * @author keyonglin
 * @date 2019-03-07
 */

var crypto = require('crypto');
var key = '12345670';
 module.exports = {

    algorithm:{  ecb:'des-ecb',cbc:'des-cbc'  },
    encrypt:function(plaintext,iv){
        var key =  Buffer.from(key);
        var iv =  Buffer.from(iv ? iv : 0);
        var cipher = crypto.createCipheriv(this.algorithm.cbc, key, iv);
        cipher.setAutoPadding(true)  //default true
        var ciph = cipher.update(plaintext, 'utf8', 'base64');
        ciph += cipher.final('base64');
        return ciph;
    },
    decrypt:function(encrypt_text,iv){
        var key =   Buffer.from(key);
        var iv =   Buffer.from(iv ? iv : 0);
        var decipher = crypto.createDecipheriv(this.algorithm.cbc, key, iv);
        decipher.setAutoPadding(true);
        var txt = decipher.update(encrypt_text, 'base64', 'utf8');
        txt += decipher.final('utf8');
        return txt;
    }

};