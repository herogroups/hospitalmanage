var express = require('express');
var http = require('http');
var WebSocket = require('ws');

var app = express();
app.use(express.static(__dirname));

var server = http.createServer(app);
var wss = new WebSocket.Server({server});
wss.on('connection', function connection(ws) {
    console.log('链接成功！');
    ws.on('message', function incoming(data) {
        /**
         * 把消息发送到所有的客户端
         * wss.clients获取所有链接的客户端
         */
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    });
});

server.listen(8000, function listening() {
    console.log('服务器启动成功！');
});
// <!doctype html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport"
//  content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
//     <meta http-equiv="X-UA-Compatible" content="ie=edge">
//     <title>在线聊天</title>
// </head>
// <body>
// <input type="text" onblur="wsServer.onopen(this.value)">
// <script>
//  var wsServer = new WebSocket('ws://127.0.0.1:8000');
//  wsServer.onopen = function (e) {
//      (typeof e == 'string') && wsServer.send(e);//向后台发送数据
//  };
//  wsServer.onclose = function (e) {//当链接关闭的时候触发

//  };
//  wsServer.onmessage = function (e) {//后台返回消息的时候触发
//         console.log(e);
//  };
//  wsServer.onerror = function (e) {//错误情况触发

//  }
// </script>
// </body>
// </html>