const {
    imsLogger
} = require('../Libs/logger')
let ehreq = {
    "qrCodeText": "",
    "idCardNumber": "",
    "name": "",
    "scene": "010101",
    "department": "",

}
/**微信扫码初始化 */
exports.L0004 = async (reqData) => {
    let respData = {};
    let wxpayUtil = require('../wechat/wxpayUtil');
    let wxApi = require('./wxApi');
    var _config =require('../conf/config');
    respData.nonce_str = wxpayUtil.createNonceStr()
    respData.timeStamp = wxpayUtil.createTimeStamp();
    respData.appId = _config.weichat.appId

    let res = await wxApi.getToken_JsApi()
    //计算signature 开始
    let calcSign = {};
    calcSign.noncestr = respData.nonce_str;
    calcSign.timestamp = respData.timeStamp;
    calcSign.url = reqData.url;
    calcSign.jsapi_ticket = res.jsapi_ticket;
    imsLogger.info('计算签名：', calcSign);
    var temp = "";
    Object.keys(calcSign).sort().forEach(function (v, i) {
        if (v !== 'sign' && calcSign[v]) {
            temp += v + "=" + calcSign[v] + "&";
        }
    });
    var reg = /&$/gi; //此处是正则
    temp = temp.replace(reg, "");
    imsLogger.info('计算签名排序：', temp);
    const sha1 = require('sha1');
    const result = sha1(temp);
    imsLogger.info('计算签名结果：', result);
    //计算signature 结束
    respData.signature = result;
    return respData;
}
/** 
 * 保存用户信息到公众号数据库
 */
exports.L0005 = async (reqData) => {

    let db = require('../DbLib/Ims/Ims_Account_DB');
    const util = require('../Libs/util')

    isExist = await db.isExists({
        openid: reqData.openid
    })

    reqData.isDefault = (isExist) ? 0 : 1;
    reqData.createDate = new Date();
    let ret = await db.add(reqData);
    if (!ret) {
        throw new Error('保存失败，请联系管理员')
    }
    let {
        registEHealthCardSuccess
    } = require('./health/messageTemplate');
    let sDateTime = util.dateFtt("yyyy年MM月dd日 hh:mm:ss", new Date());
    await registEHealthCardSuccess(reqData.openid, "尊敬的" + reqData.name + "，您的电子健康卡已经注册成功。", reqData.name, '张掖市第二人民医院', sDateTime, "欢迎使用患者移动服务")
    return ret;
}
/**
 * 修改持卡人到数据库
 */
exports.L0006 = async (reqData) => {
    // name 姓名
    // phone 电话号码
    // certNo 证件号码

    let db = require('../DbLib/Ims/Ims_Account_DB');
    let ret = await db.update(reqData,reqData.accountId);
    if (!ret) {
        throw new Error('保存失败，请联系管理员')
    }

    return ret;
}
/**获取科室*/

exports.L3001 = async (reqData) => {

    let db_dept = require('../DbLib/Hos/Hos_Dept_DB')
    let model = [];

    let respData = await db_dept.GetDeptList(model);
    return respData;
}

/**获取医生列表 */
exports.L3002 = async (reqData) => {
    if (reqData.deptId == undefined || reqData.deptId == '') {
        throw new Error("deptId没有设置")
    }
    const db_doctor = require('../DbLib/Hos/Hos_Doctor_DB')
    let respData = await db_doctor.getDoctorList(reqData);
    if (respData.length < 1) {
        throw new Error("没有数据记录")
    }
    return respData;
}

