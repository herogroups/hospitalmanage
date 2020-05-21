const router = require('koa-router')()
const Tdz_Detail_Ctl = require('./HosDz/Tdz_Detail_Ctl')
const Tdz_Filepulltype_Ctl = require('./HosDz/Tdz_Filepulltype_Ctl')
const Tdz_Filepushtype_Ctl = require('./HosDz/Tdz_Filepushtype_Ctl')
const Tdz_Ioparam_Ctl = require('./HosDz/Tdz_Ioparam_Ctl')
const Tdz_Merchant_Ctl = require('./HosDz/Tdz_Merchant_Ctl')
const Tdz_Merchanttype_Ctl = require('./HosDz/Tdz_Merchanttype_Ctl')
const Tdz_Merchatpaytype_Ctl = require('./HosDz/Tdz_Merchatpaytype_Ctl')
const Tdz_Record_Ctl = require('./HosDz/Tdz_Record_Ctl')
const Tdz_Tasklist_Ctl = require('./HosDz/Tdz_Tasklist_Ctl')
const Tdz_Taskpool_Ctl = require('./HosDz/Tdz_Taskpool_Ctl')
const Tdz_Tasktype_Ctl = require('./HosDz/Tdz_Tasktype_Ctl')
const Tdz_Transtype_Ctl = require('./HosDz/Tdz_Transtype_Ctl')
router.prefix('/HosDz')
router.get('/Tdz_Detail/index', Tdz_Detail_Ctl.index);
router.get('/Tdz_Detail/addIndex', Tdz_Detail_Ctl.addIndex);
router.get('/Tdz_Detail/ShowSingle', Tdz_Detail_Ctl.ShowSingle);
router.post('/Tdz_Detail/getAllList', Tdz_Detail_Ctl.getAllList);
router.post('/Tdz_Detail/add', Tdz_Detail_Ctl.add);
router.post('/Tdz_Detail/update', Tdz_Detail_Ctl.update);
router.post('/Tdz_Detail/remove', Tdz_Detail_Ctl.remove);
router.post('/Tdz_Detail/getComb', Tdz_Detail_Ctl.getComb);
router.get('/Tdz_Detail/curDetail', Tdz_Detail_Ctl.curDetail);

router.get('/Tdz_Filepulltype/index', Tdz_Filepulltype_Ctl.index);
router.get('/Tdz_Filepulltype/addIndex', Tdz_Filepulltype_Ctl.addIndex);
router.get('/Tdz_Filepulltype/updateIndex', Tdz_Filepulltype_Ctl.updateIndex);
router.post('/Tdz_Filepulltype/getAllList', Tdz_Filepulltype_Ctl.getAllList);
router.post('/Tdz_Filepulltype/add', Tdz_Filepulltype_Ctl.add);
router.post('/Tdz_Filepulltype/update', Tdz_Filepulltype_Ctl.update);
router.post('/Tdz_Filepulltype/remove', Tdz_Filepulltype_Ctl.remove);
router.post('/Tdz_Filepulltype/getComb', Tdz_Filepulltype_Ctl.getComb);

router.get('/Tdz_Filepushtype/index', Tdz_Filepushtype_Ctl.index);
router.get('/Tdz_Filepushtype/addIndex', Tdz_Filepushtype_Ctl.addIndex);
router.get('/Tdz_Filepushtype/updateIndex', Tdz_Filepushtype_Ctl.updateIndex);
router.post('/Tdz_Filepushtype/getAllList', Tdz_Filepushtype_Ctl.getAllList);
router.post('/Tdz_Filepushtype/add', Tdz_Filepushtype_Ctl.add);
router.post('/Tdz_Filepushtype/update', Tdz_Filepushtype_Ctl.update);
router.post('/Tdz_Filepushtype/remove', Tdz_Filepushtype_Ctl.remove);
router.post('/Tdz_Filepushtype/getComb', Tdz_Filepushtype_Ctl.getComb);

router.get('/Tdz_Ioparam/index', Tdz_Ioparam_Ctl.index);
router.get('/Tdz_Ioparam/addIndex', Tdz_Ioparam_Ctl.addIndex);
router.get('/Tdz_Ioparam/updateIndex', Tdz_Ioparam_Ctl.updateIndex);
router.post('/Tdz_Ioparam/getAllList', Tdz_Ioparam_Ctl.getAllList);
router.post('/Tdz_Ioparam/add', Tdz_Ioparam_Ctl.add);
router.post('/Tdz_Ioparam/update', Tdz_Ioparam_Ctl.update);
router.post('/Tdz_Ioparam/remove', Tdz_Ioparam_Ctl.remove);
router.post('/Tdz_Ioparam/getComb', Tdz_Ioparam_Ctl.getComb);

router.get('/Tdz_Merchant/index', Tdz_Merchant_Ctl.index);
router.get('/Tdz_Merchant/addIndex', Tdz_Merchant_Ctl.addIndex);
router.get('/Tdz_Merchant/updateIndex', Tdz_Merchant_Ctl.updateIndex);
router.post('/Tdz_Merchant/getAllList', Tdz_Merchant_Ctl.getAllList);
router.post('/Tdz_Merchant/add', Tdz_Merchant_Ctl.add);
router.post('/Tdz_Merchant/update', Tdz_Merchant_Ctl.update);
router.post('/Tdz_Merchant/remove', Tdz_Merchant_Ctl.remove);
router.post('/Tdz_Merchant/getComb', Tdz_Merchant_Ctl.getComb);

