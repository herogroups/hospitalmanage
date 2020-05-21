const router = require('koa-router')()
const Posp_Bankcode=require('./Posp/Posp_Bankcode_Ctl')
 
const Posp_Paycode=require('./Posp/Posp_Paycode_Ctl')

const Posp_Channeltype=require('./Posp/Posp_Channeltype_Ctl')
const Posp_blackterminal=require('./Posp/posp_Blackterminal_Ctl')

 router.prefix('/Posp')
 //微信关联账号
router.get('/Posp_Bankcode/Index',Posp_Bankcode.index)
router.get('/Posp_Bankcode/AddIndex',Posp_Bankcode.addIndex)
router.get('/Posp_Bankcode/UpdateIndex',Posp_Bankcode.updateIndex)
router.post('/Posp_Bankcode/GetAllList',Posp_Bankcode.getAllList)
router.post('/Posp_Bankcode/Add',Posp_Bankcode.add)
router.post('/Posp_Bankcode/Update',Posp_Bankcode.update)
router.post('/Posp_Bankcode/Remove',Posp_Bankcode.remove)
router.post('/Posp_Bankcode/GetComb',Posp_Bankcode.getComb)
router.post('/Posp_Bankcode/updateClose',Posp_Bankcode.updateClose)



 



router.get('/Posp_Paycode/Index',Posp_Paycode.index)
router.get('/Posp_Paycode/AddIndex',Posp_Paycode.addIndex)
router.get('/Posp_Paycode/UpdateIndex',Posp_Paycode.updateIndex)
router.post('/Posp_Paycode/GetAllList',Posp_Paycode.getAllList)
router.post('/Posp_Paycode/Add',Posp_Paycode.add)
router.post('/Posp_Paycode/Update',Posp_Paycode.update)
router.post('/Posp_Paycode/Remove',Posp_Paycode.remove)
router.post('/Posp_Paycode/GetComb',Posp_Paycode.getComb)
router.post('/Posp_Paycode/updateClose',Posp_Paycode.updateClose)

router.get('/Posp_Channeltype/Index',Posp_Channeltype.index)
router.get('/Posp_Channeltype/AddIndex',Posp_Channeltype.addIndex)
router.get('/Posp_Channeltype/UpdateIndex',Posp_Channeltype.updateIndex)
router.post('/Posp_Channeltype/GetAllList',Posp_Channeltype.getAllList)
router.post('/Posp_Channeltype/Add',Posp_Channeltype.add)
router.post('/Posp_Channeltype/Update',Posp_Channeltype.update)
router.post('/Posp_Channeltype/Remove',Posp_Channeltype.remove)
router.post('/Posp_Channeltype/GetComb',Posp_Channeltype.getComb)
router.post('/Posp_Channeltype/updateClose',Posp_Channeltype.updateClose)

router.get('/Posp_blackterminal/Index',Posp_blackterminal.index)
router.get('/Posp_blackterminal/AddIndex',Posp_blackterminal.addIndex)
router.get('/Posp_blackterminal/UpdateIndex',Posp_blackterminal.updateIndex)
router.post('/Posp_blackterminal/GetAllList',Posp_blackterminal.getAllList)
router.post('/Posp_blackterminal/Add',Posp_blackterminal.add)
router.post('/Posp_blackterminal/Update',Posp_blackterminal.update)
router.post('/Posp_blackterminal/Remove',Posp_blackterminal.remove)
router.post('/Posp_blackterminal/GetComb',Posp_blackterminal.getComb)
router.post('/Posp_blackterminal/updateClose',Posp_blackterminal.updateClose)
  module.exports = router