/**获取 文章列表*/
exports.L2002 = async (reqData) => {
    let code = reqData.subTypeCode;
    if (code == undefined || code == '') {
        throw new Error("subTypeCode没有设置");
    }
    const db_article = require('../DbLib/Hos/Hos_Article_DB')
    let model = [];

    model.push(reqData)

    let respData = await db_article.GetList(model);
    if (respData.length < 1) {
        throw new Error("没有数据记录")
    }
    return respData;
}
/**获取文章最后一条记录 */
exports.L2012 = async (reqData) => {
    let code = reqData.subTypeCode;
    if (code == undefined || code == '') {
        throw new Error("subTypeCode没有设置")
    }
    var _config =require('../conf/config');   
    const db_article = require('../DbLib/Hos/Hos_Article_DB')
    let model = [];
    model.push(reqData);
    let respData = {};
    if (code == '001') {
        respData = await db_article.GetSingle(model);
        respData.hosNetUrl = _config.weichat.hosNetUrl;
    } else {
        respData = await db_article.GetArticleSingle(model);
    }
    if (respData === null) {
        throw new Error("没有数据记录")
    }
    return respData;
}
/**根据Code查询OpenID与用户信息 */
exports.L5001 = async (reqData) => {

    const axios = require('axios')
    const util = require('../Libs/util')

    let respData = {};

    const ims_account_db = require('../DbLib/Ims/Ims_Account_DB')
    let modle = await ims_account_db.getListByOpenId({
        openid: reqData.openid
    });
    if (modle == null) {
        respData.isThisUser = 0;
    } else {
        respData.isThisUser = 1;
        if (Array.isArray(modle) && modle.length > 0) {
            modle = modle.map((item, index) => {
                item.hiddeCertNo = util.plusXing(item.certNo, 4, 4, '*');
                item.hidePhone = util.plusXing(item.phone, 3, 3, '*');
                return item;
            })
        }
        respData.UserData = modle;

    }

    return respData;
}
exports.L5002 = async (reqData) => {

    let access_token = ''
    let openid = ''

    const sys_ref_db = require('../DbLib/SystemManage/Sys_Ref_DB')
    let respData = {};
    respData.appId = await sys_ref_db.GetSingle({
        REFNAME: 'appId'
    });
    respData.appSecret = await sys_ref_db.GetSingle({
        REFNAME: 'appSecret'
    });
    respData.token = await sys_ref_db.GetSingle({
        REFNAME: 'token'
    });
    respData.redirect_url = await sys_ref_db.GetSingle({
        REFNAME: 'redirect_url'
    });
    rams: params

    return respData;
}
/** 统一下单 */
exports.L5003 = async (reqData) => {
    let db = require('../DbLib/Ims/Ims_Pay_DB')
    let dateUtil = require('../Libs/date-utils')
    console.log('5003', reqData)
    /**交易前先保存一条记录 */
    let payid = 0;
    let model = {};
    let orderCode = ""; //商户订单号
    let yy1000Resp = {};
    let transDataStr = ''; //发往His的业务数据
    let transData = {};
    let pospModel = {} //发往前置数据
    transData.hosCardNo = reqData.hosCardNo;
    transData.hosCardType = reqData.hosCardType; //卡类型 是 1 院内就诊卡    2 院内电子就诊卡    3 甘肃电子就诊卡
    transData.hosCardFrom = reqData.hosCardFrom; //卡来源 是 0 实体就诊卡    1 电子就诊卡
    const YY1000 = require('../service/pospTrans/YY1000') //引入前置
    let yy1000 = new YY1000();

    switch (reqData.busCode) {
        case '01':
            transData.deptId = reqData.deptId; //科室 ID 是 参看接口 1005
            transData.doctorId = reqData.doctorId; // 医生 Id 是 参看接口 1005,当为普通号时， ID 为    空
            transData.typeId = reqData.typeId; //挂号类别 ID 是 参看接口 1004    
            transData.schedulingSequenceNum = reqData.schedulingSequenceNum; // 值班类别 是 1 上午    2 下午
            transData.registerTotalFee = reqData.total_fee;
            transData.feeList = reqData.feeList; // 挂号费用明细 是 每个医院的挂号费用项各不相同    见示例

            pospModel.bussType = '当日挂号'; //	业务类型	是	业务类型 签约办卡 预约挂号取号  自助挂号  门诊充值缴费 住院预交金缴费 处方缴费
            yy1000Resp = await yy1000.execute({
                bussType: "门诊",
                bussName: "当日挂号"
            }) //发送到前置
            orderCode = yy1000Resp.pospOrderNo;
            break
        case '04':
            transData.deptId = reqData.deptId; //科室 ID 是 参看接口 1005
            transData.doctorId = reqData.doctorId; // 医生 Id 是 参看接口 1005,当为普通号时， ID 为    空
            transData.typeId = reqData.typeId; //挂号类别 ID 是 参看接口 1004    
            transData.schedulingSequenceNum = reqData.schedulingSequenceNum; // 值班类别 是 1 上午    2 下午
            transData.registerTotalFee = reqData.total_fee;
            transData.feeList = reqData.feeList; // 挂号费用明细 是 每个医院的挂号费用项各不相同    见示例
            transData.registerDate = reqData.registerDate; // 预约日期 是 yyyymmdd
            transData.TranFlow = reqData.TranFlow; //预约挂号 ID 是 3002 交易参数获得
            pospModel.bussType = '预约挂号'; //	业务类型	是	业务类型 签约办卡 预约挂号取号  自助挂号  门诊充值缴费 住院预交金缴费 处方缴费
            yy1000Resp = await yy1000.execute({
                bussType: "门诊",
                bussName: "预约挂号"
            }) //发送到前置
            orderCode = yy1000Resp.pospOrderNo;
            break
        case '02':
            transData.prescriptionNos = reqData.prescriptionNos //缴费处方号 是 ID1|ID2|....        处方编号|类型(参照 1019 交易)
            pospModel.thirdOrderNo = reqData.prescriptionNos; //发送Posp 第三方单号
            transData.prescriptionsAmount = reqData.prescriptionsAmount //缴费处方总金额 是
            transData.payAmount = reqData.payAmount //实际支付金额 
            pospModel.bussType = '门诊缴费'; //	业务类型	是	业务类型 签约办卡 预约挂号取号  自助挂号  门诊充值缴费 住院预交金缴费 处方缴费
            yy1000Resp = await yy1000.execute({
                bussType: "门诊",
                bussName: "门诊缴费"
            })
            orderCode = yy1000Resp.pospOrderNo;
            break
        case '03':
            transData.inHosNo = reqData.inHosNo; //住院 id

            transData.rechargeAmount = reqData.rechargeAmount; // 充值金额  
            transData.payMethod = '04'; //支付方式 是 01银行卡                02 就诊卡账户                03 现金                04 微信                05 支付宝
            pospModel.bussType = '住院充值'; //	业务类型	是	业务类型 签约办卡 预约挂号取号  自助挂号  门诊充值缴费 住院预交金缴费 处方缴费
            yy1000Resp = await yy1000.execute({
                bussType: "住院",
                bussName: "住院充值"
            })
            orderCode = yy1000Resp.pospOrderNo;
            break
    }




    transData.amount = Number(reqData.total_fee);

    transDataStr = JSON.stringify(transData)
    console.log('transDataStr=================', transDataStr);
    reqData.body = reqData.body;
    //交易前保存数据库数据
    model.openid = reqData.openid;
    model.name = reqData.name;
    model.hosCardNo = reqData.hosCardNo;
    model.amount = Number(reqData.total_fee);
    model.busCode = reqData.busCode
    model.payMode = reqData.payMode;
    model.transState = 0;
    model.createDate = new Date();
    model.transDataStr = transDataStr;
    model.patientId = reqData.patientId;
    let result = await db.add(model);
    if (result.affectedRows > 0) {
        payid = result.insertId.toString()
    } else {
        throw new Error('交易失败,请与管理员联系')
    }
    model.orderCode = orderCode;


    //通知微信下统一支付订单
    let respData = {}
    respData.payid = payid;
    if (Number(reqData.total_fee) > 0) {
        const WxPay = require('../wechat/wxPay')
        let wxpay = new WxPay()
        imsLogger.info('准备退款参数', reqData)
        respData = await wxpay.unifiedorder(reqData.openid, payid, reqData.body, orderCode, reqData.total_fee)
        imsLogger.info('统一支付参数', respData)
        model = {};
        model.orderCode = orderCode;
        model.prepay_id = respData.prepay_id;
        result = await db.update(model, payid);
        respData.orderCode = orderCode;
        respData.openid = reqData.openid

    } else {
        respData.orderCode = orderCode;
        respData.openid = reqData.openid

    }
    /// 发往前置数据
    pospModel.transType = '1'; //	交易类型	是	1 正交易 2 反交易 
    pospModel.rejectNo = ''; //退款订单号	否	终端上送，规则：R+终端号+yyyyMMddHHmmss
    pospModel.pospOrderNo = orderCode; //'w' +dateUtil.Format(new Date(), 'yyyyMMddhhmmss')+reqData.patientId; //	前置订单号	是	终端上送，规则：P+终端号+yyyyMMddHHmmss
    pospModel.merchantOrderNo = orderCode;

    pospModel.thirdCusName = reqData.name; //	第三方用户名	否	用于对账文件
    pospModel.thirdCusTelNo = reqData.phone; //	第三方电话号码	否	用于对账文件
    pospModel.thirdCusId = reqData.patientId; //	第三方用户ID		用于对账文件，例如病人ID
    pospModel.thirdCusIDNum = reqData.certNo; //	第三方用户身份证号		用于对账文件
    pospModel.thirdCusSex = reqData.sex; //	第三方用户性别		详见附录二
    pospModel.thirdCusNo = reqData.hosCardNo; //	第三方用户号	是	比如就诊卡号  住院号等
    pospModel.cusAccNo = reqData.openid; //支付账号	是	银行卡号或者微信用户的openid等
    pospModel.orderAmt = reqData.total_fee; //订单金额	是	单位：元 73.00  消费时，订单金额，退款时，原交易订单金额
    pospModel.rejectAmt = ''; //退款金额	否	单位：元 73.00  退款时必输
    pospModel.oldSystemRefNo = ''; //原交易系统检索号	否	退款时，必输
    pospModel.oldTradeDate = ''; //原交易日期	否	退款时，必输 
    pospModel.oldTradeDate = ''; //原交易日期	否	退款时，必输 
    pospModel.payModel = "02";
    pospModel.batchNo = "";
    pospModel.traceNo = "";

    const ty1001 = require('../service/pospTrans/TY1001') //引入前置
    let ty = new ty1001();
    await ty.execute(pospModel) //发送到前置
    await db.update({
        pospSend_str: ty._pospSend_str
    }, payid)

    return respData;
}
/**
 * 订单查询
 */
