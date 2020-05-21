 /**
      * 初始化fileinput
      * **/
     var FileInput = function () {
        var oFile = new Object();
        // 初始化fileinput控件（第一次初始化）
        /**
         * 入参说明
         * ctrlName：控件ID值
         * uploadUrl：上传地址
         * shwoKey：是否显示上传按钮和上传框 主要用于查看
         * imgPathArray：初始化数据path数组 主要用于查看和修改
         * imgNameArray：初始化数据name数组
         * **/
        oFile.Init = function (ctrlName, uploadUrl, shwoKey, imgPathArray, imgNameArray,callback) {
            var control = $('#' + ctrlName);

            // 初始化上传控件的样式
            control.fileinput({
                'theme': 'explorer',
                language: 'zh', // 设置语言
                uploadUrl: uploadUrl, // 上传的地址
                allowedFileExtensions : ['jpg', 'png','gif'],//接收的文件后缀
              //  allowedFileTypes: ['image'],
                showPreview: true,
                overwriteInitial: false,
                previewFileIcon: '<i class="fa fa-file"></i>',
                dropZoneEnabled: false, //是否显示拖拽区域
                maxFileCount: 1, // 表示允许同时上传的最大文件个数
                showUpload: true, //是否显示上传按钮
                showRemove: true, //显示移除按钮
                showBrowse: shwoKey, //是否显示选择按钮
                showCaption: shwoKey, //是否显示选择输入框
                enctype: 'multipart/form-data',
                validateInitialCount: true,
                previewFileIcon: true, //是否显示文件icon 默认图片是直接显示缩略图 文件会展示相关内容
                msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
                preferIconicPreview: true, //是否强制相关文件展示icon
                initialPreviewAsData: true,
                previewFileIconSettings: { //配置相关文件展示的icon

                },
                /*  uploadExtraData: function(previewId, index) {   //额外参数的关键点
                    
                 }, */
                initialPreview: imgPathArray,
                initialPreviewConfig: imgNameArray,
            });
            control.on("fileuploaded", function (event, data, previewId, index) {
               let UPBEFOREFILENAME=  data.files[0].name;
               let UPFILENAME =data.response.aftername;
              
               return callback({benforname:UPBEFOREFILENAME,aftername:UPFILENAME})

            });
        }
        return oFile;
    };