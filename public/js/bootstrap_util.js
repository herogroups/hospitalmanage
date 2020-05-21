toastr.options = {
    closeButton: false, // 是否显示关闭按钮，（提示框右上角关闭按钮）
    debug: false, // 是否使用deBug模式
    progressBar: true, // 是否显示进度条，（设置关闭的超时时间进度条）
    positionClass: "toast-center-center",//弹出窗的位置
    onclick: null, // 点击消息框自定义事件 
    showDuration: "300", // 显示动画的时间
    hideDuration: "1000", //  消失的动画时间
    timeOut: "5000", //  自动关闭超时时间 
    extendedTimeOut: "1000", //  加长展示时间
    showEasing: "swing", //  显示时的动画缓冲方式
    hideEasing: "linear", //   消失时的动画缓冲方式
    showMethod: "fadeIn", //   显示时的动画方式
    hideMethod: "fadeOut" //   消失时的动画方式
}

var bstrap = {

     initDate(startEle,endEle,startDays=0){
        var start = {
            elem: startEle,
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
            elem: endEle,
            format: "YYYY-MM-DD",
            max: laydate.now(),
            istime: false,
            istoday: false,
            choose: function (datas) {
                start.max = datas
            }
        };
        laydate(start);
        laydate(end);
        $(startEle).val(laydate.now(startDays, 'YYYY-MM-DD'));
        $(endEle).val(laydate.now(0, 'YYYY-MM-DD'));
     },
     prompt(content, fun) {
        toastr.options = {
            closeButton: false, // 是否显示关闭按钮，（提示框右上角关闭按钮）
            debug: false, // 是否使用deBug模式
            progressBar: true, // 是否显示进度条，（设置关闭的超时时间进度条）
            positionClass: "toast-bottom-right",//弹出窗的位置
            onclick: fun, // 点击消息框自定义事件 
            showDuration: "300", // 显示动画的时间
            hideDuration: "1000", //  消失的动画时间
            timeOut: "20000", //  自动关闭超时时间 
            extendedTimeOut: "1000", //  加长展示时间
            showEasing: "swing", //  显示时的动画缓冲方式
            hideEasing: "linear", //   消失时的动画缓冲方式
            showMethod: "fadeIn", //   显示时的动画方式
            hideMethod: "fadeOut" //   消失时的动画方式
        }
        toastr.success(content)
    },
    imageCorpper: function (options) {

        var defaults = {
            id: "insert-form",
            title: '图片剪裁窗口',
            width: "900px",
            height: "700px",
            url: '/Common/ImageCorpper',
            shade: 0.3,
            btn: ['确认', '关闭'],
            btnclass: ['btn btn-primary', 'btn btn-sm btn-warning '],
            LoadSuccess: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();


            },
            callBack: function (layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                options.OKCallBack(iframeWin.getCroper());
            }
        };
        var index = $.modalOpen(defaults);

    },
    confirmFile: function (options) {
        var defaults = {
            postUrl: '',
            message: '',
            param: null,
            title: '系统窗口',

            btnOKLabel: '确定',
            btnCancelLabel: '取消',
            successCallBack: null,
            errorCallBack: null
        };
        var options = $.extend(defaults, options);
        var loadingindex = null;
        var index = layer.confirm(options.message, {
            skin: 'layui-layer-molv', //样式类名
            btn: [options.btnOKLabel, options.btnCancelLabel] //按钮
        }, function () {
            layer.close(index);
            $.ajax({
                url: options.postUrl,
                type: 'POST',
                cache: false,
                data: options.param,
                dataType: "json",
                processData: false,
                contentType: false,
                success: function (data) {

                    if (data.Success) {
                        if (typeof (options.successCallBack) != "undifine" && typeof (options.successCallBack) == "function") {
                            options.successCallBack(data);
                        }
                    } else {
                        toastr.error(data.Msg);
                        if (typeof (options.errorCallBack) != "undifine" && typeof (options.errorCallBack) == "function") {
                            options.errorCallBack(data);
                        }
                    }
                    layer.close(index);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest, textStatus, errorThrown);
                    toastr.error(errorThrown);
                },
                beforeSend: function () {
                    loadingindex = layer.load();
                },
                complete: function () {
                    layer.close(loadingindex);
                }
            });

        }, function () {

        });

    },
    confirm: function (options) {
        var defaults = {
            postUrl: '',
            message: '',
            param: null,
            title: '系统窗口',

            btnOKLabel: '确定',
            btnCancelLabel: '取消',
            successCallBack: null,
            errorCallBack: null
        };
        var options = $.extend(defaults, options);
        var loadingindex = null;
        var index = layer.confirm(options.message, {
            skin: 'layui-layer-molv', //样式类名
            btn: [options.btnOKLabel, options.btnCancelLabel] //按钮
        }, function () {
            layer.close(index);
            $.ajax({
                url: options.postUrl,
                type: 'POST',
                cache: false,
                data: options.param,
                dataType: "json",
                // contentType: 'application/x-www-form-urlencoded',//'application/json',
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data.Success) {
                        if (typeof (options.successCallBack) != "undifine" && typeof (options.successCallBack) == "function") {
                            options.successCallBack(data);
                        }


                    } else {


                        toastr.error(data.Msg);
                        if (typeof (options.errorCallBack) != "undifine" && typeof (options.errorCallBack) == "function") {
                            options.errorCallBack(data);
                        }


                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    toastr.error(errorThrown);
                },
                beforeSend: function () {
                    loadingindex = layer.load();
                },
                complete: function () {
                    layer.close(loadingindex);
                }
            });

        }, function () {

        });

    },
    post: function (option) {
        var index;
        var defaults = {
            url: '',
            param: null,
            callback: null,
            processData: false,
            contentType: false,
        };
        var options = $.extend(defaults, option);
        var index = layer.load();
        $.ajax({
            url: options.postUrl,
            type: 'POST',
            cache: false,
            data: options.param,
            //dataType= 'application/json',
            dataType: "json",
            processData: options.processData,
            contentType: options.contentType,
            success: function (data) {

                layer.close(index)
                if (typeof (options.callback) != "undifine" && typeof (options.callback) == "function") {
                    options.callback(data);
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.close(index)
                toastr.error(errorThrown);
            },
            beforeSend: function () {
                index = layer.load();
            },
            complete: function () {

                layer.close(index)
            }
        });
    },
    dlgOpen: function (options) {
        var defaults = {
            postUrl: '',
            title: 'WARNING',
            message: '',
            param: null,
            title: '系统窗口',
            btnCanceClass: 'btn-danger',
            btnOKClass: 'btn-primary',
            btnOKLabel: '确定',
            btnCancelLabel: '取消',
            initCallBack: null,
            okCallBack: null,
            cancelCallBack: null,
            size: BootstrapDialog.SIZE_WIDE,
        };
        var options = $.extend(defaults, options);
        BootstrapDialog.show({

            size: options.size,
            title: options.title,
            closable: false,
            message: function (dialog) {
                var $message = $('<div></div>');
                var pageToLoad = dialog.getData('pageToLoad');
                $message.load(pageToLoad, function () {

                });

                return $message;
            },
            data: {
                'pageToLoad': options.postUrl,
            },
            buttons: [{
                label: options.btnOKLabel,
                //hotkey: 65,  Keycode of keyup event of key 'A' is 65.
                cssClass: options.btnOKClass,
                action: function (dialog) {
                    if (typeof (options.okCallBack) != "undifine" && typeof (options.okCallBack) == "function") {
                        options.okCallBack(dialog)
                    }
                }
            }, {
                label: options.btnCancelLabel,
                // hotkey: 66,
                cssClass: options.btnCanceClass,
                action: function (dialog) {
                    if (typeof (options.cancelCallBack) != "undifine" && typeof (options.cancelCallBack) == "function") {
                        options.cancelCallBack()
                    }
                    dialog.close();

                }
            }],
            onshown: function (dialogRef) {

                if (typeof (options.initCallBack) != "undifine" && typeof (options.initCallBack) == "function") {
                    options.initCallBack(dialogRef)
                }
            },

        });

    },
    openImagedlg: function (obj) {
        var width = $(obj).width();
        var height = $(obj).height();
        var url = '/Common/ImageLoad?iwidth=' + width + "&iheight=" + height;

        var dlg;
        var option = {
            postUrl: url,
            title: '加载本地图像',
            param: null,
            initCallBack: function () {

            },
            okCallBack: function (dialog) {
                getCroper(obj);
                dialog.close();
            },
            cancelCallBack: function () {

            },

        };
        dlg = bstrap.dlgOpen(option);
    },
    parseJson2Html: function (obj, type, path) {
        //var props = {};
        //for (var key in obj) {
        //    var propPath = path;
        //    if (path) propPath = path + '.' + key;
        //    else propPath = key;

        //    if (typeof obj[key] === 'object') arguments.callee(obj[key], type, propPath);
        //    else {
        //        propPath = propPath.replace(/\.(\d+)\./g, '[+$1+].').replace(/[+]/g, '');
        //        props[propPath] = obj[key];
        //    }
        //}
        ///* 数据映射到 html */
        //for (var key in props) {
        //    var doms = document.querySelectorAll("[name='" + key + "']");
        //    if (doms.length == 0) continue;
        //    for (var domIndex in doms) setValue(doms[domIndex], props[key]);
        //}
        //function setValue(domObj, value) {
        //    if (domObj.type == 'radio' || domObj.type == 'checkbox') {// 扩展radio、checkbox
        //        if (domObj.type == 'radio') {
        //            if (domObj.value == value) domObj.setAttribute('checked', true);
        //        } else {
        //            var checkboxs = value.split(',');
        //            if (checkboxs.indexOf(domObj.value) >= 0) domObj.setAttribute('checked', true);
        //        }
        //    } else if (domObj.type=='file') {


        //    } else if ((domObj.value + '') != (value + '') && type != 'text') {

        //        domObj.value = value;
        //        console.log(domObj.type, value);
        //    }
        //    else if (domObj.innerText != (value + '')) {
        //        domObj.innerHTML = value;
        //    }
        //}
    },
    initGrid: function (options) {
        var defaults = {
            gridName: '', //网格名称
            url: '', //表格提交地址
            sidePagination: 'client', //客户端client分页还是服务端server分页
            param: null, //查询参数
            uniqueId: '', //每一行的唯一标识，一般为主键列
            columns: null, //显示网格列表信息
            LoadSuccess: null, //加载成功回调函数
            toolbar: '#toolbar', //工具条
            onCheck: null,
            pagination: true, //是否显示分页（*）
            showExport: true,
            showFooter: false,
            striped: true,
            exportTypes: ['excel'], //导出文件类型
            Icons: 'glyphicon-export',
            // exportOptions: {
            //     ignoreColumn: [0, 1], //忽略某一列的索引
            //     fileName: 'tableExport', //文件名称设置
            //     worksheetName: 'sheet1', //表格工作区名称
            //     tableName: 'tableExport',
            //     excelstyles: ['background-color', 'color', 'font-size', 'font-weight'],
            //     // onMsoNumberFormat: DoOnMsoNumberFormat
            // },
            //  tHeight: document.documentElement.clientHeight - 140,
        };


        var options = $.extend(defaults, options);
        $('#' + options.gridName).bootstrapTable({
            url: options.url, //请求后台的URL（*）
            method: 'post', //请求方式（*）
            contentType: "application/x-www-form-urlencoded",
            toolbar: options.toolbar, //工具按钮用哪个容器
            striped: options.striped, //是否显示行间隔色
            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: options.pagination, //是否显示分页（*）
            sortable: false, //是否启用排序
            sortOrder: "asc", //排序方式
            queryParams: options.param,
            sidePagination: options.sidePagination, //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, //初始化加载第一页，默认第一页
            pageSize: 10, //每页的记录行数（*）
            pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
            search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: false,
            showColumns: false, //是否显示所有的列
            showRefresh: false, //是否显示刷新按钮
            minimumCountColumns: 2, //最少允许的列数
            clickToSelect: true, //是否启用点击选中行
            // height: options.tHeight,
            queryParamsType: '',
            uniqueId: options.uniqueId, //每一行的唯一标识，一般为主键列
            showToggle: false, //是否显示详细视图和列表视图的切换按钮
            cardView: false, //是否显示详细视图
            detailView: false, //是否显示父子表 
            showExport: options.showExport, //是否显示导出
            exportTypes: options.exportTypes,
            exportOptions: options.exportOptions,
            Icons: options.Icons,
            exportDataType: "all", //basic', 'all', 'selected'.
            showFooter: options.showFooter,

            onCheck: function (row) {
                if (typeof (options.onCheck) != "undifine" && typeof (options.onCheck) == "function") {
                    options.onCheck(row);
                }

            },

            columns: options.columns,
            onLoadSuccess: function (data) { //加载成功时执行
                if (typeof (options.LoadSuccess) != "undifine" && typeof (options.LoadSuccess) == "function") {
                    options.LoadSuccess(data);
                }

            },
            onLoadError: function () { //加载失败时执行
                console.log("");
            },
        });


    },
    /**
     * 合并单元格
     * @param data  原始数据（在服务端完成排序）
     * @param fieldName 合并属性名称
     * @param colspan   合并列
     * @param target    目标表格对象
     */
    mergeCells: function (data, fieldName, colspan, target) {
        //声明一个map计算相同属性值在data对象出现的次数和
        var sortMap = {};
        for (var i = 0; i < data.length; i++) {
            for (var prop in data[i]) {
                if (prop == fieldName) {
                    var key = data[i][prop]
                    if (sortMap.hasOwnProperty(key)) {
                        sortMap[key] = sortMap[key] * 1 + 1;
                    } else {
                        sortMap[key] = 1;
                    }
                    break;
                }
            }
        }
        for (var prop in sortMap) {
            console.log(prop, sortMap[prop])
        }
        var index = 0;
        for (var prop in sortMap) {
            var count = sortMap[prop] * 1;
            $(target).bootstrapTable('mergeCells', {
                index: index,
                field: fieldName,
                colspan: colspan,
                rowspan: count
            });
            index += count;
        }
    },
    hideField: function (value, maxlen, len) {
        if (value == null) return "";
        if (value.length > maxlen) {
            return value.substring(0, len) + '***' + value.substring(value.length - len, value.length)
        } else {
            return value
        }
    },
    footerFat: function (value, itemname,dotcount=0) {

        var dRentAmt = 0;
        value.forEach((item) => {
            for (let val of Object.keys(item)) {
           
                if (val == itemname) {
                    dRentAmt += Number(item[val])
                    break;
                }
            }
        });
        
        return dRentAmt.toFixed(dotcount);
    },
    dateFtt: function (fmt, date) { //author: meizz   
        var o = {
            "M+": date.getMonth() + 1, //月份   
            "d+": date.getDate(), //日   
            "h+": date.getHours(), //小时   
            "m+": date.getMinutes(), //分   
            "s+": date.getSeconds(), //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    DateFormatter: function (value, rec, index) {
        if (value == undefined) {
            return "";
        }

        var now = eval(value.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")); ///.../gi是用来标记正则开始和结束；\是转义符；()标注了正则匹配分组1，$1 

        //直接借助datapattern.js扩展 return now.pattern('yyyy-MM-dd hh:mm:ss');
        //或者使用下面方式计算
        var year = now.getYear() + 1900; //或者 now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        return year + "-" + compareNine(month) + "-" + compareNine(date);
    },
    TimeFormatter: function (value, rec, index) {
        if (value == undefined) {
            return "";
        }

        var now = eval(value.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")); ///.../gi是用来标记正则开始和结束；\是转义符；()标注了正则匹配分组1，$1 

        //直接借助datapattern.js扩展 return now.pattern('yyyy-MM-dd hh:mm:ss');
        //或者使用下面方式计算
        var year = now.getYear() + 1900; //或者 now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        return compareNine(hour) + ":" + compareNine(minute) + ":" + compareNine(second);
    },
    DateTimeFormatter: function (value, rec, index) {
        if (value == undefined) {
            return "";
        }

        var now = eval(value.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")); ///.../gi是用来标记正则开始和结束；\是转义符；()标注了正则匹配分组1，$1 

        //直接借助datapattern.js扩展 return now.pattern('yyyy-MM-dd hh:mm:ss');
        //或者使用下面方式计算
        var year = now.getYear() + 1900; //或者 now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        return year + "-" + compareNine(month) + "-" + compareNine(date) + " " + compareNine(hour) + ":" + compareNine(minute);
        // return year + "-" + compareNine(month) + "-" + compareNine(date) + " " + compareNine(hour) + ":" + compareNine(minute) + ":" + compareNine(second);
    },
    dataURLtoBlob: function (dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    },
    parseValue: function (json) {
        var str = JSON.stringify(json); //将json 转成字符串
        window.external.TransCall(str);
    },
    previewbook: function (bookid) {
        var defaults = {
            title: '图书预览',
            width: "1024px",
            height: "500px",
            url: " /Book/BarCode/Preview?BookId=" + bookid,
            shade: 0.3,
            LoadSuccess: function (layero, index) {
                var body = layer.getChildFrame('body', index);
            },
            callBack: function (layero) {}
        };
        var index = $.modalOpen(defaults)
        layer.full(index);
    }
}

function compareNine(value) {
    return value > 9 ? value : '0' + value;
}
$.fn.checkboxBind = function (remoteUrl) {
    var $element = $(this);
    $.ajax({
        url: remoteUrl,
        type: "POST",
        success: function (result) {

            var seHtml = "";
            for (var i = 0; i < result.length; i++) {
                if (result[i].checked != undefined && result[i].checked != null && result[i].checked == 1) {
                    seHtml += " <label class='checkbox-inline i-checks'> <input type='checkbox' checked value='" + result[i].id + "'  >" + result[i].text + " </label>"
                } else {
                    seHtml += " <label class='checkbox-inline i-checks'> <input type='checkbox' value='" + result[i].id + "'  >" + result[i].text + " </label>"
                }

            }
            $element.html(seHtml);

        },
        async: false,
        dataType: "json"
    });
}

$.fn.selectBind = function (remoteUrl, param) {
    var $element = $(this);
    $.ajax({
        url: remoteUrl,
        type: "POST",
        data: param,
        success: function (result) {

            var seHtml = "";
            for (var i = 0; i < result.length; i++) {
                if (i == 0) {
                    seHtml += "<option  value=" + result[i].id + " selected='selected'>" + result[i].text + "</option>";
                } else {
                    seHtml += "<option value=" + result[i].id + ">" + result[i].text + "</option>";
                }
            }
            $element.html(seHtml);

        },
        async: false,
        dataType: "json"
    });
}

$.fn.drapdownBind = function (remoteUrl, obj) {
    var $element = $(this);
    $.ajax({
        url: remoteUrl,
        type: "POST",
        success: function (result) {

            var seHtml = "";
            for (var i = 0; i < result.length; i++) {
                seHtml += " <li><a onclick= \"$(\'" + obj + "\').val($(this).html())\">" + result[i].text + " </a></li>";
            }

            $element.html(seHtml);

        },
        async: false,
        dataType: "json"
    });
}
$.modalOpen = function (options) {
    var defaults = {
        id: null,
        title: '系统窗口',
        width: "100px",
        height: "100px",
        url: '',
        shade: 0.3,
        btn: null,
        callBack: null,
        cancelCall: null,
        LoadSuccess: null,
    };
    var options = $.extend(defaults, options);
    var _width = options.width;
    var _height = options.height;
    var index = layer.open({

        id: options.id,
        type: 2,
        shade: options.shade,
        title: options.title,
        fix: false,
        skin: 'layui-layer-molv',
        area: [_width, _height],
        content: options.url,
        btn: options.btn,
        success: function (layero, index) {
            if (typeof (options.LoadSuccess) != "undifine" && typeof (options.LoadSuccess) == "function") {
                options.LoadSuccess(layero, index);
            }
        },

        yes: function (index, layero) {
            options.callBack(layero);
        },
        cancel: function () {
            if (typeof (options.cancelCall) != "undifine" && typeof (options.cancelCall) == "function") {
                options.cancelCall();
            }
        }
    });

    return index;
}
$.fn.formSerialize = function (formdate) {
    var element = $(this);
    if (!!formdate) {
        for (var key in formdate) {
            var $id = element.find('#' + key);
            var value = $.trim(formdate[key]).replace(/&nbsp;/g, '');
            var type = $id.attr('type');
            if ($id.hasClass("select2-hidden-accessible")) {
                type = "select";
            }
            switch (type) {
                case "checkbox":
                    if (value == "true") {
                        $id.attr("checked", 'checked');
                    } else {
                        $id.removeAttr("checked");
                    }
                    break;
                case "select":
                    $id.val(value).trigger("change");
                    break;
                default:
                    $id.val(value);
                    break;
            }
        };
        return false;
    }

};
$.fn.wordlimit = function (cname, wordlength) {

    
        var nowLength = cname.length;
        if (nowLength > wordlength) {
            return cname.substr(0, wordlength) + '...';
        }else{
            return cname;
        }
  
};
function createExportLog() {
    let downObj = $('.dropdown-menu a')

    if (downObj.length > 0) {
   
           downObj.on('click', function () {
           
            $.ajax({
                url: '/SystemManage/sys_log/ExportLog',
                type: "POST",
                data: { title: document.title },
                success: function (result) { 
        
                },
                async: false,
                dataType: "json"
            });

        });
    }else{
        console.log('没有对象',downObj);
    }
}