const router = require('koa-router')()
const sys_cmd=require('./SystemManage/sys_cmd')
const sys_func=require('./SystemManage/sys_func')
 

const sys_log=require('./SystemManage/sys_log')
const sys_module=require('./SystemManage/sys_module')
const sys_msg=require('./SystemManage/sys_msg')
const sys_ref=require('./SystemManage/sys_ref')
const sys_role=require('./SystemManage/sys_role')
const sys_roleauthorize=require('./SystemManage/sys_roleauthorize')
const sys_shop=require('./SystemManage/sys_shop')
const sys_soft=require('./SystemManage/sys_soft')


const sys_terminal=require('./SystemManage/sys_terminal')
const sys_terminaldevicelog=require('./SystemManage/sys_terminaldevicelog')
const sys_terminalmode=require('./SystemManage/sys_terminalmode')
const sys_upfile=require('./SystemManage/sys_upfile')
const sys_upload=require('./SystemManage/sys_upload')
const sys_user=require('./SystemManage/sys_user')



 router.prefix('/SystemManage')
 
router.get('/sys_cmd/Index',sys_cmd.Index)
router.get('/sys_cmd/AddIndex',sys_cmd.AddIndex)
router.get('/sys_cmd/UpdateIndex',sys_cmd.UpdateIndex)
router.post('/sys_cmd/GetAllList',sys_cmd.GetAllList)
router.post('/sys_cmd/Add',sys_cmd.Add)
router.post('/sys_cmd/Update',sys_cmd.Update)
router.post('/sys_cmd/Remove',sys_cmd.Remove)
router.post('/sys_cmd/GetComb',sys_cmd.GetComb)

router.get('/sys_func/Index',sys_func.Index)
router.get('/sys_func/AddIndex',sys_func.AddIndex)
router.get('/sys_func/UpdateIndex',sys_func.UpdateIndex)
router.post('/sys_func/GetAllList',sys_func.GetAllList)
router.post('/sys_func/Add',sys_func.Add)
router.post('/sys_func/Update',sys_func.Update)
router.post('/sys_func/Remove',sys_func.Remove)
router.post('/sys_func/GetComb',sys_func.GetComb)

//终端指令管理
// ruter.get('/sys_cmd/Index',sys_cmd.Index)
// router.get('/sys_cmd/AddIndex',sys_cmd.AddIndex)
// router.get('/sys_cmd/UpdateIndex',sys_cmd.UpdateIndex)
// router.post('/sys_cmd/GetAllList',sys_cmd.GetAllList)
// router.post('/sys_cmd/Add',sys_cmd.Add)
// router.post('/sys_cmd/Update',sys_cmd.Update)
// router.post('/sys_cmd/Remove',sys_cmd.Remove)
 router.post('/sys_cmd/GetComb',sys_cmd.GetComb)

