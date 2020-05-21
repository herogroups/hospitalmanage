const tm = require('../../DbLib/RemoteUp/ClientTms_DB')
const readPathFile = require('../../Libs/readPathFile')
 
const {remoteLog} = require('../../Libs/logger')
const Md5File = require('../../Libs/Md5File')
const path = require('path')
const tradeType = {
    DeviceState: "01",
    LogSend: "02",
    GetAuthoUserImg: "03",
    cmdExe: "04",
    DownAdvFile: "05",
    DownAppFile: "06",
    UpLoadBusData: "07",
    UpLoadBusImg: "08",
    GetBusType: "09",
}
const Ctrlbase = require('../../routes/CtrBase')
/**
 * 命令业务控制模块
 */
class ClientTms extends Ctrlbase {

    async Trans(ctx, next) {


        let resp = {};
        let body = {};
        let DownFile = [];
        let BusData = [];
        let terminalCode = '';
        remoteLog.info('in',JSON.stringify(ctx.request.body));

     
        try {


            body = JSON.parse(ctx.request.body.data)
            console.log('body======',body);
            let ret = await tm.IsExistsTerminalCode(body.terminalCode);

            if (!(Array.isArray(ret) && ret.length > 0)) {

                throw new Error(`终端号[${body.terminalCode}]不存在`);
            }
            terminalCode = body.terminalCode;
            if (terminalCode === 'err') {
                throw new Error('终端校验失败');
            }
           
            if (body.appVersionCode ) {                
                await tm.UpdateAppVersion(body.appVersionCode, terminalCode);
            }
            if (body.adVersionCode != NaN) {

               await  tm.UpdateAdvVersion(body.adVersionCode, terminalCode);
            }
            switch (body.tradeType) {

                case tradeType.cmdExe: {
                
                    await tm.UpLoadExeCmd(terminalCode);
                    if (body.isNotice){
                        
                         ctx.socketWork.send(  {terminalCode:terminalCode,kind:"updateOver"} );
                    }
                   
                    break;
                }
                case tradeType.LogSend: {
                   
                    const uploadFile = require('../../Libs/uploadFile')

                    const file = ctx.request.files.log; // 获取上传文件  
                    if (!file){
                        throw new Error("日志文件没有上传")
                    }
                    
                    const newFile = uploadFile.upfile(file, `download/ClientLog/`);
                    let upload = {};
                    upload.TERMINALCODE = terminalCode;
                    upload.FILENAME = file.name;
                    upload.REMOTEIP = ctx.request.ip.replace('::ffff:', '');
                    upload.FILESAVEAS = newFile;
                    upload.UPLOADTIME = new Date();
                    await tm.UpLoadLog(upload, terminalCode);
                    let msgObj={terminalCode:terminalCode,url:"/"+newFile,kind:'logUpload'}                    
                    ctx.socketWork.send(msgObj);
                    break;
                }
                
                case tradeType.DeviceState: {

                    await tm.UpLoadDeviceState(body.deviceState, terminalCode);
                    break;
                }
                
                case tradeType.DownAppFile: {
                    DownFile = await getDwonFile(terminalCode, 0);
                 
                    break;
                }

                case tradeType.DownAdvFile: {
                  
                    DownFile = await getDwonFile(terminalCode, 1);

                    break;
                }
                 


                default:
                    throw new Error("交易类型不存在");
                   
            }
            resp.code = "0000"
            resp.msg = "成功";
            let ter = await tm.getTerminal(terminalCode);
            
            ter = ter[0];
            resp.cmd = ter.DOCMD;
            resp.tradeType = body.tradeType;
            resp.getLogDate = (ter.DOCMD == 5) ? new Date(ter.UPLOADLOGTIME).getTime() : 0;
            resp.cmdRef = (ter.DOCMD == 2) ? ter.cmdRef : "";
            resp.appPageVersion = await tm.getUpFileByTerminalCode(terminalCode, 0);
            resp.advPageVersion = await tm.getUpFileByTerminalCode(terminalCode, 1);
            console.log('dao 5');
            resp.cmdCh = ter.CmdName;
            resp.DownFile = DownFile;
            resp.BusData = BusData;



        } catch (err) {
            console.log(err)
            resp = {
                code: "0001",
                msg: `错误原因${err}`
            }

            //resp.error="234";
        } finally {
            remoteLog.info('out',JSON.stringify(resp));
          
            ctx.body = resp;
        }
    }


}
async function getAuthFile(terminalCode) {
    let DownFileInfo = {};
    let DownFile = [];
    let arrFiles = [];
    let authoResult = await tm.getAuthoImage(terminalCode);
    if (authoResult.length > 0) {
        DownFileInfo.ServerUrl = '\\';
        DownFileInfo.SoftId = 0;
        //  let authoPath = path.resolve('download/autho')
        authoResult.forEach((el) => {
            let file = path.resolve(el.AuImageUrl)
            let fileInfo = Md5File(file)
            let Files = {};
            Files.MD5 = fileInfo.md5;
            Files.Size = fileInfo.size
            Files.FileFullName = el.AuImageUrl;
            Files.Alias = fileInfo.md5 + fileInfo.extname;
            Files.Name = el.AuName;
            Files.Code = el.AuCode; 
            arrFiles.push(Files)
        });
        DownFileInfo.FileData = arrFiles;
        DownFile.push(DownFileInfo);
    }
    return DownFile;
}
async function getDwonFile(terminalCode, filePageType) {
    let DownFileInfo = {};
    let DownFile = [];
    console.log('terminalCode, filePageType', terminalCode, filePageType)
    let UpFile = await tm.downFile(terminalCode, filePageType);
    console.log('333')
    if ((Array.isArray(UpFile)) && UpFile.length > 0) {
        UpFile = UpFile[0];
        DownFileInfo.ServerUrl = '/download/' + UpFile.FILEID.toString() + "/";
        DownFileInfo.SoftId = UpFile.SOFTID;
        let unzipPath = path.resolve('download', UpFile.FILEID.toString()) + '\\'
        let readRet = readPathFile.getFileList(unzipPath);
        let arrFiles = [];
        if (readRet != null) {
            readRet.forEach(element => {
                let file = element.path + element.filename;
                let fileInfo = Md5File(file)
                let Files = {};
                Files.MD5 = fileInfo.md5;
                Files.Size = fileInfo.size
                Files.FileFullName = file.substring(unzipPath.length);
                Files.Alias = fileInfo.md5 + fileInfo.extname;
                arrFiles.push(Files)
            });
            DownFileInfo.FileData = arrFiles;
        }
        DownFile.push(DownFileInfo);

    }
    return DownFile;
}

module.exports = new ClientTms();