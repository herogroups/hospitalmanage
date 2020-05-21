process.on('message', (m) => {
    console.log('接受到2消息', m);
    sendMessage(JSON.stringify(m));


    console.log('收到湖景村打发');
    process.send("我也发一个")

});

function sendMessage(context) {
    console.log('content', );
    wss.clients.forEach(function each(client) {
        client.send(context);
    });
}
//process.send({ foo:  'bar' });
const Koa = require('koa')
const app = new Koa()
var http = require('http');
var WebSocket = require('ws');
const sqlUtil = require('../Libs/sqlUtil')
var server = http.createServer(app);
var wss = new WebSocket.Server({
    server
});

wss.on('connection', function connection(ws) {
    console.log('链接成功！');



    setInterval(() => {
        wss.clients.forEach(async function each(client) {
            let queryData = new QueryData();
            let toDayPayMode = await queryData.TodayPayMode();
            let tCount = await queryData.TodyTransCount();
            toDayPayMode = JSON.parse(JSON.stringify(toDayPayMode))
            let data = {
                payMode: toDayPayMode,
                todayCount:tCount ,//今日从8-18点交易笔数
                ghCount:await queryData.TodayGhCount(),
                sumCount:await queryData.TodaySumCount(),
                halfYearCount:await queryData.halfYearCount(),
                departOrderCount:await queryData.departOrder(),
                sexCala: await queryData.sexCala(),
                aWeekBuss:{
                    gh:(await queryData.groupBuss("挂号")).map((item)=>{return item.value}),
                    mz:(await queryData.groupBuss("门诊缴费")).map((item)=>{return item.value}),
                    zy:(await queryData.groupBuss("住院充值")).map((item)=>{return item.value}),
                    dataY:(await queryData.groupBuss("住院充值")).map((item)=>{return item.name}),
                },
            }
            console.log('toDayPayMode', toDayPayMode);
            client.send(JSON.stringify(data));
        });
    }, 1000 * 10);

});

server.listen(4001, function listening() {
    console.log('图形查询服务启动成功！');
});


class QueryData {
    /**
     * -- 查询 当日交易笔数，及交易金额
select  count(*) counts , IFNULL(sum(PayAmount),0) amount from mis_banktransrecord where  to_days(BankTransDateTime) = to_days(now()) and PayResult not in (1,2); 
-- 查询 挂号 当日挂号量

-- 查询当日 支付方式汇总金额
select   payCodeName, count(*) counts, IFNULL(sum(PayAmount),0) amount from v_mis_banktransrecord   where  to_days(BankTransDateTime) = to_days(now())  and PayResult not in (1,2)  GROUP BY payCodeName; 
-- 查询 按业务类型查询
select   BussType, count(*) counts,IFNULL(sum(PayAmount),0) amount  from v_mis_banktransrecord where  to_days(BankTransDateTime) = to_days(now())  and PayResult not in (1,2) GROUP BY BussType; 
     * 获取数据列表
     *  {*} model 
     */
    async TodaySumCount() {
        //where  to_days(BankTransDateTime) = to_days(now()) and PayResult not in (1,2) 
        let _sql = ` select  count(*) counts , IFNULL(sum(PayAmount),0) amount from mis_banktransrecord `
        let result = await sqlUtil.query(_sql)
        return result[0];
    }