router.get('/Tdz_Merchanttype/index', Tdz_Merchanttype_Ctl.index);
router.get('/Tdz_Merchanttype/addIndex', Tdz_Merchanttype_Ctl.addIndex);
router.get('/Tdz_Merchanttype/updateIndex', Tdz_Merchanttype_Ctl.updateIndex);
router.post('/Tdz_Merchanttype/getAllList', Tdz_Merchanttype_Ctl.getAllList);
router.post('/Tdz_Merchanttype/add', Tdz_Merchanttype_Ctl.add);
router.post('/Tdz_Merchanttype/update', Tdz_Merchanttype_Ctl.update);
router.post('/Tdz_Merchanttype/remove', Tdz_Merchanttype_Ctl.remove);
router.post('/Tdz_Merchanttype/getComb', Tdz_Merchanttype_Ctl.getComb);

router.get('/Tdz_Merchatpaytype/index', Tdz_Merchatpaytype_Ctl.index);
router.get('/Tdz_Merchatpaytype/addIndex', Tdz_Merchatpaytype_Ctl.addIndex);
router.get('/Tdz_Merchatpaytype/updateIndex', Tdz_Merchatpaytype_Ctl.updateIndex);
router.post('/Tdz_Merchatpaytype/getAllList', Tdz_Merchatpaytype_Ctl.getAllList);
router.post('/Tdz_Merchatpaytype/add', Tdz_Merchatpaytype_Ctl.add);
router.post('/Tdz_Merchatpaytype/update', Tdz_Merchatpaytype_Ctl.update);
router.post('/Tdz_Merchatpaytype/remove', Tdz_Merchatpaytype_Ctl.remove);
router.post('/Tdz_Merchatpaytype/getComb', Tdz_Merchatpaytype_Ctl.getComb);

router.get('/Tdz_Record/index', Tdz_Record_Ctl.index);
router.get('/Tdz_Record/addIndex', Tdz_Record_Ctl.addIndex);
router.get('/Tdz_Record/updateIndex', Tdz_Record_Ctl.updateIndex);
router.post('/Tdz_Record/getAllList', Tdz_Record_Ctl.getAllList);
router.post('/Tdz_Record/add', Tdz_Record_Ctl.add);
router.post('/Tdz_Record/update', Tdz_Record_Ctl.update);
router.post('/Tdz_Record/remove', Tdz_Record_Ctl.remove);
router.post('/Tdz_Record/getComb', Tdz_Record_Ctl.getComb);

router.get('/Tdz_Tasklist/index', Tdz_Tasklist_Ctl.index);
router.get('/Tdz_Tasklist/addIndex', Tdz_Tasklist_Ctl.addIndex);
router.get('/Tdz_Tasklist/updateIndex', Tdz_Tasklist_Ctl.updateIndex);
router.post('/Tdz_Tasklist/getAllList', Tdz_Tasklist_Ctl.getAllList);
router.post('/Tdz_Tasklist/add', Tdz_Tasklist_Ctl.add);
router.post('/Tdz_Tasklist/update', Tdz_Tasklist_Ctl.update);
router.post('/Tdz_Tasklist/remove', Tdz_Tasklist_Ctl.remove);
router.post('/Tdz_Tasklist/getComb', Tdz_Tasklist_Ctl.getComb);

router.get('/Tdz_Taskpool/index', Tdz_Taskpool_Ctl.index);
router.get('/Tdz_Taskpool/addIndex', Tdz_Taskpool_Ctl.addIndex);
router.get('/Tdz_Taskpool/updateIndex', Tdz_Taskpool_Ctl.updateIndex);
router.post('/Tdz_Taskpool/getAllList', Tdz_Taskpool_Ctl.getAllList);
router.post('/Tdz_Taskpool/add', Tdz_Taskpool_Ctl.add);
router.post('/Tdz_Taskpool/update', Tdz_Taskpool_Ctl.update);
router.post('/Tdz_Taskpool/remove', Tdz_Taskpool_Ctl.remove);
router.post('/Tdz_Taskpool/reCheck', Tdz_Taskpool_Ctl.reCheck);
 


router.get('/Tdz_Tasktype/index', Tdz_Tasktype_Ctl.index);
router.get('/Tdz_Tasktype/addIndex', Tdz_Tasktype_Ctl.addIndex);
router.get('/Tdz_Tasktype/updateIndex', Tdz_Tasktype_Ctl.updateIndex);
router.post('/Tdz_Tasktype/getAllList', Tdz_Tasktype_Ctl.getAllList);
router.post('/Tdz_Tasktype/add', Tdz_Tasktype_Ctl.add);
router.post('/Tdz_Tasktype/update', Tdz_Tasktype_Ctl.update);
router.post('/Tdz_Tasktype/remove', Tdz_Tasktype_Ctl.remove);
router.post('/Tdz_Tasktype/getComb', Tdz_Tasktype_Ctl.getComb);

router.get('/Tdz_Transtype/index', Tdz_Transtype_Ctl.index);
router.get('/Tdz_Transtype/addIndex', Tdz_Transtype_Ctl.addIndex);
router.get('/Tdz_Transtype/updateIndex', Tdz_Transtype_Ctl.updateIndex);
router.post('/Tdz_Transtype/getAllList', Tdz_Transtype_Ctl.getAllList);
router.post('/Tdz_Transtype/add', Tdz_Transtype_Ctl.add);
router.post('/Tdz_Transtype/update', Tdz_Transtype_Ctl.update);
router.post('/Tdz_Transtype/remove', Tdz_Transtype_Ctl.remove);
router.post('/Tdz_Transtype/getComb', Tdz_Transtype_Ctl.getComb);


module.exports = router