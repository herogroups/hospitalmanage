const router = require('koa-router')() 
 
const g = require('../wechat/g')
router.prefix('/wechartMsg')
router.get('/', g.Get);
 
router.post('/', g.Post);

module.exports = router