    async TodayGhCount() {

        let _sql = `select  count(*) ghcounts , IFNULL(sum(PayAmount),0) amount from mis_banktransrecord where    busstype like '%挂号%' `
        let result = await sqlUtil.query(_sql)
        return result[0];
    }
    /**
     * 当前不同支付方式获取数据
     */
    async TodayPayMode() {
        //  let _sql = `select   payCodeName, count(*) counts, IFNULL(sum(PayAmount),0) amount from v_mis_banktransrecord   where  to_days(BankTransDateTime) = to_days(now())  and PayResult not in (1,2)  GROUP BY payCodeName `
        let _sql = `select   payCodeName name, count(*) value, IFNULL(sum(PayAmount),0) amount from v_mis_banktransrecord   where   PayResult not in (1,2)   GROUP BY payCodeName HAVING name is  not null`
        let result = await sqlUtil.query(_sql)
        return result;
    }
    async sexCala(){
        let _sql = ` select    count(*) value, ThirdTransUserSex name    from mis_banktransrecord   where PayResult=0  and to_days(BankTransDateTime)- to_days(now())>-10 group by name     `
        let result = await sqlUtil.query(_sql)
        return result;
    }
    /**
     * 当前不同支付方式获取数据
     */
    async TodayTranTypeData() {
        let _sql = `select   BussType, count(*) counts,IFNULL(sum(PayAmount),0) amount  from v_mis_banktransrecord where  to_days(BankTransDateTime) = to_days(now())  and PayResult not in (1,2) GROUP BY BussType `
        let result = await sqlUtil.query(_sql)
        return result;
    }
    /**
     * 查询 今日 从8点到 18 点间交易笔数
     */
    async TodyTransCount() {

      
        // let _sql = `select ifnull(value,0) value,hours as name  from ( select  count(*) value , IFNULL(sum(PayAmount),0) amount, HOUR(BankTransDateTime) name from mis_banktransrecord   where   to_days(BankTransDateTime) = to_days(now()) and  PayResult not in (1,2)     group by name HAVING name >6 and name <19) a right JOIN  ( SELECT  @d :=@d + 1 hours
        //     FROM mis_banktransrecord,(SELECT @d := 6) temp
        //     WHERE  ADDDATE(DATE_FORMAT(now(),'%Y-%m-%d'),INTERVAL @d+1 Hour) < now()  and @d<19
        //      ) b on a.name =b.hours `
             let _sql = `select ifnull(value,0) value,hours as name  from ( select  count(*) value , IFNULL(sum(PayAmount),0) amount, HOUR(BankTransDateTime) name from mis_banktransrecord   where     PayResult not in (1,2)     group by name HAVING name >6 and name <19) a right JOIN  ( SELECT  @d :=@d + 1 hours
                FROM mis_banktransrecord,(SELECT @d := 6) temp
                WHERE  ADDDATE(DATE_FORMAT(now(),'%Y-%m-%d'),INTERVAL @d+1 Hour) < now()  and @d<19
                 ) b on a.name =b.hours `
        let result = await sqlUtil.query(_sql)
        let max = result.reduce((a, b) => {
            return (b.name > a.name) ? b : a
        });
        let arr = [];
        for (var i = 7; i <= max.name; i++) {
            let val = 0;
            for (var m = 0; m < result.length; m++) {
                if (result[m].name == i) {
                    val = result[m].value;
                    break;
                }
            }
            arr.push(val);
        }
      

        return arr;
    }
    /**
     * 近一年交易量
     */
    async halfYearCount(){
        let _sql="select   IFNULL( value,0)value, IFNULL(amount,0) amount,CONCAT(months ,'月') as name from ( select  count(*) value, IFNULL(sum(PayAmount),0) amount ,DATE_FORMAT( BankTransDateTime,'%Y-%m') name from  mis_banktransrecord where  PayResult not in (1,2)  and  DATE_FORMAT(SUBDATE(NOW() ,INTERVAL 12 month),'%Y-%m')<DATE_FORMAT(SUBDATE(NOW() ,INTERVAL 1 month),'%Y-%m')  GROUP BY name )a right join ( SELECT  @d :=@d - 1 orders ,DATE_FORMAT(SUBDATE(NOW() ,INTERVAL @d month),'%Y-%m') yearmonth, month(SUBDATE(NOW() ,INTERVAL @d month)) months         FROM mis_banktransrecord,(SELECT @d := 13) temp         WHERE SUBDATE(NOW() ,INTERVAL @d month) < SUBDATE(NOW() ,INTERVAL 1 month)  ) b on a.name=b.yearmonth"
        let result = await sqlUtil.query(_sql)
        return result
    }
    /**
     * 查询科室挂号量排行榜
     */
    async departOrder(){
        let _sql=" select  count(*) value, departmentName name from hos_registerinfo a inner join   hos_bussrecord b on a.bussid= b.bussid  where   a.registerDate    is not null GROUP BY name order by value desc limit 0,6"
        let result = await sqlUtil.query(_sql)
        return result
    }
   
    async groupBuss(busstype){
        let _sql=`  select   IFNULL( value,0)value, IFNULL(amount,0) amount,CONCAT(months ,'月') name from ( select  count(*) value, IFNULL(sum(PayAmount),0) amount ,DATE_FORMAT( BankTransDateTime,'%Y-%m') name from  mis_banktransrecord where  busstype like '%${busstype}%' and PayResult not in (1,2)  and  DATE_FORMAT(SUBDATE(NOW() ,INTERVAL 12 month),'%Y-%m')<DATE_FORMAT(SUBDATE(NOW() ,INTERVAL 1 month),'%Y-%m')  GROUP BY name )a right join ( SELECT  @d :=@d - 1 orders ,DATE_FORMAT(SUBDATE(NOW() ,INTERVAL @d month),'%Y-%m') yearmonth, month(SUBDATE(NOW() ,INTERVAL @d month)) months FROM mis_banktransrecord,(SELECT @d := 6) temp WHERE SUBDATE(NOW() ,INTERVAL @d month) < SUBDATE(NOW() ,INTERVAL 1 month)  ) b on a.name=b.yearmonth  `;
        let result = await sqlUtil.query(_sql)
        return result  
    }
}