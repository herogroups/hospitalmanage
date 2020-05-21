const router = require('koa-router')()
const Banktransrecord_Ctl = require('./Finance/Banktransrecord_Ctl')
const ReturnFee_Ctl = require('./Finance/ReturnFee_Ctl')
const T_Bussrecord_Ctl = require('./Finance/T_Bussrecord_Ctl')
const T_Exceptionrecord_Ctl = require('./Finance/T_Exceptionrecord_Ctl')
 
router.prefix('/Finance')
router.get('/Banktransrecord/index', Banktransrecord_Ctl.index); 
router.post('/Banktransrecord/getAllList', Banktransrecord_Ctl.getAllList);
router.post('/Banktransrecord/getComb', Banktransrecord_Ctl.getComb);
router.get('/Banktransrecord/showSingle', Banktransrecord_Ctl.showSingle);
router.post('/Banktransrecord/getPayResultComb', Banktransrecord_Ctl.getPayResultComb);
router.post('/Banktransrecord/getBankCodeComb', Banktransrecord_Ctl.getBankCodeComb);

router.get('/ReturnFee/index', ReturnFee_Ctl.index); 
router.post('/ReturnFee/getAllList', ReturnFee_Ctl.getAllList);
router.get('/ReturnFee/UpdateIndex', ReturnFee_Ctl.UpdateIndex); 
router.post('/ReturnFee/BankTransQRTrans', ReturnFee_Ctl.BankTransQRTrans);

router.get('/T_Bussrecord/index', T_Bussrecord_Ctl.index); 
router.post('/T_Bussrecord/getAllList', T_Bussrecord_Ctl.getAllList);
router.get('/T_Bussrecord/showSingle', T_Bussrecord_Ctl.showSingle);
 
router.get('/T_Exceptionrecord/index', T_Exceptionrecord_Ctl.index); 
router.post('/T_Exceptionrecord/getAllList', T_Exceptionrecord_Ctl.getAllList);

module.exports = router