//系统日志
router.get('/sys_log/Index',sys_log.Index)
router.get('/sys_log/AddIndex',sys_log.AddIndex)
router.get('/sys_log/UpdateIndex',sys_log.UpdateIndex)
router.post('/sys_log/GetAllList',sys_log.GetAllList)
router.post('/sys_log/Add',sys_log.Add)
router.post('/sys_log/Update',sys_log.Update)
router.post('/sys_log/Remove',sys_log.Remove)
router.post('/sys_log/GetComb',sys_log.GetComb)
router.post('/sys_log/ExportLog',sys_log.ExportLog)
//系统菜单   
router.get('/sys_module/Index',sys_module.Index)
router.get('/sys_module/AddIndex',sys_module.AddIndex)
router.get('/sys_module/UpdateIndex',sys_module.UpdateIndex)
router.post('/sys_module/GetAllList',sys_module.GetAllList)
router.post('/sys_module/Add',sys_module.Add)
router.post('/sys_module/Update',sys_module.Update)
router.post('/sys_module/Remove',sys_module.Remove)
router.post('/sys_module/GetComb',sys_module.GetComb)
router.post('/sys_module/GetCodeByParentId',sys_module.GetCodeByParentId)

 
//系统消息
router.get('/sys_msg/Index',sys_msg.Index)
router.get('/sys_msg/AddIndex',sys_msg.AddIndex)
router.get('/sys_msg/UpdateIndex',sys_msg.UpdateIndex)
router.post('/sys_msg/GetAllList',sys_msg.GetAllList)
router.post('/sys_msg/Add',sys_msg.Add)
router.post('/sys_msg/Update',sys_msg.Update)
router.post('/sys_msg/Remove',sys_msg.Remove)
router.post('/sys_msg/GetComb',sys_msg.GetComb)
//系统参数设置  
router.get('/sys_ref/Index',sys_ref.Index)
router.get('/sys_ref/AddIndex',sys_ref.AddIndex)
router.get('/sys_ref/UpdateIndex',sys_ref.UpdateIndex)
router.post('/sys_ref/GetAllList',sys_ref.GetAllList)
router.post('/sys_ref/Add',sys_ref.Add)
router.post('/sys_ref/Update',sys_ref.Update)
router.post('/sys_ref/Remove',sys_ref.Remove)
router.post('/sys_ref/GetComb',sys_ref.GetComb)
//角色   
router.get('/sys_role/Index',sys_role.Index)
router.get('/sys_role/AddIndex',sys_role.AddIndex)
router.get('/sys_role/UpdateIndex',sys_role.UpdateIndex)
router.post('/sys_role/GetAllList',sys_role.GetAllList)
router.post('/sys_role/Add',sys_role.Add)
router.post('/sys_role/Update',sys_role.Update)
router.post('/sys_role/Remove',sys_role.Remove)
router.post('/sys_role/GetComb',sys_role.GetComb)
router.post('/sys_role/GetRoleRights',sys_role.GetRoleRights)

//角色授权 
router.get('/sys_roleauthorize/Index',sys_roleauthorize.Index)
router.get('/sys_roleauthorize/AddIndex',sys_roleauthorize.AddIndex)
router.get('/sys_roleauthorize/UpdateIndex',sys_roleauthorize.UpdateIndex)
router.post('/sys_roleauthorize/GetAllList',sys_roleauthorize.GetAllList)
router.post('/sys_roleauthorize/Add',sys_roleauthorize.Add)
router.post('/sys_roleauthorize/Update',sys_roleauthorize.Update)
router.post('/sys_roleauthorize/Remove',sys_roleauthorize.Remove)
router.get('/sys_roleauthorize/GetCurrentUserAllModel',sys_roleauthorize.GetCurrentUserAllModel)

 
//部门管理
router.get('/sys_shop/Index',sys_shop.Index)
router.get('/sys_shop/AddIndex',sys_shop.AddIndex)
router.get('/sys_shop/UpdateIndex',sys_shop.UpdateIndex)
router.post('/sys_shop/GetAllList',sys_shop.GetAllList)
 
router.post('/sys_shop/Add',sys_shop.Add)
router.post('/sys_shop/Update',sys_shop.Update)
router.post('/sys_shop/Remove',sys_shop.Remove)
router.post('/sys_shop/GetComb',sys_shop.GetComb)
//终端应用软件 
router.get('/sys_soft/Index',sys_soft.Index)
router.get('/sys_soft/AddIndex',sys_soft.AddIndex)
router.get('/sys_soft/UpdateIndex',sys_soft.UpdateIndex)
router.post('/sys_soft/GetAllList',sys_soft.GetAllList)
router.post('/sys_soft/Add',sys_soft.Add)
router.post('/sys_soft/Update',sys_soft.Update)
router.post('/sys_soft/Remove',sys_soft.Remove)
router.post('/sys_soft/GetComb',sys_soft.GetComb)
router.get('/sys_soft/PicIndex',sys_soft.PicIndex)

 


//终端设备表 
router.get('/sys_terminal/Index',sys_terminal.Index)
router.get('/sys_terminal/AddIndex',sys_terminal.AddIndex)
 
router.get('/sys_terminal/TerminalSendCmdForm',sys_terminal.TerminalSendCmdForm)

 
router.get('/sys_terminal/DeviceState',sys_terminal.DeviceState)
router.get('/sys_terminal/UpdateIndex',sys_terminal.UpdateIndex)
router.post('/sys_terminal/GetAllList',sys_terminal.GetAllList)
router.post('/sys_terminal/Add',sys_terminal.Add)
router.post('/sys_terminal/Update',sys_terminal.Update)
router.post('/sys_terminal/Remove',sys_terminal.Remove)
router.post('/sys_terminal/GetComb',sys_terminal.GetComb)
router.post('/sys_terminal/GetBankTerminalComb',sys_terminal.GetBankTerminalComb)

