// 1 引入模块


const {
    pospLogger
} = require('../Libs/logger')
class clientSocket {
    constructor(config) {

        this.config = config

        // 3 链接
    }
    start(sendData) {
        return new Promise((resolve, reject) => {

            var net = require("net");
            var client = new net.Socket();
           // client.setEncoding('utf8');
            pospLogger.info(`开始连接到服务器${this.config.transIp}:${this.config.transPort}`);
            client.connect(this.config.transPort, this.config.transIp, function () {
                pospLogger.info(`连接成功`)
                client.write(sendData);
              //  pospLogger.info('已发送%d字节', client.bytesWritten);
               // pospLogger.info('[发送]', sendData.toString('utf8'));

            });
           
            var buffer = Buffer.from('', 'utf-8')
            client.on('data', function (data) {  
                       
                buffer = Buffer.concat([buffer, data]);
               
            })
            client.on('error', function (err) {
                pospLogger.info('与服务器连接或通信的过程中发生了一个错误，错误编码为%s', err.code);
                reject(err)
                client.destroy();
            })
            client.on('end', function () {
                try {
             
 
                   pospLogger.info(`[接收原始数据]${buffer.toString()} `);
                 
                    let bufTemp = buffer.subarray(6).toString()
                    let resp = JSON.parse(bufTemp);
                   
                    if (resp.respcode != '0000') {
                        reject(new Error(resp.respmsg))
                        return;
                    } else {
                        resolve(resp);
                    }
                } catch (error) {
                    reject(new Error(error.message))
                }

            })


        });
    }

}

module.exports = clientSocket