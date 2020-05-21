const router = require('koa-router')()
const hosPack = require('../service/hosPack')
var _config =require('../conf/config')
const http = require('../Libs/http')
const {
    imsLogger
} = require('../Libs/logger')
router.prefix('/gzhApi')

router.post('/', async (ctx, next) => {

    let req = ctx.request.body;

//     console.log('ctx.request', ctx.request);

//     let IcbcPayHelper = require('../Libs/IcbcPayHelper')

//     let payHelper = new IcbcPayHelper("AAT_REMIND");
//     let content = {
//         openid: '233333333333333333',
//         subject: '芬达',
//         goods_detail: "{good_name’:芬达橙味300ml罐装’,’good_id’:’1001’,’good_num’:’1’}",
//         outTradeNo: '00000000001',
//         totalAmount: '1',
//         attach: '',
//         spbill_create_ip: req.host,
//     }
//     let obj = payHelper.buildParams(content);
//     let http = require('../Libs/http')
//    //let url ='https://gw.open.icbc.com.cn/api/qrcode/V2/generate';
//     let url='http://localhost:9000/payResult';
//     let resp = await http.httpRequest(url,obj)
//     console.log('resp:',resp);



   
//     imsLogger.info('---------------------------------------------------');
//     imsLogger.info(JSON.stringify(req))
    let response = {};
    let heads = {};
    let data = {};
    heads.busCode = req.requestHead.busCode;
    heads.busName = req.requestHead.busName;
    let code = heads.busCode;
    ctx.log.info(req);
    try {
        switch (code) {
            case 'H0001': { //获取公众号参数

                data.appid = _config.weichat.appId;
                const {
                    L2002
                } = require('../service/HosGzhClient');
 
                let aList = [];
                aList = await L2002({
                    subTypeCode: '006'
                }).catch((err) => {
                    imsLogger.info(JSON.stringify(err))
                })
                console.log('aList=============================', ctx.request.host);
                data.homeImg = aList
                data.urlHost = ctx.request.host;
                break;
            }
            case 'H0002': { //获取OPenId/以及头像
                data = await hosPack.H0002(req.data);
                break;
            }
            case 'H0010': { //修改默认绑定值
                data = await hosPack.H0010(req.data);
                break;
            }
            case 'L0004': { //获取扫描初始化数据
                const {
                    L0004
                } = require('../service/HosGzhClient');

                data = await L0004(req.data)
                break;
            }

            case 'H1003': { //获取挂号类别
                data = await hosPack.H1003();
                break;
            }
            case 'H1000': { //解除注册绑定                      
                data = await hosPack.H1000(req.data);
                break;
            }
            case 'H1001': { //签约办卡                      
                data = await hosPack.H1001(req.data);
                break;
            }
            case 'H1006': { //查询该用户绑定的所有卡片信息                     
                data = await hosPack.H1006(req.data);
                break;
            }
            case 'H1007': { //一键绑定                     
                data = await hosPack.H1007(req.data);
                break;
            }
            case 'H1002': { //个人信息查询   

                if (req.data.hosCardNo.length < 20) {
                    req.data.hosCardType = 1; //卡类型 是 1 院内就诊卡2 院内电子就诊卡3 甘肃电子就诊卡
                } else {
                    req.data.hosCardType = 3;
                }
                let nextdata = "";
                data = await hosPack.H1002(req.data).catch(async (error) => {
                    console.log('', error);
                    req.data.hosCardType = 3;
                    nextdata = await hosPack.H1002(req.data)
                    console.log('nextdata', nextdata);
                });
                data = (data == undefined) ? nextdata : data
                console.log('data=', data);
                break;
            }
            //修改持卡人用户信息
            case 'H4005': { //修改持卡人用户信息
                data = await hosPack.H4005(req.data);
                break;
            }
            case 'H1004': { //获取科室信息
                data = await hosPack.H1004(req.data);
                break;
            }
            case 'H1005': { //科室获取医生列表
                data = await hosPack.H1005(req.data);
                break;
            }
            case 'H1008': {

                if (req.data.payStatus == "payed") {

                    const {
                        L7001
                    } = require('../service/HosGzhClient');
                    data = await L7001(req.data).catch((err) => {
                        imsLogger.info('当日挂号33', err)
                        throw new Error(err);
                    });
                } else {
                    imsLogger.info(JSON.stringify(req.data))
                    data = await hosPack.H1008(req.data);
                }

                console.log('H1008')

                break;

            }
            case 'H3001': { //查询预约挂号排班医生
                data = await hosPack.H3001(req.data);
                break;
            }
            case 'H3002': { //查询分时段预约排班医生号源
                data = await hosPack.H3002(req.data);
                break;
            }
            case 'H3003': { //预约挂号

                if (req.data.payStatus == "payed") {
                    console.log(req.data)
                    const {
                        L7001
                    } = require('../service/HosGzhClient');
                    data = await L7001(req.data).catch((err) => {
                        throw new Error(err);
                    });
                } else {

                    data = await hosPack.H3003(req.data).catch((err) => {
                        if (err.responseHead.retMsg != undefined) {
                            throw new Error(err.responseHead.retMsg);
                        } else {
                            throw new Error('通讯异常');
                        }
                    });
                }
                console.log('结束3003')

                break;
            }
            case 'H3004': { //预约挂号
                data = await hosPack.H3004(req.data);
                break;
            }

            case 'H1019': { //待缴费查询
                data = await hosPack.H1019(req.data);
                break;
            }
            case 'H1020': { //待缴费明细
                data = await hosPack.H1020(req.data);
                break;
            }
            case 'H1032': { //挂号记录查询
                data = await hosPack.H1032(req.data);
                break;
            }
            case 'H1021': { //处方缴费

                const {
                    L7001
                } = require('../service/HosGzhClient');
                data = await L7001(req.data).catch((err) => {
                    throw new Error(err);

                });
                break
            }
            case 'H1033': { //已交处方明细
                data = await hosPack.H1033(req.data);
                break;
            }
            case 'H1034': { //门诊已缴费明细
                data = await hosPack.H1034(req.data);
                break;
            }
            case 'H10341': { //门诊已缴费明细
                data = await hosPack.H10341(req.data);
                break;
            }

            case 'H1026': { //报告单查询
                data = await hosPack.H1026(req.data);
                break;
            }
            case 'H1027': { //报告单明细
                data = await hosPack.H1027(req.data);
                break;
            }
            case 'H2001': { //住院预交金充值
                // data = await PayTrans(req.data);
                const {
                    L7001
                } = require('../service/HosGzhClient');
                data = await L7001(req.data).catch((err) => {
                    throw new Error(err);
                });
                break
            }
            case 'H2002': { //住院一日清单查询
                data = await hosPack.H2002(req.data);
                break;
            }
            case 'H2003': { //在院病人信息查询
                data = await hosPack.H2003(req.data);
                break;
            }
            case 'H2004': { //预交金记录查询
                data = await hosPack.H2004(req.data);
                break;
            }
            case 'H2005': { //住院病人入院记录
                data = await hosPack.H2005(req.data);
                break;
            }

            case 'L0005': { //保存用户信息列表
                const {
                    L0005
                } = require('../service/HosGzhClient');
                data = await L0005(req.data)
                break;
            }
            case 'L3001': { //科室列表
                const {
                    L3001
                } = require('../service/HosGzhClient');
                data = await L3001(reqData)
                break;
            }
            case 'L3002': { //医生列表
                const {
                    L3002
                } = require('../service/HosGzhClient');
                data = await L3002(req.data)
                break;
            }
            case 'L2002': { //文章列表
                const {
                    L2002
                } = require('../service/HosGzhClient');
                data = await L2002(req.data)
                break;
            }
            case 'L2012': { //文章内容
                const {
                    L2012
                } = require('../service/HosGzhClient');
                data = await L2012(req.data)
                break;
            }
            case 'L0006': { //文章内容
                const {
                    L0006
                } = require('../service/HosGzhClient');
                data = await L0006(req.data)
                break;
            }

            case 'L5001': { //获取配置
                const {
                    L5001
                } = require('../service/HosGzhClient');
                data = await L5001(req.data)
                break;
            }

            case 'L5003': { //微信统一下单

                const {
                    L5003
                } = require('../service/HosGzhClient');

                data = await L5003(req.data)

                break;
            }
            case 'L5004': { //微信订单查询

                const {
                    L5004
                } = require('../service/HosGzhClient');
                data = await L5004(req.data)
                break;
            }
            case 'L5005': { //微信订单关闭
                const {
                    L5005
                } = require('../service/HosGzhClient');
                data = await L5005(req.data)
                break;
            }
            case 'L5006': { //退款
                const {
                    L5006
                } = require('../service/HosGzhClient');
                data = await L5006(req.data)
                break;
            }
            case 'L5007': { //退款查询
                const {
                    L5007
                } = require('../service/HosGzhClient');
                data = await L5007(req.data)
                break;
            }
            case 'L5008': { //支付完成通知后端更改状态
                const {
                    L5008
                } = require('../service/HosGzhClient');
                data = await L5008(req.data)
                break;
            }

            case 'L5010': { //测试微信公众号
                const package = require('../Finance/package')
                let financeTrans = new package();
                data = await financeTrans.exec(ctx.conf)
                break;
            }
            case 'ocrInfo': {
                data = await hosPack.ocrInfo(req.data);
                break;
            }
            case 'getOrderIdByOutAppId': {
                data = await hosPack.getOrderIdByOutAppId(req.data);
                break;
            }
            case 'getHealthCardList': {
                data = await hosPack.getHealthCardList(req.data);
                break;
            }

            default: {
                throw new Error('交易类型不正确')
            }
        }
        heads.retCode = '00';
        heads.retMsg = '成功';
    } catch (err) {
        imsLogger.error(err)
        console.log(err)
        heads.retCode = '01';
        heads.retMsg = err.message;
    } finally {
        response.responseHead = heads;
        response.data = data;
        console.log(JSON.stringify(response));
        imsLogger.info(JSON.stringify(response))
        ctx.body = response;


    }
})

