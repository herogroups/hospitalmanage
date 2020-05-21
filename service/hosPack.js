let webservice = require('../Libs/webservice')
const _config =require('../conf/config');
let ehreq = {
    "qrCodeText": "",
    "idCardNumber": "",
    "name": "",
    "scene": "010101",
    "department": "",

}
const {
    pospLogger
} = require('../Libs/logger')
//通过Code换取OpenId及用户信息
exports.H0002 = async (reqData) => {
 
    const axios = require('axios')
    let params = {};
    let url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + _config.weichat.appId +
        '&secret=' + _config.weichat.appSecret +
        '&code=' + reqData.code +
        '&grant_type=authorization_code';

    var res = await axios.get(url, {
        params: params
    }).catch((error) => {

        throw new Error('获取OpenId过程失败')
    })
   
    if (res.data.errcode ) {

        throw new Error(res.data.errmsg)
    }

    let respData = {};
 
    respData.access_token = res.data.access_token;
    respData.openid = res.data.openid;
    respData.refresh_token = res.data.refresh_token
    respData.expires_in = res.data.expires_in;

    let access_token = JSON.parse(await _config.getAccessToken()).access_token;
    url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${res.data.openid}&lang=zh_CN`

    let auth = await axios.get(url, {
        params: {}
    })

    respData.nickname = auth.data.nickname;
    respData.province = auth.data.province;
    respData.city = auth.data.city;
    respData.headimgurl = auth.data.headimgurl;
    respData.country = auth.data.country;

    return respData;
}
//解除绑定
exports.H1000 = async (reqData) => {
    pospLogger.info("解除绑定")
    let data = {};

    data.hosCardNo = reqData.hosCardNo; // 病人卡号 是 签约过的卡或就诊卡
    data.hosCardType = reqData.hosCardType; //卡类型 是 1 院内就诊卡2 院内电子就诊卡3 甘肃电子就诊卡
    data.hosCardFrom = reqData.hosCardFrom; //卡的来源

    let ims_account_db = require('../DbLib/Ims/Ims_Account_DB');

    let ret = await ims_account_db.remove(reqData.accountId);
    pospLogger.info("查询公众号其他卡号", reqData)
    let userlist = await ims_account_db.getListByOpenId({
        openid: reqData.openid
    })
    pospLogger.info("查询结果", userlist)
    if (Array.isArray(userlist) && userlist.length > 0) {
        pospLogger.info("开始设置默认值")
        await ims_account_db.update({
            isDefault: 1
        }, userlist[0].accountId);
        pospLogger.info("设置默认值完成")
    }
    if (ret) {
        return {}
    } else {
        throw new Error('解除数据绑定失败');
    }
}

//绑定默认值
exports.H0010 = async (reqData) => {
    let data = {};

    data.isDefault = 1;

    let ims_account_db = require('../DbLib/Ims/Ims_Account_DB');

    let ret = await ims_account_db.updateIsDefaultSetFalse(reqData.openid);
    ret = await ims_account_db.update(data, reqData.accountId);
    if (ret) {
        return {}
    } else {
        throw new Error('绑定默认值');
    }
}

function bindCardRelation(req) {
    const ehealth = require('./health/eHealthNet');
    let eh = new ehealth();
    return eh.send('bindCardRelation', req)
}
/**
 * 
 * @param {*} qrCodeText 
 * @param {*} idCardNumber 
 * @param {*} name 
 * @param {*} scene  010109住院 010105收费 010101 挂号
 * @param {*} department 
 */
async function reportHISData(param) {
    const dateUtil = require('../Libs/date-utils')
    const config = require('../conf/config')

    let req = {
        "qrCodeText": "",
        "idCardNumber": "",
        "name": "",
        "time": dateUtil.Format(new Date(), "yyyy-MM-dd hh:mm:ss"),
        "hospitalCode": config.healthHospitalId,
        "scene": "010101",
        "department": "",
        "cardType": "11",
        "cardChannel": "0401",
        "cardCostTypes": "0100" //用卡环节代码为010105(收费)、0101051(门诊缴费)、0101053(住院缴费
    }
    Object.assign(req, param)
    const ehealth = require('./health/eHealthNet');
    let eh = new ehealth();
    return eh.send('reportHISData', req)



}
async function callHelth(data) {

    let req = {
        "wechatCode": data.wechatCode,
        "name": data.name,
        "gender": data.sex,
        "nation": data.nation,
        "birthday": data.birth,
        "idNumber": data.certNo,
        "idType": "01",
        "address": data.address,
        "phone1": data.phone,
        "phone2": "",
        "patid": ""
    }

    const ehealth = require('./health/eHealthNet');
    let eh = new ehealth();
    return await eh.send('registerHealthCard', req)
}
async function registerBatchHealthCard(wechatCode) {
    console.log('-----------------------------------------------------------------------------', wechatCode);
    let ims_account_db = require('../DbLib/Ims/Ims_Account_DB');
    let resp = await ims_account_db.getList([], " certNo!='' and  accountId<100 and  ");
    console.log('resp===========', resp);
    let data = resp.map((row, index) => {
        let item = {
            "wechatCode": wechatCode,
            "name": row.name,
            "gender": row.sex,
            "nation": row.nation,
            "birthday": row.birth,
            "idNumber": row.certNo,
            "idType": "01",
            "address": "",
            "phone1": row.phone,

            "patid": row.patientId,
            "wechatUrl": "https://open.tengmed.com"

        };
        return item;

    });

    let healthCardItems = data;

    let req = {
        "healthCardItems": healthCardItems
    }

    pospLogger.info('JSON.stringify(req):', JSON.stringify(req))
    const ehealth = require('./health/eHealthNet');
    let eh = new ehealth();
    return await eh.send('registerHealthCard', req)
}
//调用Ocr身份证识别
exports.ocrInfo = async (reqData) => {


    const ehealth = require('./health/eHealthNet');
    let eh = new ehealth();

    return await eh.send('ocrInfo', reqData)
}
exports.getOrderIdByOutAppId = async (reqData) => {


    const ehealth = require('./health/eHealthNet');
    let eh = new ehealth();
    const config = require('../conf/config')
    reqData.appId = config.healthAppid;
    return await eh.send('getOrderIdByOutAppId', reqData)
}

exports.getHealthCardList = async (reqData) => {
    const ehealth = require('./health/eHealthNet');
    let eh = new ehealth();
    return await eh.send('getHealthCardByHealthCode', reqData)
}

//签约办卡
exports.H1007 = async (reqData) => {


    let data = {
        hosCardType: '3',
        hosCardFlag: '2',
        hosCardNo: '',
        hosCardFrom: '0',
        passWord: '123456',
        name: '',
        certType: '01',
        certNo: '',
        address: '',
        phone: '',
        nation: '01',
        birth: '',
        sex: ''
    };
    let isExist = false;
    data = Object.assign(data, reqData.cardInfo);
    pospLogger.info("--------------一键绑定 -------------------------------------", reqData, data)
    const util = require('../Libs/util')

    if (util.isNull(data.certNo)) {
        throw new Error("请填写身份信息")
    }
    const ims_account_db = require('../DbLib/Ims/Ims_Account_DB');
    let modle = await ims_account_db.getList([data.certNo, reqData.wixin.openid], " certNo=? and openid=? and");
    if (Array.isArray(modle) && modle.length > 0) {
        throw new Error("该用户已经存在")
    }


    // data.nation = (data.nation.includes("族") || data.nation.includes("未知")) ? data.nation : data.nation + "族";
    data.sex = (util.IdCard(data.certNo, 2) == '1') ? '男' : '女';
    data.birth = util.IdCard(data.certNo, 1);



    let ret4004 = await this.H4004(data) //通过身份证号查询是否有卡
    if (ret4004.responseHead.retCode == "00") { //医院没有记录的用户登记签约  
        let cardInfo = ret4004.data.cardinfo;
        if (Array.isArray(cardInfo) && cardInfo.length > 0) {
            let cardList = cardInfo.filter((item, index) => {
                return item.hosCardType == '3';
            });
            isExist = (typeof (cardList) != 'undefined') ? true : false;

        } else {
            isExist = (cardInfo.hosCardType == "3") ? true : false;
        }
        if (isExist) {
            return await bindSavelocal({
                hosCardNo: data.hosCardNo,
                hosCardType: data.hosCardType
            }, reqData.wixin);
        } else {
            await bindCard(data.hosCardNo, data.name, data.certNo)
            return await bindSavelocal({
                hosCardNo: data.hosCardNo,
                hosCardType: data.hosCardType
            }, reqData.wixin);
        }
        //His有电子健康卡
    }


    pospLogger.info("------------------------一键绑定-His系统没卡，要签约绑卡------------------------")


    await webservice.getHosService('1001', data, '门诊', '签约').catch(error => {
        throw new Error(error.retMsg);
    });
    return await bindSavelocal({
        hosCardNo: data.hosCardNo,
        hosCardType: data.hosCardType
    }, reqData.wixin);

}
//签约办卡
exports.H1001 = async (reqData) => {
    let isExist = false;
    let data = {
        hosCardType: '3',
        hosCardFlag: '2',
        hosCardNo: '',
        hosCardFrom: '0',
        passWord: '123456',
        name: '',
        certType: '01',
        certNo: '',
        address: '',
        phone: '',
        nation: '01',
        birth: '',
        sex: ''
    };

    data = Object.assign(data, reqData.cardInfo);
    pospLogger.info("--------------签约办卡-------------------------------------", reqData, data)



    const util = require('../Libs/util')

    if (util.isNull(data.certNo)) {
        throw new Error("请填写身份信息")
    }
    const ims_account_db = require('../DbLib/Ims/Ims_Account_DB');
    let modle = await ims_account_db.getList([data.certNo, reqData.wixin.openid], " certNo=? and openid=? and");
    if (Array.isArray(modle) && modle.length > 0) {
        throw new Error("该用户已经存在")
    }


    data.nation = (data.nation.includes("族") || data.nation.includes("未知")) ? data.nation : data.nation + "族";
    data.sex = (util.IdCard(data.certNo, 2) == '1') ? '男' : '女';
    data.birth = util.IdCard(data.certNo, 1);

    let healthInfo = await callHelth(data)
    // .catch((error) => {
    //     pospLogger.info("注册失败",error)
    //     throw new Error("注册失败")
    // })
    data.hosCardType = '3';
    data.hosCardNo = healthInfo.qrCodeText; //电子健康卡号



    let ret4004 = await this.H4004(data) //通过身份证号查询是否有卡
    if (ret4004.responseHead.retCode == "00") { //医院没有记录的用户登记签约  

        let cardInfo = ret4004.data.cardinfo;
        pospLogger.info("4004返回医", cardInfo)
        if (Array.isArray(cardInfo) && cardInfo.length > 0) {
            let cardList = cardInfo.filter((item, index) => {
                return item.hosCardType == '3';
            })
            pospLogger.info("判断卡片是否有电子健康卡", cardList)
            isExist = (typeof (cardList) != 'undefined') ? true : false;
        } else {
            pospLogger.info("4004返回不是数组")
            isExist = (cardInfo.hosCardType == "3") ? true : false
        }
        if (isExist) {
            return await bindSavelocal({
                hosCardNo: data.hosCardNo,
                hosCardType: 3
            }, reqData.wixin);
        } else {
            await bindCard(data.hosCardNo, data.name, data.certNo) //操His平台注册电子健康卡
            return await bindSavelocal({
                hosCardNo: data.hosCardNo,
                hosCardType: data.hosCardType
            }, reqData.wixin);
        }
    }

    pospLogger.info("该病人没有电子健康卡")

    pospLogger.info("用户注册")
    let newCard = await CreateEHCard(data) //创建新的电子健康卡，并获取卡号
    data.hosCardNo = newCard.hosCardNo;
    data.hosCardType = newCard.hosCardType

    await webservice.getHosService('1001', data, '门诊', '签约').catch(error => {
        throw new Error(error.retMsg);
    });
    return await bindSavelocal({
        hosCardNo: data.hosCardNo,
        hosCardType: data.hosCardType
    }, reqData.wixin);

}

//查询病人信息并且保存到数据库
async function bindSavelocal(reqData, weixin) {
    let ret = await webservice.getHosService('1002', reqData, '门诊', '查询病人信息');
    console.log('ret=========', ret);
    let userData = {
        hosCardNo: '',
        sex: '',
        name: '',
        phone: '',
        certNo: '',
        hosCardType: '3',
        hosCardFrom: '0',
        certType: '01',
        patientId: ''

    };

    userData = Object.assign(userData, weixin)
    userData.openid = weixin.openid
    userData.hosCardNo = ret.data.hosCardNo;
    userData.hosCardType = ret.data.hosCardType;
    userData.name = ret.data.name;
    userData.sex = ret.data.sex;
    userData.patientId = ret.data.patientId;
    userData.certNo = ret.data.certNo;
    userData.phone = ret.data.phone;
    pospLogger.info("查询病人信息并且保存到数据库", userData)
    bindCardRelation({
        "patid": userData.patientId,
        "qrCodeText": userData.hosCardNo
    });
    const {
        L0005
    } = require('./HosGzhClient')
    return await L0005(userData) //电子健康卡数据保存数据库
}
/**
 * 绑定卡号
 * @param {string} hosCardNo 
 * @param {string} name 
 * @param {string} certNo 
 */
async function bindCard(hosCardNo, name, certNo) {
    let r4009 = {};
    r4009.hosCardNo = hosCardNo; // 病人卡号 是
    r4009.name = name; // 持卡姓名 是 请传入持卡库病人姓名
    r4009.certNo = certNo; // 身份证号 是 请传入持卡库病人身份证号码
    r4009.hosCardType = 3 // 卡类型 是 3 甘肃电子就诊卡
    r4009.passWord = "123456" ///服务密码 是 6 位数字
    r4009.hosCardFlag = 2 // 卡标识 是 1 儿童卡 2 成人卡
    pospLogger.info("绑定卡号", r4009)
    await webservice.getHosService('4009', r4009, '门诊', '绑卡').catch(error => {
        console.log('err==============', error);
        throw new Error(error.message);
    });
}
async function CreateEHCard(data) {
    // let healthInfo = await callHelth(data)
    // data.hosCardType = '3';
    // data.hosCardNo = healthInfo.qrCodeText; //电子健康卡号

    let resp = await webservice.getHosService('1001', data, '门诊', '签约');
    if (resp.responseHead.retCode === "00") {
        pospLogger.info('签约结束:', resp.data)
        data.hosCardNo = resp.data.hosCardNo;
    } else {
        throw new Error(resp.responseHead.retMsg);
    }
    return data;
}
//修改持卡人用户信息
exports.H4005 = async (reqData) => {
    let data = {
        hosCardNo: reqData.hosCardNo, //病人卡号 是 签约过的卡或就诊卡
        hosCardFrom: reqData.hosCardFrom, //卡来源 是 0 实体就诊卡    1 电子就诊卡
        hosCardType: reqData.hosCardType, // 卡类型 是 1 院内就诊卡    2 院内电子就诊卡    3 甘肃电子就诊卡
        hosCardFlag: 2, //卡标识 是 1 儿童 2 成人    name 姓名 是
        name:reqData.name,
        certNo: reqData.certNo, //身份证号/监护     人身份证号 是
        phone: reqData.phone, //电话 是

    }
    let resp = await webservice.getHosService('4005', data, '门诊', '修改用户信息');
    if (resp.responseHead.retCode === "00") {

        data.hosCardNo = resp.data.hosCardNo;
    } else {
        throw new Error(resp.responseHead.retMsg);
    }
    return data;
}
/**查询是否在本院注册过 */
exports.H4004 = async (reqData) => {
    let data = {};

    data.certNo = reqData.certNo; //证件号
    data.hosCardFlag = reqData.hosCardFlag; // 1 儿童卡 2 成人卡

    let resp = await webservice.getHosService('4004', data, '门诊', '查询是否在本院注册过');
    return resp;

}
////查询该用户绑定的所有卡片信息  
exports.H1006 = async (reqData) => {
    let data = {};
    let respData = {};
    const ims_account_db = require('../DbLib/Ims/Ims_Account_DB')
    const util = require('../Libs/util')
    let modle = await ims_account_db.getListByOpenId({
        openid: reqData.openid
    });
    console.log('4444444444444444---------------44444',reqData);
    if (Array.isArray(modle) && modle.length > 0) {
        modle = modle.map((item, index) => {
            item.hiddeCertNo = util.plusXing(item.certNo, 4, 4, '*');
            item.hidePhone = util.plusXing(item.phone, 3, 3, '*');
            return item;
        })
    }
    respData = modle;


    return respData;
}
/**查询病人信息 */
exports.H1002 = async (reqData) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        let db = require('../DbLib/Ims/Ims_Account_DB');
        data.hosCardNo = reqData.hosCardNo; // 病人卡号 是 签约过的卡或就诊卡
        data.hosCardType = reqData.hosCardType;

        data.hosCardFrom = 0; //卡的来源

        let isExist = await db.isExistsByOpenIdAndHosCardNo(reqData.openid, reqData.hosCardNo)
        if (isExist) {
            reject('该卡已经绑定')
        }
        let resp = await webservice.getHosService('1002', data, '门诊', '查询病人信息');
        if (resp.responseHead.retCode === "00") {
            resolve(resp);
        } else {
            reject(resp.responseHead.retMsg)
        }
    });

}

//查询挂号类别
exports.H1003 = async () => {
    let data = {};
    let respData = [];

    data.type = 25; //挂号类别      
    respData = await recursion('1003', data, respData, 'typeInfo', '门诊', '查询挂号类别');
    respData = respData.filter(function (item, index) {
        if (item.typeId != 2) {
            const dateUtil = require('../Libs/date-utils')
            let time = dateUtil.Format(new Date(), 'hhmm'); //交易时间	是	HHmmss
            if (Number.parseInt(time) < 1630 && Number.parseInt(time) > 800) {
                return true;
            } else {
                return false;
            }
        } else {
            return true
        }
    })
    // let  newArr={};
    // newArr.items = switchArr(respData.typeInfo,'typeId','typeName')
    return respData;
}
/**查询排班科室 */
exports.H1004 = async (reqData) => {
    let data = {};
    let respData = [];
    data.schedulingDate = reqData.schedulingDate; // 排班日期
    data.typeId = reqData.typeId; //挂号类别      
    let resp = await recursion('1004', data, respData, 'deptInfo', '门诊', '查询排班科室', 1, 100);

    return respData;
}
/**查询排班医生 */
exports.H1005 = async (reqData) => {
    let data = {};

    let respData = [];
    data.schedulingDate = reqData.schedulingDate; // 查询排班日期 是 日期类型 yyyymmdd(默认当天)
    data.deptId = reqData.deptId; //科室 Id 是 参照 1004 交易
    data.typeId = reqData.typeId; //挂号类别 ID 是 参照 1003 交
    respData = await recursion('1005', data, respData, 'doctorInfo', '门诊', '查询排班医生');
    respData.map((item, index, arr) => {

        item.registerTotalFee = (item.registerTotalFee.trim() == "") ? "0" : item.registerTotalFee;
        item.doctorImageUrl =_config.hosp.doctorImageUrl + item.userCode + '.png'
    });
    return respData;
}
/**当日挂号 */
exports.H1008 = async (reqData) => {

    let data = {};
    data.hosCardNo = reqData.hosCardNo; //病人卡号 是 签约过的卡或就诊卡
    data.hosCardType = reqData.hosCardType; //卡类型 是 1 院内就诊卡    2 院内电子就诊卡    3 甘肃电子就诊卡
    data.hosCardFrom = reqData.hosCardFrom; //卡来源 是 0 实体就诊卡    1 电子就诊卡
    data.deptId = reqData.deptId; //科室 ID 是 参看接口 1005
    data.doctorId = reqData.doctorId; // 医生 Id 是 参看接口 1005,当为普通号时， ID 为    空
    data.typeId = reqData.typeId; //挂号类别 ID 是 参看接口 1004    
    data.schedulingSequenceNum = reqData.schedulingSequenceNum; // 值班类别 是 1 上午    2 下午
    data.feeList = reqData.feeList; // 挂号费用明细 是 每个医院的挂号费用项各不相同    见示例
    data.registerTotalFee = reqData.registerTotalFee; //挂号总费用 是
    data.payAmount = reqData.payAmount; // 实际支付金额 是 支付的金额
    data.payMethod = "02"; //支付方式 是 02: 账户预交金
    data.payType = '1'; //支付类型 是 1 自费    2 市医保门诊
    data.payInfo = reqData.payInfo; //医保返回数据 否 每种支付方式的返回字段各不相同
    data.pospOrderNo = reqData.pospOrderNo;
    let resp = await webservice.getHosService('1008', data, '门诊', '当日挂号');
    if (resp.responseHead.retCode === "00") {
        ehreq.qrCodeText = data.hosCardNo;
        ehreq.scene = "010101"
        ehreq.department = reqData.deptName;
        reportHISData(ehreq) //电子健康卡上传
        /** 当日挂号返回消息 */
        let option = {};
        option.msgType = "01";
        option.openid = reqData.openid;
        option.name = reqData.name;
        option.hosCardNo = data.hosCardNo;
        option.deptName = reqData.deptName;
        option.doctorName = reqData.doctorName;
        let msgTpl = require('./msgTpl');
        msgTpl.msgSend(option)

        return resp.data;
    } else {
        throw new Error(resp.responseHead.retMsg);
    }
}

/**预约排班医生 */
exports.H3001 = async (reqData) => {
    let data = {};

    let respData = [];
    data.dateStart = reqData.dateStart; //查询排班日期开    始    否 yyyymmdd(默认第二天)
    data.dateEnd = reqData.dateEnd; // 查询排班日期结    束    否 yyyymmdd(默认第 8 天)
    data.deptId = reqData.deptId; //科室代码 是
    data.typeId = reqData.typeId; //挂号类别 ID 是
    respData = await recursion('3001', data, respData, 'doctorInfo', '门诊', '预约排班医生');
    respData.map((item, index, arr) => {
        item.registerTotalFee = (item.registerTotalFee.trim() == "") ? "0" : item.registerTotalFee;
        item.doctorImageUrl = _config.hosp.doctorImageUrl + item.userCode + '.png'
    });
    respData.sort((a, b) => {
        return a.orderDateList.dateInfo.schedulingSequenceNum - b.orderDateList.dateInfo.schedulingSequenceNum
    })
    return respData;
}
/**查询号源 */
exports.H3002 = async (reqData) => {
    let data = {};
    let respData = [];
    data.schedulingDate = reqData.schedulingDate; //查询排班日期 否 yyyymmdd
    data.deptId = reqData.deptId; // 科室代码 是
    data.doctorId = reqData.doctorId; // 医生代码 是
    data.schedulingSequenceNum = reqData.schedulingSequenceNum; //   值班类别 是 1 上午    2 下午
    data.typeId = reqData.typeId; // 挂号类别 是 3 专家门诊

    await recursion('3002', data, respData, 'doctorInfoNum', '门诊', '查询号源');
    return respData;
}
/**预约挂号 */
exports.H3003 = async (reqData) => {
    return new Promise(async (resolve, reject) => {


        let data = {};

        data.hosCardNo = reqData.hosCardNo; //病人卡号 是 签约过的卡或就诊卡
        data.hosCardType = reqData.hosCardType; // 卡类型 是 1 院内就诊卡2 院内电子就诊卡3 甘肃电子就诊卡
        data.hosCardFrom = reqData.hosCardFrom; // 卡来源 是 0 实体就诊卡1 电子就诊卡
        data.doctorId = reqData.doctorId; // 医生 Id 是
        data.deptId = reqData.deptId; // 科室代码 是
        data.typeId = reqData.typeId; // 挂号类别 是
        data.schedulingSequenceNum = reqData.schedulingSequenceNum; // 值班类别 是 1 上午2 下午
        data.registerDate = reqData.registerDate; // 预约日期 是 yyyymmdd
        data.tranFlow = reqData.TranFlow; // 预约挂号 ID 是 3002 交易参数获得
        data.feeList = reqData.feeList; // 费用明细 否 根据医院业务， 格式参看示例
        data.registerTotalFee = reqData.registerTotalFee; // 挂号总费用 否 根据医院业务 
        let resp = await webservice.getHosService('3003', data, '门诊', '预约挂号');
        if (resp.responseHead.retCode === "00") {
            let l3005 = Object.assign(data, resp.data)

            let r3005 = await this.H3005(l3005).catch((err) => {
                reject(err);
                pospLogger.info('取号失败:', err)
            });

            ehreq.qrCodeText = data.hosCardNo;
            ehreq.scene = "010101"
            ehreq.department = reqData.deptName;

            reportHISData(ehreq) //电子健康卡上传



            /**  预约挂号发送消息*/
            let option = {};
            option.msgType = "02";
            option.openid = reqData.openid;
            option.name = reqData.name;
            option.hosCardNo = data.hosCardNo;
            option.deptName = reqData.deptName;
            option.doctorName = r3005.doctorname;
            option.seeTime = r3005.worktime;
            let msgTpl = require('./msgTpl');
            msgTpl.msgSend(option)


            resolve(r3005)
            pospLogger.info('预约取号成功:', r3005)

        } else {
            pospLogger.info('预约挂号不成功:', resp)
            reject(resp)
        }
    });

}
/**查询预约信息 */
exports.H3004 = async (reqData) => {
    let data = {};
    let respData = [];
    data.hosCardNo = reqData.hosCardNo; // 病人卡号 是 签约过的卡或就诊卡
    data.hosCardType = reqData.hosCardType; // 卡类型 是 1 院内就诊卡    2 院内电子就诊卡    3 甘肃电子就诊卡
    data.hosCardFrom = reqData.hosCardFrom; // 卡来源 是 0 实体就诊卡    1 电子就诊卡
    data.dateStart = reqData.dateStart; // 开单日期开始 是 yyyymmdd（根据医院处方效期处理）
    data.dateEnd = reqData.dateEnd; // 开单日期结束 是 yyyymmdd（根据医院处方效期处理）    

    await recursion('3004', data, respData, 'orderInfo', '门诊', '查询预约信息');
    ehreq.qrCodeText = data.hosCardNo;
    ehreq.scene = "0101013"
    ehreq.name = reqData.name;
    reportHISData(ehreq) //电子健康卡上传
    return respData;
}
/** 预约取号 */
exports.H3005 = async (reqData) => {
    let data = {};

    data.hosCardNo = reqData.hosCardNo; //病人卡号 是 签约过的卡或就诊卡
    data.hosCardType = reqData.hosCardType; // 卡类型 是 1 院内就诊卡2 院内电子就诊卡3 甘肃电子就诊卡
    data.hosCardFrom = reqData.hosCardFrom; // 卡来源 是 0 实体就诊卡1 电子就诊卡
    data.tranFlow = reqData.tranFlow; //预约挂号 ID 是
    data.registerTotalFee = reqData.registerTotalFee //挂号总费用 是
    data.payType = 1; //支付类型 是 1:自费 2:医保
    data.payInfo = reqData.payInfo; //医保支付信息 是 医保交易数据
    data.serialNumber = reqData.serialNumber; // 预约流水号 取号必传

    let resp = await webservice.getHosService('3005', data, '门诊', '预约取号');
    if (resp.responseHead.retCode === "00") {

        return resp.data;
    }
    throw new Error(resp.responseHead.retMsg);
}
/** * 查询未缴费处方信息  */
exports.H1019 = async (reqData) => {

    ehreq.qrCodeText = reqData.hosCardNo;
    ehreq.scene = "0101051";
    ehreq.name = reqData.name;
    reportHISData(ehreq) //电子健康卡上传
    let data = {};
    let respData = [];
    data.hosCardNo = reqData.hosCardNo; // 病人卡号 是 签约过的卡或就诊卡
    data.hosCardType = reqData.hosCardType; // 卡类型 是 1 院内就诊卡    2 院内电子就诊卡    3 甘肃电子就诊卡
    data.hosCardFrom = reqData.hosCardFrom; // 卡来源 是 0 实体就诊卡    1 电子就诊卡
    data.dateStart = reqData.dateStart; // 开单日期开始 是 yyyymmdd（根据医院处方效期处理）
    data.dateEnd = reqData.dateEnd; // 开单日期结束 是 yyyymmdd（根据医院处方效期处理）    
    // data.prescriptionFrom = reqData.prescriptionFrom; //处方来源 是 0 医生    1 非医生
    // data.tranFlow = ''; //reqData.tranFlow医保交易时不能为空

    respData = await recursion('1019', data, respData, 'prescriptionInfo', '门诊', '查询未缴费处方信息');

    return respData;
}

/** 查询未缴费处方明细信息 */
exports.H1020 = async (reqData) => {
    let data = {};
    let respData = [];
    data.hosCardNo = reqData.hosCardNo; // 病人卡号 是 签约过的卡或就诊卡
    data.hosCardType = reqData.hosCardType; // 卡类型 是 1 院内就诊卡    2 院内电子就诊卡    3 甘肃电子就诊卡
    data.hosCardFrom = reqData.hosCardFrom; // 卡来源 是 0 实体就诊卡    1 电子就诊卡
    data.prescriptionNo = reqData.prescriptionNo; // prescriptionNo 处方号 是 ID 处方编号 (参照 1019 交易)     
    respData = await recursion('1020', data, respData, 'prescriptionDetailInfo', '门诊', '查询未缴费处方明细信息');
    return respData;
}
/**门诊预交金充值 */
exports.H1023 = async (reqData) => {
    let data = {};


    data.hosCardNo = reqData.hosCardNo;
    data.hosCardType = reqData.hosCardType; // 卡类型 是 1 院内就诊卡2 院内电子就诊卡3 甘肃电子就诊卡
    data.hosCardFrom = reqData.hosCardFrom; //卡来源 是 0 实体就诊卡1 电子就诊卡

    data.rechargeAmount = reqData.payAmount; //充值金额 是
    data.payMethod = reqData.payMethod;; //支付方式 是 01 银行卡    03 现金    04 微信    05 支付宝
    data.payInfo = reqData.payInfo;; // 支付返回数据
    data.pospOrderNo = reqData.pospOrderNo;
    let resp = await webservice.getHosService('1023', data, '门诊', '门诊预交金充值');
    if (resp.responseHead.retCode === "00") {

        return resp.data;
    }
    throw new Error(resp.responseHead.retMsg);
}
/** 处方缴费 */
exports.H1021 = async (reqData) => {
    let data = {};

    data.hosCardNo = reqData.hosCardNo;
    data.hosCardType = reqData.hosCardType; // 卡类型 是 1 院内就诊卡2 院内电子就诊卡3 甘肃电子就诊卡
    data.hosCardFrom = reqData.hosCardFrom; //卡来源 是 0 实体就诊卡1 电子就诊卡

    data.prescriptionNos = reqData.prescriptionNos; //缴费处方号 是 ID1|ID2|....处方编号|类型(参照 1019 交易)
    data.prescriptionsAmount = reqData.prescriptionsAmount; //缴费处方总金额 是
    data.payAmount = reqData.payAmount; //实际支付金额 是

    let resp = await webservice.getHosService('1021', data, '门诊', '查询已缴费信息');
    if (resp.responseHead.retCode === "00") {

        return resp.data;
    }
    throw new Error(resp.responseHead.retMsg);
}

/**挂号记录查询 */
exports.H1032 = async (reqData) => {
    let data = {};
    let respData = [];
    data.hosCardNo = reqData.hosCardNo;
    data.hosCardType = reqData.hosCardType; // 卡类型 是 1 院内就诊卡2 院内电子就诊卡3 甘肃电子就诊卡
    data.hosCardFrom = reqData.hosCardFrom; //卡来源 是 0 实体就诊卡1 电子就诊卡
    data.dateStart = reqData.dateStart; //查询日期开始 是 yyyymmdd
    data.dateEnd = reqData.dateEnd; // 查询日期结束 是 yyyymmdd

    ehreq.qrCodeText = data.hosCardNo;
    ehreq.scene = "0101013"
    ehreq.name = reqData.name;
    reportHISData(ehreq) //电子健康卡上传

    respData = await recursion('1032', data, respData, 'registerInfo', '门诊', '挂号记录查询');
    return respData;
}
/**查询已缴费信息 */
exports.H1033 = async (reqData) => {
    let data = {};
    let respData = [];
    data.hosCardNo = reqData.hosCardNo; // 病人卡号 是 签约过的卡或就诊卡
    data.hosCardType = reqData.hosCardType; // 卡类型 是 1 院内就诊卡2 院内电子就诊卡3 甘肃电子就诊卡
    data.hosCardFrom = reqData.hosCardFrom; // 卡来源 是 0 实体就诊卡1 电子就诊卡
    data.dateStart = reqData.dateStart; //查询日期开始 是 yyyymmdd
    data.dateEnd = reqData.dateEnd; // 查询日期结束 是 yyyymmdd

    respData = await recursion('1033', data, respData, 'clinicPayment', '门诊', '查询已缴费信息');
    ehreq.qrCodeText = data.hosCardNo;
    ehreq.scene = "0101052"
    ehreq.department = data.deptId;
    reportHISData(ehreq) //电子健康卡上传
    return respData;
}
/**门诊缴费记录明细查询 */
exports.H1034 = async (reqData) => {
    let data = {};
    let respData = [];
    data.receiptNo = reqData.receiptNo; // 病人卡号 是 签约过的卡或就诊卡    

    respData = await recursion('1034', data, respData, 'clinicPayment', '门诊', '门诊缴费记录明细查询');
    return respData;
}
exports.H10341 = async (reqData) => {
    let data = {};
    let respData = [];
    data.receiptNo = reqData.receiptNo; // 病人卡号 是 签约过的卡或就诊卡    

    respData = await recursion('10341', data, respData, 'clinicPayment', '门诊', '门诊缴费记录明细查询');
    return respData;
}
/**检验报告查询 */
exports.H1026 = async (reqData) => {
    let data = {};
    let respData = [];
    data.hosCardNo = reqData.hosCardNo; // 病人卡号 是 签约过的卡或就诊卡
    data.hosCardType = reqData.hosCardType; // 卡类型 是 1 院内就诊卡2 院内电子就诊卡3 甘肃电子就诊卡
    data.hosCardFrom = reqData.hosCardFrom; // 卡来源 是 0 实体就诊卡1 电子就诊卡
    data.dateStart = reqData.dateStart; //查询日期开始 是 yyyymmdd
    data.dateEnd = reqData.dateEnd; // 查询日期结束 是 yyyymmdd

    // ehreq.qrCodeText = data.hosCardNo;
    // ehreq.scene = "0101082"
    // ehreq.name = reqData.name;
    // reportHISData(ehreq) //电子健康卡上传

    respData = await recursion('1026', data, respData, 'report', '门诊', '检验报告查询');


    return respData;
}

/**检验报告单详情 */
exports.H1027 = async (reqData) => {

    let data = {};
    let respData = [];
    data.reportNo = reqData.reportNo; // 样本编码 是 yyyymmdd 
    await recursion('1027', data, respData, 'inspectReport', '门诊', '检验报告单详情');


    return respData;
}
//住院病人入院记录
exports.H2005 = async (reqData) => {
    let data = {};
    data.patientId = reqData.patientId; // 病人卡号 是 签约过的卡或就诊卡
    data.hosCardType = reqData.hosCardType; //卡类型 是 1 院内就诊卡2 院内电子就诊卡3 甘肃电子就诊卡
    data.hosCardFrom = reqData.hosCardFrom; //卡的来源
    let resp = await webservice.getHosService('2005', data, '住院', '住院病人入院记录');
    if (resp.responseHead.retCode === "00") {
        return resp.data;
    }
    throw new Error(resp.responseHead.retMsg);
}
/** 住院预交金充值*/
exports.H2001 = async (reqData) => {

    let data = {};
    data.inHosNo = reqData.inHosNo; //住院 id 是 2005 交易获取
    data.rechargeAmount = reqData.rechargeAmount; // 充值金额 是
    data.payMethod = reqData.payMethod; // 支付方式 是 01银行卡02 就诊卡账户03 现金04 微信05 支付宝
    data.payInfo = reqData.payInfo; // 第三方交易数据 是 每种支付方式的返回字段各不相同， 具体参数看报文示例
    data.pospOrderNo = reqData.pospOrderNo;
    let resp = await webservice.getHosService('2001', data, '住院', '住院预交金充值');

    if (resp.responseHead.retCode === "00") {


        return resp.data;
    } else {
        throw new Error(resp.responseHead.retMsg);
    }


    // throw new Error(resp.responseHead.retMsg);
}
/**住院一日清单查询 */
exports.H2002 = async (reqData) => {
    let data = {};
    let respData = [];
    data.inHosNo = reqData.inHosNo; // 住院 id 是 2005 交易获取
    data.dateStart = reqData.dateStart; // 查询日期开始 是 yyyymmdd (默认前一天) 
    data.dateEnd = reqData.dateEnd; // 查询日期结束 是 yyyymmdd (默认前一天)

    respData = await recursion('2002', data, respData, 'inHosDailyFee', '住院', '在院病人信息查询');



    return respData;
}
/**在院病人信息查询 */
exports.H2003 = async (reqData) => {

    let data = {};
    data.inHosNo = reqData.inHosNo; //住院 id 是 2005 交易获取

    let resp = await webservice.getHosService('2003', data, '住院', '在院病人信息查询');

    if (resp.responseHead.retCode === "00") {
        return resp.data;
    }
    throw new Error(resp.responseHead.retMsg);
}

/**住院预交金查询 */
exports.H2004 = async (reqData) => {
    let data = {};
    let respData = [];
    data.inHosNo = reqData.inHosNo; // 住院 id 是 2005 交易获取
    data.dateStart = reqData.dateStart; // 查询日期开始 是 yyyymmdd (默认前一天) 
    data.dateEnd = reqData.dateEnd; // 查询日期结束 是 yyyymmdd (默认前一天)

    respData = await recursion('2004', data, respData, 'chargeInfo', '住院', '住院预交金查询');


    return respData;
}

function switchArr(arr, arrId, arrName) {
    return arr.map((row, index) => {

        let item = {};
        item.itemId = row[arrId];
        item.itemName = row[arrName];
        return item
    });

}
/**多记录查询打包 */
async function recursion(busCode, reqData, respData, nodeName, busType = '', busName = '', curPageNum = 1, pageSize = 100) {
    reqData.requestPage = curPageNum; //当前页面
    reqData.pageSize = pageSize; //每页记录数

    let resp = await webservice.getHosService(busCode, reqData, busType, busName);


    if (resp.responseHead.retCode === "00") {

        if (resp.data[nodeName] instanceof Array) { //判断是数组还是对象
            resp.data[nodeName].forEach(element => {
                respData.push(element);
            });
        } else {
            respData.push(resp.data[nodeName]);
        }
        if (!resp.pagingInfo) return respData;
        let rCurPageNum = resp.pagingInfo.curPageNum
        let totalPage = resp.pagingInfo.totalPage

        if (Number(rCurPageNum) < Number(totalPage)) {
            curPageNum++;
            await recursion(busCode, reqData, respData, nodeName, busType, busName, curPageNum, pageSize)
        } else {

            return respData;
        }
    } else {
        throw new Error(resp.responseHead.retMsg);
    }
}