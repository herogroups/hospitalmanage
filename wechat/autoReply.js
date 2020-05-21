var createXML = require('./createXML');
const _config = require('../conf/config')
async function autoReply(message) {
    console.log('message.MsgType ', message)
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫码进入');
            }

            return Promise.resolve(createXML({
                ToUserName: message.FromUserName,
                FromUserName: message.ToUserName,
                MsgType: 'text',
                Content:_config.weichat.hosWelcomeMsg
            }));
        } else if (message.Event === 'unsubscribe') {
            console.log('取消关注');
            return Promise.resolve('');
        }
        if (message.Event === 'CLICK') {


            let EventKey = message.Eventkey; //客户端点击click时按键
            //查询数据库
            return Promise.resolve(createXML({
                ToUserName: message.FromUserName,
                FromUserName: message.ToUserName,
                MsgType: 'news',
                Articles: [{
                    Title: '张璀测试222222222222',
                    Description: '图文消息描述',
                    PicUrl: 'http://f10.baidu.com/it/u=3038573891,4200009349&fm=72',
                    Url: 'http://www.baidu.com'
                }, {
                    Title: '张璀测试2222227978987907907890790789079078907222',
                    Description: '图文消息描述2222222222',
                    PicUrl: 'http://f10.baidu.com/it/u=3038573891,4200009349&fm=72',
                    Url: 'http://www.baidu.com'
                }, {
                    Title: '张璀测试2222227907890790789079078907222',
                    Description: '图文消息描述222iououi2222222',
                    PicUrl: 'http://f10.baidu.com/it/u=3038573891,4200009349&fm=72',
                    Url: 'http://www.baidu.com'
                }]
            }));
        }
    } else if (message.MsgType === 'text') {
        var content = message.Content;
        console.log('content', message.Content)
        if (content === '1') {
            return Promise.resolve(createXML({
                ToUserName: message.FromUserName,
                FromUserName: message.ToUserName,
                MsgType: 'text',
                Content:_config.weichat.hosWelcomeMsg
            }));
        } else if (content === '2') {
            return Promise.resolve(createXML({
                ToUserName: message.FromUserName,
                FromUserName: message.ToUserName,
                MsgType: 'news',
                Articles: [{
                        Title: '张璀测试222222222222',
                        Description: '图文消息描述',
                        PicUrl: 'http://f10.baidu.com/it/u=3038573891,4200009349&fm=72',
                        Url: 'http://www.baidu.com'
                    },
                    {
                        Title: '张璀测试222222222',
                        Description: '图文消息描述2222222222',
                        PicUrl: 'http://f10.baidu.com/it/u=3038573891,4200009349&fm=72',
                        Url: 'http://www.baidu.com'
                    }
                ]
            }));
        } else {

            return Promise.resolve(createXML({
                ToUserName: message.FromUserName,
                FromUserName: message.ToUserName,
                MsgType: 'text',
                Content:_config.weichat.hosWelcomeMsg
            }));
        }
    }

}
exports.autoReply = autoReply;