router.post('/sys_terminal/ModifyTerminalSendCmd',sys_terminal.ModifyTerminalSendCmd)
router.post('/sys_terminal/GetTerminalDeviceState',sys_terminal.GetTerminalDeviceState)
router.post('/sys_terminal/GetTerminalDeviceLog',sys_terminal.GetTerminalDeviceLog)
 
//终端设备硬件状态 
router.get('/sys_terminaldevicelog/Index',sys_terminaldevicelog.Index)
router.get('/sys_terminaldevicelog/AddIndex',sys_terminaldevicelog.AddIndex)
router.get('/sys_terminaldevicelog/UpdateIndex',sys_terminaldevicelog.UpdateIndex)
router.post('/sys_terminaldevicelog/GetAllList',sys_terminaldevicelog.GetAllList)
router.post('/sys_terminaldevicelog/Add',sys_terminaldevicelog.Add)
router.post('/sys_terminaldevicelog/Update',sys_terminaldevicelog.Update)
router.post('/sys_terminaldevicelog/Remove',sys_terminaldevicelog.Remove)
router.post('/sys_terminaldevicelog/GetComb',sys_terminaldevicelog.GetComb)
//终端设备型号 
router.get('/sys_terminalmode/Index',sys_terminalmode.Index)
router.get('/sys_terminalmode/AddIndex',sys_terminalmode.AddIndex)
router.get('/sys_terminalmode/UpdateIndex',sys_terminalmode.UpdateIndex)
router.post('/sys_terminalmode/GetAllList',sys_terminalmode.GetAllList)
router.post('/sys_terminalmode/Add',sys_terminalmode.Add)
router.post('/sys_terminalmode/Update',sys_terminalmode.Update)
router.post('/sys_terminalmode/Remove',sys_terminalmode.Remove)
router.post('/sys_terminalmode/GetComb',sys_terminalmode.GetComb)
//上传文件  
router.get('/sys_upfile/Index',sys_upfile.Index)
router.get('/sys_upfile/AddIndex',sys_upfile.AddIndex)
 
router.post('/sys_upfile/GetAllList',sys_upfile.GetAllList)
router.post('/sys_upfile/Add',sys_upfile.Add)
router.post('/sys_upfile/Update',sys_upfile.Update)
router.post('/sys_upfile/Remove',sys_upfile.Remove)
router.post('/sys_upfile/GetComb',sys_upfile.GetComb)
router.post('/sys_upfile/upload',sys_upfile.upload)
router.get('/sys_upfile/PicIndex',sys_upfile.PicIndex)
//终端日志上传记录  
router.get('/sys_upload/Index',sys_upload.Index)
router.get('/sys_upload/AddIndex',sys_upload.AddIndex)
router.get('/sys_upload/UpdateIndex',sys_upload.UpdateIndex)
router.post('/sys_upload/GetAllList',sys_upload.GetAllList)
router.post('/sys_upload/Add',sys_upload.Add)
router.post('/sys_upload/Update',sys_upload.Update)
router.post('/sys_upload/Remove',sys_upload.Remove)
router.post('/sys_upload/GetComb',sys_upload.GetComb)
//用户管理
router.get('/sys_user/Index',sys_user.Index)
router.get('/sys_user/AddIndex',sys_user.AddIndex)
router.get('/sys_user/UpdateIndex',sys_user.UpdateIndex)
router.post('/sys_user/GetAllList',sys_user.GetAllList)
router.post('/sys_user/Add',sys_user.Add)
router.post('/sys_user/Update',sys_user.Update)
router.post('/sys_user/Remove',sys_user.Remove)
router.post('/sys_user/GetComb',sys_user.GetComb)

router.get('/sys_user/ResetPassword',sys_user.ResetPassword)
router.post('/sys_user/ModifyUserPwd',sys_user.ModifyUserPwd)


 
  module.exports = router
 