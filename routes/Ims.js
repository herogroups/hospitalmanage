const router = require('koa-router')()
const Ims_account=require('./Ims/Ims_account_Ctl')
const Ims_bus_record=require('./Ims/Ims_bus_record_Ctl') 
const Ims_reply=require('./Ims/Ims_reply_Ctl')
const Ims_pay=require('./Ims/Ims_pay_Ctl')


 router.prefix('/Ims')
 //微信关联账号
router.get('/Ims_account/Index',Ims_account.index)
router.get('/Ims_account/AddIndex',Ims_account.addIndex)
router.get('/Ims_account/UpdateIndex',Ims_account.updateIndex)
router.post('/Ims_account/GetAllList',Ims_account.getAllList)
router.post('/Ims_account/Add',Ims_account.add)
router.post('/Ims_account/Update',Ims_account.update)
router.post('/Ims_account/Remove',Ims_account.remove)
router.post('/Ims_account/GetComb',Ims_account.getComb)
//业务记录
router.get('/Ims_bus_record/Index',Ims_bus_record.index)
router.get('/Ims_bus_record/AddIndex',Ims_bus_record.addIndex)
router.get('/Ims_bus_record/UpdateIndex',Ims_bus_record.updateIndex)
router.post('/Ims_bus_record/GetAllList',Ims_bus_record.getAllList)
router.post('/Ims_bus_record/Add',Ims_bus_record.add)
router.post('/Ims_bus_record/Update',Ims_bus_record.update)
router.post('/Ims_bus_record/Remove',Ims_bus_record.remove)
router.post('/Ims_bus_record/GetComb',Ims_bus_record.getComb)
 
 
//自动应答
router.get('/Ims_reply/Index',Ims_reply.index)
router.get('/Ims_reply/AddIndex',Ims_reply.addIndex)
router.get('/Ims_reply/UpdateIndex',Ims_reply.updateIndex)
router.post('/Ims_reply/GetAllList',Ims_reply.getAllList)
router.post('/Ims_reply/Add',Ims_reply.add)
router.post('/Ims_reply/Update',Ims_reply.update)
router.post('/Ims_reply/Remove',Ims_reply.remove)
router.post('/Ims_reply/GetComb',Ims_reply.getComb)
 //微信支付
router.get('/Ims_pay/Index',Ims_pay.index)
router.get('/Ims_pay/refund',Ims_pay.refund)
router.get('/Ims_pay/UpdateIndex',Ims_pay.updateIndex)
router.post('/Ims_pay/GetAllList',Ims_pay.getAllList)
 
router.post('/Ims_pay/Update',Ims_pay.update)
router.post('/Ims_pay/Remove',Ims_pay.remove)
router.post('/Ims_pay/GetComb',Ims_pay.getComb)
  module.exports = router