const router = require('koa-router')()
const sys_module_db = require('../DbLib/SystemManage/Sys_Module_DB')
const net = require('net');


var client = null;



router.prefix('/Home')
router.get('/MainIndex', async (ctx, next) => {
 // createClient()
  let condi = "";
  let model = []
  let result = {};
  if (ctx.User.RoleId == 1)
    result = await sys_module_db.GetList(model, condi);
  else {
    const authdb = require('../DbLib/SystemManage/Sys_Roleauthorize_DB')
    condi = " RoleId=? and ";
    model = [ctx.User.RoleId]
    result = await authdb.GetList(model, condi);
  }
  let tree = getJsonTree(result, 0)
 
  await ctx.render('/Home/MainIndex', {
    layout: false,
    Model: tree,
    host:ctx.hostname
  })
})

router.get('/Index', async (ctx, next) => {

  // const db = require('../DbLib/HosDz/Tdz_Record_DB')
  // const dataUtil = require('../Libs/date-utils')

  // condi = " WorkDate>? and ";
  // model = [dataUtil.getAddDays(-30, 'yyyyMMdd')]
  // let result = await db.getList(model, condi);
  let result ={}
  await ctx.render('/Home/Index', {
    Model: result
  })
})
router.get('/HosDz', async (ctx, next) => {
 
  const db = require('../DbLib/HosDz/Tdz_Record_DB')
  const dataUtil = require('../Libs/date-utils')

  condi = " WorkDate>? and ";
  model = [dataUtil.getAddDays(-230, 'yyyyMMdd')]
  let result = await db.getList(model, condi);
  console.log(result)
  await ctx.render('/HosDz/Index', {
    Model: result
  })
})

router.get('/hosEcharts', async (ctx, next) => {
 
  
  let result = {};
 
  await ctx.render('/Finance/hosCharts/hosEchartsIndex', {
    layout: false,
    Model: result
  })
})
 
router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

function getJsonTree(data, parentId) {
  var itemArr = [];
  for (var i = 0; i < data.length; i++) {
    var node = data[i];
    if (node.PARENTID == parentId) {
      var newNode = {};
    
      newNode.id = node.MODULEID;
      newNode.text = node.MODULENAME;
      newNode.url = node.URLADDRESS;
      newNode.Target = node.TARGET
      newNode.icon = node.ICON;
      newNode.children = getJsonTree(data, node.MODULEID);
      itemArr.push(newNode);
    }
  }
  return itemArr;
};

function addListener(client) {
  client.on('connect', () => {
     console.log('isconnect');
      client.write(JSON.stringify({
          cmd: 'login',
          msg: 'hello server',
       
      }));
  });
  client.on('end', (chunk) => {
      console.log(`与服务器断开连接`,chunk);
    
  });
  client.on('data', (chunk) => {
    console.log(chunk,'chunk')
      //如果是心跳信息则回应keep命令
      if(chunk.toString()=='::'){
          client.write(JSON.stringify({
              cmd: 'keep',
              msg: '',
              nick: nick
          }));
          return ;
      }

  });
  client.on('error', (err) => {
      console.log(`an error has occured.\n\r${err}`);
  });
}
function createClient(){

  client = new net.Socket()
  client.connect({port:6000,host:'127.0.0.1'});
  addListener(client);
}
module.exports = router