const router = require('koa-router')()
const { payNotice } = require('../Libs/logger')
router.prefix('/payResult')
router.post('/', async (ctx, next) => {
    console.log('-------------------------payresult--------------------------------------------------------')
    console.log(ctx.request.body);
    console.log('-------------------------payresult end --------------------------------------------------------')
    console.log(ctx.request.header)

    ctx.body = {ok:'00'};
    // let buf = ''
    // ctx.req.setEncoding('utf8')
    // ctx.req.on('data', (chunk) => {
    //     buf += chunk
    // })
    // ctx.req.on('end', async () => {
    //     const util = require('../Libs/util')
    //     var content = await util.parseXMLAsync(buf);
    //     ctx.log.info(content)
    //     await PayedDoWith(ctx, content); 
     

    // })
});
router.get('/', async (ctx, next) => {
    let content = {
        xml:
        {
            appid: 'wx596b563016fa49bf',
            attach: '457',
            bank_type: 'CFT',
            cash_fee: '1',
            fee_type: 'CNY',
            is_subscribe: 'Y',
            mch_id: '1544061711',
            nonce_str: '9c0bd6280d73451f9cf705ebaade6eaa',
            openid: 'o8_qu5qEalvTvjFP29m6o_YlUvrE',
            out_trade_no: 'PWXGZH0120190919174844670011',
            result_code: 'SUCCESS',
            return_code: 'SUCCESS',
            sign: '9B8132AB4A8F80B5CDD7E60E866CF54A',
            time_end: '20190919174605',
            total_fee: '1',
            trade_type: 'JSAPI',
            transaction_id: '4200000410201909190573108973'
        }
    }



    await PayedDoWith(ctx, content);

    ctx.body = {
        msg: 'ok'
    };
});
async function PayedDoWith(ctx, content) {
    let data = content.xml
    await PayTrans(data);
}
async function PayTrans(reqData) {
    payNotice.info('支付入口参数', reqData)
    const paydb = require('../DbLib/Ims/Ims_Pay_DB')
    const util = require('../Libs/util')
    const {
        L5004
    } = require('../service/HosGzhClient');

    const {
        H1008,
        H3003,
        H1021,
        H1023,
        H2001
    } = require('../service/hosPack');

    let orderCode = reqData.out_trade_no;

    let res = {}; //交易Hos 交易返回定义 
    let data = {}; //微信查询订单返回数据
    let model = {
        orderCode: orderCode,
        openid: reqData.openid
    };
    payNotice.info('第一步 查询后台订单状态', model);
    let record = await paydb.getSingle(model) //查询原订单

    //如果发现状态为1 不往下后 退出 因该交易已经处理过了
    if (record == null || record.transState == "1") {
        console.log('找不到原始订单或者订单已处理过了', record);
        return;
    }
    reqData.trade_no = orderCode;
    payNotice.info('第二步 查询微信平台的订单', reqData);
    data = await L5004(reqData).catch((err) => {
        //订单状态不正常退出，不再往下执行
        return;
    }) //查询微信支付
    payInfo = JSON.stringify(data)

    let hosData = JSON.parse(record.transDataStr); //
    payNotice.info('第三步 向前置发送1002 交易', reqData, data);
    await ty1002Posp(reqData, data)

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

    let resultNoticeData = { bussResult: '0', description: '成功', pospOrderNo: orderCode }//结果通知

    //为退款预备数据发送到His不成功则采取退款
    let refundData = { orderCode: orderCode, refundFee: hosData.payAmount };

    payNotice.info('第四步 向His 发送充值交易', hosData);
    switch (record.busCode) {
        case '01':
            if (Number(hosData.payAmount) > 0) {

                await H1023(hosData).catch(async (err) => {

                    resultNoticeData.bussResult = '1';
                    resultNoticeData.description = '失败 / 中止'
                    await noticePosp(resultNoticeData, refundData);

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


            break;
        case '02': //门诊缴费

           await H1023(hosData).catch(async (err) => {
                //  await L5006(refundData);//发到Hos异常退款
                payNotice.info('门诊缴费出现异常退款', refundData);
                resultNoticeData.bussResult = '1';
                resultNoticeData.description = '失败 / 中止'
                await noticePosp(resultNoticeData, refundData);
                // await yy9991.execute(resultNoticeData) //发送到前置
                throw new Error(err.message)
            }) // 发送到HOs系统//处方缴费 发送到HOs系统

            
            break;
        case '03':

            res = await H2001(hosData).catch(async (err) => {
                payNotice.info('【住院充值】失败', err)
                resultNoticeData.bussResult = '1';
                resultNoticeData.description = '失败 / 中止'
                await noticePosp(resultNoticeData, refundData);

                throw new Error(err.message)
            }) // 发送到HOs系统
            payNotice.info('住院预交金H2001返回',res,'------------------',record);
            break;
    }
    payNotice.info('第五步 向前置发送充值结果', resultNoticeData, refundData);
    await noticePosp(resultNoticeData, refundData) //交款后 通知 Posp

    umodel = {
        payResultCh: JSON.stringify(res),
        transState: 1,
        receiptNo: res.receiptNo,
        payResult: data.return_code,
        payInfo: payInfo,
    }
    res.amount = hosData.amount;
    payNotice.info('第六步 更改后台状态', umodel, orderCode);
    await paydb.updateByorderCode(umodel, orderCode)
    payNotice.info('第完成充值成功，该挂号充值或缴费');

    let transResult = "";
    let transState = 1;//正常充值医院数据正常为1 如果其中接下去发往医院信息无法执行状态为4 
    switch (record.busCode) {
        case '01': {
            res = await H1008(hosData).catch((err) => {
                transState = 4;
                payNotice.info('挂号失败，返回错误', err);
                return err
            })

            break;

        }
        case '02': {
            res = await H1021(hosData).catch((err) => {
                transState = 4;
                payNotice.info('处方缴费失败，返回错误', err);
                return err
            })
            break;


        }
        case '04': { //
            res = await H3003(hosData).catch((err) => {
                transState = 4;
                payNotice.info('预约挂号失败，返回错误', err);
                return err
            })
            break;
        }
    }
    payNotice.info('结果保存前', res, orderCode);
    transResult = JSON.stringify(res)

    payNotice.info('交易结果保存状态', transResult, orderCode);
    await paydb.updateByorderCode({ hosTransResult: transResult, transState: transState }, orderCode)
}
async function ty1002Posp(reqData, data) {
    console.log('ty1002Posp', reqData, data);
    let pospModel = {}; //前置数据

    pospModel.transType = 1; //交易类型	是	1 正交易2 反交易
    pospModel.pospOrderNo = reqData.out_trade_no; //	前置订单号	是	预通知时上送的前置订单号一致
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
    payNotice.info('通知数据', resultNoticeData);
    const { L5006 } = require('../service/HosGzhClient');
    if (resultNoticeData.bussResult == '1') { //缴费出现异常退款
        payNotice.info('现异常退款：', refundData);
        await L5006(refundData) //发到Hos异常退款
    }
    const YY9991 = require('../service/pospTrans/YY9991') //引入前置结果通知
    let yy9991 = new YY9991();
    await yy9991.execute(resultNoticeData).catch(async (error) => {
        await L5006(refundData);//发到Hos异常退款
        throw new Error(error.message)
    }) //发送到前置
}
module.exports = router