exports.L5004 = async (reqData) => {
    const WxPay = require('../wechat/wxPay')
    let wxpay = new WxPay()
    let respData = await wxpay.orderquery(reqData.trade_no)
    imsLogger.info(respData);
    return respData;
}
/**
 * 关闭订单
 */
exports.L5005 = async (reqData) => {

    const WxPay = require('../wechat/wxPay')
    let wxpay = new WxPay()
    let respData = await wxpay.closeOrder(reqData.trade_no)
    return respData;

}
/**
 * 退款 orderCode refundFee
 */
exports.L5006 = async (reqData) => {
    imsLogger.info('退款参数', reqData)
    return new Promise(async (resolve, reject) => {
        try {
            let model = {
                orderCode: reqData.orderCode
            };
            const paydb = require('../DbLib/Ims/Ims_Pay_DB')
            const dateUtil = require('../Libs/date-utils')
            let record = await paydb.getSingleById(model) //查询原订单


            let refund_no = 'WTR' + dateUtil.Format(new Date(), 'yyyyMMddhhmmssS');
            /**退款交易前通知Posp */
            let pospSrc = JSON.parse(record.pospSend_str);

            pospSrc.transType = 2
            pospSrc.rejectNo = refund_no;
            pospSrc.rejectAmt = reqData.refundFee;
            pospSrc.oldTradeDate = pospSrc.tradeDate;
            const ty1001 = require('../service/pospTrans/TY1001') //引入前置
            let ty01 = new ty1001();
            await ty01.execute(pospSrc) //发送到前置
            /**退款交易前通知Posp 结束*/
            /**微信退款开始 */
            reqData.transaction_id = record.prepay_id;
            reqData.out_trade_no = record.orderCode;
            reqData.device_info = '';
            reqData.refund_no = refund_no
            reqData.total_fee = record.amount;
            reqData.refund_fee = reqData.refundFee; //退款金额
            imsLogger.error('发生退款', reqData)
            const WxPay = require('../wechat/wxPay')
            let wxpay = new WxPay()
            let respData = await wxpay.refund(reqData.out_trade_no, reqData.refund_no, reqData.total_fee, reqData.refund_fee, reqData.refund_desc)
            imsLogger.info('【微信退款返回】', respData)
            /**微信退款结束 */
            let result = 0
            let desc = '退款成功'
            if (respData.return_code != 'SUCCESS') {
                result = 1
                desc = '退款失败'
            }
            let pospEnd = {};

            pospEnd.transType = 2; //交易类型	是	1 正交易2 反交易
            pospEnd.pospOrderNo = reqData.orderCode; //	前置订单号	是	预通知时上送的前置订单号一致
            pospEnd.merchantOrderNo = reqData.out_trade_no; //商户订单号	否	商户订单号 消费时，商户订单号，退款时，原商户订单号
            pospEnd.rejectNo = refund_no; //退款订单号	否	预通知时上送的退款订单号一致
            pospEnd.bankOrderNo = respData.transaction_id; //银行订单号	否	银行订单号
            pospEnd.systemRefNo = respData.refund_id; //系统检索号	是	系统检索号
            pospEnd.result = result; //交易结果	是	详见附录四
            pospEnd.description = desc;
            const ty1002 = require('../service/pospTrans/TY1002') //引入前置前置交易结束
            let ty02 = new ty1002();
            // await ty02.execute(pospSrc) //发送到前置
            await ty02.execute(pospEnd); //发送到前置
            /**退款结束通知Posp */
            /**更新数据库状态 */
            imsLogger.info('更新数据库状态')
            await paydb.updateRefunByorderCode(2, reqData.refund_fee, reqData.orderCode);
            // await paydb.updateRefunByorderCode({
            //     transState: 2,
            //     refundFee: reqData.refund_fee
            // }, reqData.orderCode); //更新数据
            resolve(respData);
        } catch (err) {
            reject(err)
        }
    });
}
/**
 * 退款查询
 */
