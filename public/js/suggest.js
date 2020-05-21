var suggest ={
    Init: function(obj, bsurl, callfun) {

    $(obj).bsSuggest({
        url: bsurl,
        indexId: 0,                     //每组数据的第几个数据，作为input输入框的 data-id，设为 -1 且 idField 为空则不设置此值
        indexKey: 1,                    //每组数据的第几个数据，作为input输入框的内容
        idField: 'GOODSID',
        keyField: 'GOODSCODE',
        showBtn: true,                  //是否显示下拉按钮
        allowNoKeyword: false,           //是否允许无关键字时请求数据
        multiWord: false,               //以分隔符号分割的多关键字支持
        separator: ",",                 //多关键字支持时的分隔符，默认为半角逗号,
        showHeader: true,
        getDataMethod: "url", //获取数据的方式，总是从 URL 获取
        effectiveFields: ["GOODSCODE", "NAME", "TYPENAME", "BRANDNAME", "UNITNAME", "SPEC", "SPRICE"],
        effectiveFieldsAlias: { GOODSCODE: "货号", NAME: "品名", TYPENAME: '类别', BRANDNAME: '品牌', UNITNAME: '单位名称', SPEC: '规格', SPRICE: '售价' },
        autoMinWidth: false,            //是否自动最小宽度，设为 false 则最小宽度不小于输入框宽度
        listAlign: "left",              //提示列表对齐位置，left/right/auto
        inputWarnColor: "rgba(255,0,0,.1)", //输入框内容不是下拉列表选择时的警告色
        listStyle: {
            "padding-top": 0, "max-height": "300px", "max-width": "800px",
            "overflow": "auto", "width": "auto",
            "transition": "0.5s", "-webkit-transition": "0.5s", "-moz-transition": "0.5s", "-o-transition": "0.5s"
        },
        keyLeft: 37,                    //向左方向键
        keyUp: 38,                      //向上方向键
        keyRight: 39,                   //向右方向键
        keyDown: 40,                    //向下方向键
        keyEnter: 13,                    //回车键

        //列表的样式控制
        listHoverStyle: 'background: #07d; color:#fff', //提示框列表鼠标悬浮的样式
        listHoverCSS: "jhover",         //提示框列表鼠标悬浮的样式名称
    }).on('onSetSelectValue', function (e, key, data) {


        callfun(data);
    })
}
}