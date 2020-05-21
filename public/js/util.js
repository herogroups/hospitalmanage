var util = {
    autocode:function(data,code,codelen)
    {
        
        let  oldcode=0;
        let  len =data.length;
        for (var i in data){
            let row = data[i];
            let  newcode =Number( row[code]);
            if (oldcode<newcode)
            {
                oldcode= newcode;
            }
        }
        oldcode=oldcode+1;
        return util.pad(oldcode,codelen); 
    },
    pad:function(num, n) {
        return (Array(n).join(0) + num).slice(-n); 
    }, 
    createDateRange:function(el1,el2){
        var start = {
            elem: el1,
            format: "YYYY-MM-DD",
            max: laydate.now(),
            istime: false,
            istoday: false,
            choose: function (datas) {
                end.min = datas;
                end.start = datas
            }
        };
        var end = {
            elem: el2,
            format: "YYYY-MM-DD",
            max: laydate.now(),
            istime: false,
            istoday: true,
            choose: function (datas) {
                start.max = datas
            }
        };
        laydate(start);
        laydate(end);
        $(el1).val(laydate.now(0, 'YYYY-MM-DD'));
        $(el2).val(laydate.now(0, 'YYYY-MM-DD'));
},
}
String.prototype.PadLeft = function (len, charStr) {
    var s = this + '';
    return new Array(len - s.length + 1).join(charStr,  '') + s;
}
String.prototype.PadRight = function (len, charStr) {
    var s = this + '';
    return s + new Array(len - s.length + 1).join(charStr,  '');
}
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}
/**
* 删除左右两端的空格
*/
String.prototype.trim=function()
{
    return this.replace(/(^\s*)|(\s*$)/g, '');
}
/**
* 删除左边的空格
*/
String.prototype.ltrim=function()
{
    return this.replace(/(^\s*)/g,'');
}
/**
* 删除右边的空格
*/
String.prototype.rtrim=function()
{
    return this.replace(/(\s*$)/g,'');
}