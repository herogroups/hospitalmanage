const util = require('../Libs/util')
const path = require('path')
 
const wechat_file = path.join(__dirname, './wechat.txt'); 
 

module.exports =  {
    db: {
        DATABASE: 'jchospital',
        USERNAME: 'root',
        PASSWORD: 'landicorp',
        PORT: '3306',
        HOST: '39.105.45.22',
    },  
    
    posp: {
        FinancePospIp: '125.75.154.30',
        FinancePospPort: '12001',
        BankHosPospIp: '125.75.154.30',
        BankHosPospPort: '12011',
        hosCode: '',
        tradeSrc: '',
        terminalNo: 'D62100000528',
        winNo: 'R832',
        SysTemNo: '3003',
        FenHangNo: '6200',
        operNo: '9AEKR832',
        guiYuanHao: 'AEKR832',
    }, //微信公众号
    weichat: {
        token: 'landicorp',
        KEY: '',
        appId: 'wxd836ab5f29d424a0',
        appSecret: 'd90b17cdfb2d5abe66b31eddad0ef87',
        notify_url:'',
        hosNetUrl: '',
        hosWelcomeMsg: '',
        redirect_url: '',
        MCHID:''
    },
    IcbcPosp:{
        Ip:'39.105.45.22',
        Port:'12002'
    },
    weibill: { //微信账单
        wxBillHost: '',
        wxBillPort: '',
        wxBillUser: '',
        wxBillPassword: ''
    },

    eHealthPosp: { //电子健康卡
        HealthPospIp: '',
        HealthPospPort: '',
        hosServiceUrl: '',
    },
    hosp:{
        doctorImageUrl:"",
    },
    jwtKey:"",
    getAccessToken() {
        return util.readFileAsync(wechat_file, 'utf-8');
    },
    saveAccessToken(data) {
        return util.writeFileAsync(wechat_file, data);
    }
 
};