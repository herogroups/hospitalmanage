process.on('message', (m) => {

  sendMessage(JSON.stringify(m));
  console.log('收到湖景村打发');
  process.send("我也发一个")

});

function sendMessage(context) {

  wss.clients.forEach(function each(client) {
    client.send(context);
  });
}
//process.send({ foo:  'bar' });
const Koa = require('koa')
const app = new Koa()
var http = require('http');
var WebSocket = require('ws');
const sqlUtil = require('../Libs/sqlUtil')
var server = http.createServer(app);
var wss = new WebSocket.Server({
  server
});

wss.on('connection', function connection(ws) {
  console.log('链接成功！');



  // setInterval(()=>{
  //   wss.clients.forEach(function each(client) {
  //     client.send('999999999999');
  // });
  // }, 1000*10);

});

server.listen(12033, function listening() {
  console.log('服务器启动成功！');
});
let queryData = {



  /**
   * 获取数据列表
   *  {*} model 
   */
  async getList(model, condi) {

    let _sql = ` SELECT * from   tdz_filepushtype where  ${condi}  delMark=0 order by  PushTypeId desc `
    let result = await sqlUtil.query(_sql, model)

    return result;
  }
}