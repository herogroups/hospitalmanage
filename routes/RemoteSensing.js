const router = require('koa-router')()
const ClientTms = require('./Remote/ClientTms')
 
router.prefix('/RemoteSensing')
router.post('/Trans', ClientTms.Trans)
 

module.exports = router