async function PayTrans(reqData) {
    imsLogger.info('支付入口参数', reqData)
    console.log('支付入口参数', reqData);
    const {
        L5004
    } = require('../service/HosGzhClient');
    let orderCode = reqData.orderCode
    imsLogger.info('订单号：', orderCode)
    let res = {}; //交易Hos 交易返回定义

    let data = {}; //微信查询订单返回数据
    let model = {
        orderCode: orderCode,
        openid: reqData.openid
    };
    reqData.trade_no = orderCode;

    imsLogger.info('微信查询订单：L5004', reqData)
    data = await L5004(reqData) //查询微信支付
    payInfo = JSON.stringify(data)
    const paydb = require('../DbLib/Ims/Ims_Pay_DB')
    imsLogger.info('从数据查询统一支付前数据', model)
    let record = await paydb.getSingle(model) //查询原订单
    imsLogger.info('原订单数据：', record)
    let hosData = JSON.parse(record.transDataStr); //
    await ty1002Posp(reqData, data)
    //  const YY9991 = require('../service/pospTrans/YY9991') //引入前置结果通知
    //  let yy9991 = new YY9991();
    const {
        H1008,
        H3003,

        H1021,
        H1023,
        H2001
    } = require('../service/hosPack');
    const util = require('../Libs/util')
    //  const { L5006 } = require('../service/HosGzhClient');
    hosData.payMethod = '04'; //01 银行卡    03 现金    04 微信    05 支付宝
    hosData.payInfo = {
        weChatPayInfo: {
            orderNum: data.transaction_id, //微信支付订单号
            merchantOrderNum: data.out_trade_no, //商户订单号
            amount: hosData.amount, //交易金额
            appid: data.appid, //微信账号 id
            mch_id: data.mch_id, //商户号
            paymentDate: util.dateFtt('yyyyMMdd', new Date()), //data.time_end.substr(0, 8), //交易日期
            paymentTime: util.dateFtt('hhmmss', new Date()) //data.time_end.substr(8, 4) //交易时间

        }
    }
    hosData.payAmount = hosData.amount;
    hosData.pospOrderNo = orderCode;

    let resultNoticeData = {
        bussResult: '0',
        description: '成功',
        pospOrderNo: orderCode
    } //结果通知



    //为退款预备数据发送到His不成功则采取退款
    let refundData = {
        orderCode: orderCode,
        refundFee: hosData.payAmount
    };


    switch (record.busCode) {
        case '01':
            if (Number(hosData.payAmount) > 0) {
                await H1023(hosData).catch(async (err) => {
                    // await L5006(refundData)//发到Hos异常退款
                    resultNoticeData.bussResult = '1';
                    resultNoticeData.description = '失败 / 中止'
                    await noticePosp(resultNoticeData, refundData);
                    // await yy9991.execute(resultNoticeData) //发送到前置
                    // imsLogger.info('挂号出现异常退款', refundData);
                    throw new Error(err.message)
                }); // 发送到HOs系统 //当日挂号 发送到HOs系统 //预交金充值 
            }
            //  res = await H1008(hosData)
            break;
        case '04': //预约挂号
            if (Number(hosData.payAmount) > 0) {
                await H1023(hosData).catch(async (err) => {

                    resultNoticeData.bussResult = '1';
                    resultNoticeData.description = '失败 / 中止'
                    await noticePosp(resultNoticeData, refundData);

                    throw new Error(err.message)
                }); // 发送到HOs系统 //当日挂号 发送到HOs系统 //预交金充值 
            }
            // res = await H3003(hosData).catch((err) => {
            //     throw new Error(err.message)
            // });

            break;
        case '02': //门诊缴费

            await H1023(hosData).catch(async (err) => {
                //  await L5006(refundData);//发到Hos异常退款
                imsLogger.info('门诊缴费出现异常退款', refundData);
                resultNoticeData.bussResult = '1';
                resultNoticeData.description = '失败 / 中止'
                await noticePosp(resultNoticeData, refundData);
                // await yy9991.execute(resultNoticeData) //发送到前置
                throw new Error(err.message)
            }) // 发送到HOs系统//处方缴费 发送到HOs系统

            res = await H1021(hosData)
            break;
        case '03':
            res = await H2001(hosData).catch(async (err) => {
                imsLogger.info('【住院充值】失败', err)
                // await L5006(refundData) //发到Hos异常退款
                resultNoticeData.bussResult = '1';
                resultNoticeData.description = '失败 / 中止'
                await noticePosp(resultNoticeData, refundData);
                //  await yy9991.execute(resultNoticeData) //发送到前置

                throw new Error(err.message)
            }) // 发送到HOs系统
            break;
    }
    await noticePosp(resultNoticeData, refundData) //交款后 通知 Posp
    //await yy9991.execute(resultNoticeData) //发送到前置

    // await L5006(refundData);
    umodel = {
        payResultCh: JSON.stringify(res),
        transState: 1,
        receiptNo: res.receiptNo,
        payResult: data.return_code,
        payInfo: payInfo,
    }
    res.amount = hosData.amount;
    await paydb.updateByorderCode(umodel, orderCode)
    return res;
}
async function ty1002Posp(reqData, data) {
    let pospModel = {}; //前置数据

    pospModel.transType = 1; //交易类型	是	1 正交易2 反交易
    pospModel.pospOrderNo = reqData.orderCode; //	前置订单号	是	预通知时上送的前置订单号一致
    pospModel.merchantOrderNo = data.out_trade_no; //商户订单号	否	商户订单号 消费时，商户订单号，退款时，原商户订单号
    pospModel.rejectNo = ''; //退款订单号	否	预通知时上送的退款订单号一致
    pospModel.bankOrderNo = data.transaction_id; //银行订单号	否	银行订单号
    pospModel.systemRefNo = data.transaction_id; //系统检索号	是	系统检索号
    pospModel.result = "0"; //交易结果	是	详见附录四
    pospModel.description = "支付成功"

    const ty1002 = require('../service/pospTrans/TY1002') //引入前置
    let ty = new ty1002();
    await ty.execute(pospModel) //发送到前置
}
async function noticePosp(resultNoticeData, refundData) {
    imsLogger.info('通知数据', resultNoticeData);
    const {
        L5006
    } = require('../service/HosGzhClient');
    if (resultNoticeData.bussResult == '1') { //缴费出现异常退款
        imsLogger.info('现异常退款：', refundData);
        await L5006(refundData) //发到Hos异常退款
    }
    const YY9991 = require('../service/pospTrans/YY9991') //引入前置结果通知
    let yy9991 = new YY9991();
    await yy9991.execute(resultNoticeData).catch(async (error) => {
        await L5006(refundData); //发到Hos异常退款
        throw new Error(error.message)
    }) //发送到前置
}
module.exports = router