exports.L5007 = async (reqData) => {

    const WxPay = require('../wechat/wxPay')
    let wxpay = new WxPay()
    let respData = wxpay.refundQuery(reqData.transaction_id, reqData.out_trade_no, reqData.device_info, reqData.refund_no, reqData.refund_id)
    return respData;
}
/**
 * 支付完成通知后端更改状态
 */
exports.L5008 = async (reqData) => {
    let db = require('../DbLib/Ims/Ims_Pay_DB')
    let model = {};
    model.payResult = reqData.payResult;
    model.payResultCh = respData.payResultCh;
    model.payInfo = respData.payInfo;
    result = await db.updateByorderCode(model, req.orderCode);
}
//从数据库中获取Hos交易结果值，需要反显示给客户
exports.L7001 = async (reqData) => {

    let db = require('../DbLib/Ims/Ims_Pay_DB')
    return new Promise((resolve, reject) => {
        let times = 0;
        let timerIndex = setInterval(async () => {
            times++;
            if (times < 120) {

                let model = {
                    orderCode: reqData.orderCode
                };
                imsLogger.info('查询用户交易记录', model)
                let result = await db.getSingleById(model);
                imsLogger.info('查询结果', result)
                if (result.transState > 0 && result.hosTransResult != null) {
                    let record = result.hosTransResult;
                    clearInterval(timerIndex)
                    if (result.transState == 4) {
                        reject(JSON.parse(record).responseHead.retMsg)
                    } else {
                        resolve(JSON.parse(record))
                    }


                } else {
                    imsLogger.info('还没查询到结果----', result)
                }

            } else {

                clearInterval(timerIndex)
                reject("无法查询到交易记录+++")
            }

        }, 500);

    });


}