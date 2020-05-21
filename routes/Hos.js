const router = require('koa-router')()
const hos_dept=require('./Hos/hos_dept')
const hos_doctor=require('./Hos/hos_doctor')  
const Hos_Article_Subtype=require('./Hos/hos_Article_Subtype')
const Hos_Article_Type=require('./Hos/hos_Article_Type')
const Hos_Article=require('./Hos/Hos_Article')


 router.prefix('/Hos')
 //科室信息
router.get('/hos_dept/Index',hos_dept.Index)
router.get('/hos_dept/AddIndex',hos_dept.AddIndex)
router.get('/hos_dept/UpdateIndex',hos_dept.UpdateIndex)
router.post('/hos_dept/GetAllList',hos_dept.GetAllList)
router.post('/hos_dept/Add',hos_dept.Add)
router.post('/hos_dept/Update',hos_dept.Update)
router.post('/hos_dept/Remove',hos_dept.Remove)
router.post('/hos_dept/GetComb',hos_dept.GetComb)
router.post('/hos_dept/upload',hos_dept.upload)
//医生信息
router.get('/hos_doctor/Index',hos_doctor.Index)
router.get('/hos_doctor/AddIndex',hos_doctor.AddIndex)
router.get('/hos_doctor/UpdateIndex',hos_doctor.UpdateIndex)
router.post('/hos_doctor/GetAllList',hos_doctor.GetAllList)
router.post('/hos_doctor/Add',hos_doctor.Add)
router.post('/hos_doctor/Update',hos_doctor.Update)
router.post('/hos_doctor/Remove',hos_doctor.Remove)
router.post('/hos_doctor/GetComb',hos_doctor.GetComb)
router.post('/hos_doctor/upload',hos_doctor.upload)
 
router.get('/Hos_Article_Subtype/Index',Hos_Article_Subtype.Index)
router.get('/Hos_Article_Subtype/AddIndex',Hos_Article_Subtype.AddIndex)
router.get('/Hos_Article_Subtype/UpdateIndex',Hos_Article_Subtype.UpdateIndex)
router.post('/Hos_Article_Subtype/GetAllList',Hos_Article_Subtype.GetAllList)
router.post('/Hos_Article_Subtype/Add',Hos_Article_Subtype.Add)
router.post('/Hos_Article_Subtype/Update',Hos_Article_Subtype.Update)
router.post('/Hos_Article_Subtype/Remove',Hos_Article_Subtype.Remove)
 

router.get('/Hos_Article_Type/Index',Hos_Article_Type.Index)
router.get('/Hos_Article_Type/AddIndex',Hos_Article_Type.AddIndex)
router.get('/Hos_Article_Type/UpdateIndex',Hos_Article_Type.UpdateIndex)
router.post('/Hos_Article_Type/GetAllList',Hos_Article_Type.GetAllList)
router.post('/Hos_Article_Type/Add',Hos_Article_Type.Add)
router.post('/Hos_Article_Type/Update',Hos_Article_Type.Update)
router.post('/Hos_Article_Type/Remove',Hos_Article_Type.Remove)
router.post('/Hos_Article_Type/GetComb',Hos_Article_Type.GetComb)

 
 //医疗文章
router.get('/Hos_Article/Index',Hos_Article.Index)
router.get('/Hos_Article/AddIndex',Hos_Article.AddIndex)
router.get('/Hos_Article/UpdateIndex',Hos_Article.UpdateIndex)
router.post('/Hos_Article/GetAllList',Hos_Article.GetAllList)
router.post('/Hos_Article/Add',Hos_Article.Add)
router.post('/Hos_Article/Update',Hos_Article.Update)
router.post('/Hos_Article/Remove',Hos_Article.Remove)
router.post('/Hos_Article/upload',Hos_Article.upload)
router.post('/Hos_Article/uploadSingle',Hos_Article.uploadSingle)

router.get('/Hos_Article/SinglePage',Hos_Article.SinglePage)

  module.exports = router
 