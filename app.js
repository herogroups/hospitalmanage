const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
var cors = require('koa2-cors');
const jwt =require("jsonwebtoken")
const cp = require('child_process');
const logger = require('koa-logger')
const omobj = require('./Libs/OperatorProvider.js')
const index = require('./routes/index')
const users = require('./routes/users')
const login = require('./routes/login')
const payResult = require('./routes/payResult')

const {
  accessLogger,
  systemLogger,
} = require('./Libs/logger');
const home = require('./routes/Home')
const upload = require('./routes/upload.js')
const RemoteSensing = require('./routes/RemoteSensing.js')
const systemManage = require('./routes/systemManage')
const download = require('./routes/Download')
const gzhApi = require('./routes/gzhApi')
const Hos = require('./routes/Hos')
const Ims = require('./routes/Ims')
const HosDz = require('./routes/HosDz')
const wechartMsg = require('./routes/wechartMsg')
const conf = require('./conf/config')
const Finance = require('./routes/Finance')
const IcbcApi = require('./routes/IcbcApi')
const AliLiftCodeMsg = require('./routes/AliLiftCodeMsg')

const Posp = require('./routes/Posp')
// error handler
onerror(app)
//创建一个子进程该子进程用于操作socket服务
const worker = cp.fork(`${__dirname}/socket/websocket.js`);
worker.on('message', (m) => {
  console.log('PARENT got message:', m);
});
const worker_chart = cp.fork(`${__dirname}/socket/worker_chart.js`);
worker.on('message', (m) => {
  console.log('PARENT got message:', m);
});
//创建一个子进程用户Ftp上传对账文件
const Ftpworker = cp.fork(`${__dirname}/service/uploadBill.js`);
Ftpworker.on('message', (m) => {
  console.log('PARENT got message:', m);
});

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 20000 * 1024 * 1024, // 设置上传文件大小最大限制，默认200M
    uploadDir: 'public/upload', // 上传的文件存储的路径 
    keepExtensions: true, //  保存图片的扩展名
    // onFileBegin:(name,file) => { // 文件上传前的设置
    //   console.log(`name: ${name}`);
    //   console.log(file);
    // },
  }

}));
//允许跨域
app.use(cors());
app.use(json())
app.use(accessLogger())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(__dirname + '/static'))
const render = require('koa-ejs');
const path = require('path');


app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))
//初始化ejs，设置后缀为html，文件目录为`views`
render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: false
});
app.use(koaStatic(path.resolve('dist'))); // 将 webpack 打包好的项目目录作为 Koa 静态文件服务的目录
app.use(async (ctx, next) => {

  ctx.log = systemLogger; //  require('./Libs/log')
  ctx.socketWork = worker;
  global.conf = conf;

  ctx.conf = conf;
  if (ctx.url.indexOf('SystemManage') == 1 || ctx.url.indexOf('Finance') == 1 || ctx.url.indexOf('Hos') == 1 
           || ctx.url.indexOf('Posp') == 1 || ctx.url.indexOf('Ims') == 1   || ctx.url.indexOf('MainIndex') >0   ) {
    ctx.User = omobj(ctx)
    const token=  jwt.sign(ctx.User,"",{expiresIn:3600})
 
    if (!ctx.User) {    
      ctx.redirect('/')
      return ;
    }


  }

  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(download.routes(), download.allowedMethods())
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(login.routes(), login.allowedMethods())
app.use(home.routes(), home.allowedMethods())
app.use(systemManage.routes(), systemManage.allowedMethods())
app.use(upload.routes(), upload.allowedMethods())
app.use(RemoteSensing.routes(), RemoteSensing.allowedMethods())
app.use(gzhApi.routes(), gzhApi.allowedMethods())
app.use(Ims.routes(), Ims.allowedMethods())
app.use(Hos.routes(), Hos.allowedMethods())
app.use(HosDz.routes(), HosDz.allowedMethods())
app.use(payResult.routes(), payResult.allowedMethods())
app.use(Finance.routes(), Finance.allowedMethods())
app.use(wechartMsg.routes(), wechartMsg.allowedMethods())
app.use(IcbcApi.routes(), IcbcApi.allowedMethods())
app.use(Posp.routes(), Posp.allowedMethods())
app.use(AliLiftCodeMsg.routes(),AliLiftCodeMsg.allowedMethods());
app.on('error', (err, ctx) => {
  systemLogger.error(err);
  console.error('server error', err, ctx)
});

module.exports = app