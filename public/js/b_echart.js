var bgColor = '#05274C'
var clock = new Vue({
    el: '#clock',
    data: {
        time: '',
        date: ''
    }
});
var countVal = {
    ghCountVal: 0,
    ghAmountVal: 0,
    sumCountVal: 0,
    sumAmountVal: 0
};
var week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
var timerID = setInterval(updateTime, 1000);
updateTime();

function updateTime() {
    var cd = new Date();
    clock.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd
        .getSeconds(), 2);
    clock.date = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth() + 1, 2) + '-' + zeroPadding(cd
        .getDate(), 2) + ' ' + week[cd.getDay()];
};

function zeroPadding(num, digit) {
    var zero = '';
    for (var i = 0; i < digit; i++) {
        zero += '0';
    }
    return (zero + num).slice(-digit);
}

var optionsCount = {
    useEasing: true, // 使用缓和
    useGrouping: true, // 使用分组(是否显示千位分隔符,一般为 true)
    separator: ',', // 分隔器(千位分隔符,默认为',')
    decimal: '.', // 十进制(小数点符号,默认为 '.')
    prefix: '', // 字首(数字的前缀,根据需要可设为 $,¥,￥ 等)
    suffix: '' // 后缀(数字的后缀 ,根据需要可设为 元,个,美元 等) 
};
var payModleChart, linearChart, halfYearCount, departOrderChart, aWeekBussChart, chinaMapChart = {};
$(function () {
    halfYearCount = echarts.init(document.getElementById("hosChat"));

    linearChart = echarts.init(document.getElementById("linearChart"));

    sexChart = echarts.init(document.getElementById("sexChart"));

    payModleChart = echarts.init(document.getElementById("payModle"));

    departOrderChart = echarts.init(document.getElementById("departOrder"));
    aWeekBussChart = echarts.init(document.getElementById("aWeekBuss"));
    chinaMapChart = echarts.init(document.querySelector(".map .chart"));


});


var CreateWebSocket = (function () {
    return function (urlValue) {
        if (window.WebSocket) return new WebSocket(urlValue);
        if (window.MozWebSocket) return new MozWebSocket(urlValue);
        return false;
    }
})();
/* 实例化 WebSocket 连接对象, 地址为 ws 协议 */
var webSocket = CreateWebSocket("ws://localhost:4001");
/* 接收到服务端的消息时 */
webSocket.onmessage = function (msg) {
    let jData = JSON.parse(msg.data);
    console.log("服务端说:" + JSON.stringify(jData));

    let ringop = ringPayModel(jData.payMode);

    let optionlinear = todayTransCount(jData.todayCount);

    let optionHalfYear = halfYearCountOption(jData.halfYearCount)

    payModleChart.setOption(ringop);
    linearChart.setOption(optionlinear);
    halfYearCount.setOption(optionHalfYear);
    sexChart.setOption(optionSex(jData.sexCala));
    departOrderChart.setOption(departOrder(jData.departOrderCount));
    aWeekBussChart.setOption(aWeekBuss(jData.aWeekBuss));
    chinaMapChart.setOption(chinaMap());
    new CountUp("ghCount", countVal.ghCountVal, jData.ghCount.ghcounts, 0, 3, optionsCount).start();
    new CountUp("ghAmount", countVal.ghAmountVal, jData.ghCount.amount, 0, 3, optionsCount).start();
    new CountUp("sumCount", countVal.sumCountVal, jData.sumCount.counts, 0, 3, optionsCount).start();
    new CountUp("sumAmount", countVal.sumAmountVal, jData.sumCount.amount, 2, 3, optionsCount).start();

    countVal.ghCountVal = jData.ghCount.ghcounts;
    countVal.ghAmountVal = jData.ghCount.amount;
    countVal.sumCountVal = jData.sumCount.counts;
    countVal.sumAmountVal = jData.sumCount.amount;


};
/* 关闭时 */
webSocket.onclose = function () {
    console.log("关闭连接");
};
/**
 * 性别占比
 * @param  dataSex 
 */
function optionSex(record) {

    option = {
      //  backgroundColor: bgColor,
        title: { // 标题
            text: '性别占比', // 标题文本内容
            left: 'center', // 标题左右居中
            top: 3,
            textStyle: { // 标题样式
                color: '#ddd', // 标题字体颜色
                fontSize: '16', // 标题字体大小
            }
        },
        grid: {
            left: '20%'
        },
        color: ['#2AC9FD', '#76FBC0', '#35C96E', '#FCC708', '#48B188', '#5957C2', '#4A5D73'],
        series: [{
                color: ['#2AC9FD', '#76FBC0', '#35C96E', '#FCC708', '#48B188', '#5957C2'],
                type: 'pie',
                radius: ['52', '90'],
                labelLine: {
                    normal: {
                        length: 20,
                        length2: 90,
                        lineStyle: {
                            type: 'solid'
                        }
                    }

                },
                label: {
                    normal: {
                        formatter: (params) => {
                            return '{b| ' + params.name + '}  ' + '{c|' + params.percent.toFixed(0) + '%}'
                        },
                        borderWidth: 0,
                        borderRadius: 4,
                        padding: [0, -86],
                        height: 70,
                        fontSize: 13,
                        align: 'center',
                        color: '#3494BD',
                        rich: {
                            b: {
                                fontSize: 12,
                                lineHeight: 20,
                                color: '#41B3DC',
                                padding: [0, 0, 5, 0]
                            },
                            c: {
                                fontSize: 20,
                                lineHeight: 20,
                                color: 'orange'
                            }

                        }
                    }
                },
                data: record,
            },
            {
                type: 'pie',
                radius: ['100', '101'],
                data: [100],
                label: {
                    show: false
                }
            },
            {
                type: 'pie',
                radius: ['40', '41'],
                data: [100],
                label: {
                    show: false
                }
            }
        ]
    };
    return option;
};
/**
 * 时间段内交易笔数
 * @param {}} todayTransCount 
 */
function todayTransCount(todayTransCount) {
    console.log('todayTransCount', todayTransCount);
    let times = [];
    for (var n = 7; n < 19; n++) {
        times.push(`${n}:00`)
    }

    option = {
     
      //  backgroundColor: bgColor, // 背景色，默认无背景。
        title: { // 标题
            text: '当日交易量折线图', // 标题文本内容
            left: 'center', // 标题左右居中
            top: 3,
            textStyle: { // 标题样式
                color: '#ddd', // 标题字体颜色
                fontSize: '16', // 标题字体大小
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(255,255,255,0)' // 0% 处的颜色
                        }, {
                            offset: 0.5,
                            color: 'rgba(255,255,255,1)' // 100% 处的颜色
                        }, {
                            offset: 1,
                            color: 'rgba(255,255,255,0)' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                },
            },

        },
        grid: {
            top: '18%',
            left: '1%',
            right: '1%',
            bottom: '25%',
            // containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: true,
            axisLine: { //坐标轴轴线相关设置。数学上的x轴
                show: true,
                lineStyle: {
                    color: 'rgba(255,255,255,0.4)'
                },
            },
            axisLabel: { //坐标轴刻度标签的相关设置
                textStyle: {
                    color: '#d1e6eb',
                    margin: 15,
                },
            },
            axisTick: {
                show: false,
            },
            data: times,
        }],
        yAxis: [{
            type: 'value',
            min: 0,
            // max: 140,
            splitNumber: 4,
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255,255,255,0.1)'
                }
            },
            axisLine: {
                show: true,
            },
            axisLabel: {
                show: true,
                margin: 20,
                textStyle: {
                    color: '#d1e6eb',

                },
            },
            axisTick: {
                show: true,
            },
        }],
        series: [{
            name: '注册总量',
            type: 'line',
            // smooth: true, //是否平滑曲线显示
            // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbolSize: 8,
            lineStyle: {
                normal: {
                    color: "#53fdfe", // 线条颜色
                },
                borderColor: '#f0f'
            },
            label: {
                show: true,
                position: 'top',
                textStyle: {
                    color: '#fff',
                }
            },
            itemStyle: {
                normal: {
                    color: "rgba(255,255,255,1)",
                }
            },
            tooltip: {
                show: false
            },
            areaStyle: { //区域填充样式
                normal: {
                    //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0,150,239,0.3)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(0,253,252,0)'
                        }
                    ], false),
                    shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                    shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                }
            },
            data: todayTransCount
        }]
    };
    return option;
}

function halfYearCountOption(record) {
    console.log('record==', record);
    var dataX = record.map((item, index) => {
        return item.name
    });
    // dataX= ['方便面', '面包', '牛奶', '饼干', '可乐', '牛肉干', '薯片', '冰淇淋'];
    var dataY = record.map((item, index) => {
        return item.value
    }); //
    // dataY=[362, 568, 296, 205, 347, 159, 391, 423];
    console.log('dataX=', dataX);
    console.log('dataY=', dataY);
    option = {
      //  backgroundColor: bgColor, // 背景色，默认无背景。
        title: { // 标题
            text: '近一年交易量统计(单位：笔)', // 标题文本内容
            left: 'center', // 标题左右居中
            top: 3,
            textStyle: { // 标题样式
                color: '#ddd', // 标题字体颜色
                fontSize: '16', // 标题字体大小
            }
        },
        grid: {
            top: '20%', // 绘图网格区域 距离容器上侧的距离
            bottom: '20%', // 绘图网格区域 距离容器下侧的距离
        },
        tooltip: { // 提示框组件
            show: true, // 是否显示提示框组件，包括提示框浮层和 axisPointer。
            trigger: 'axis', // 触发类型:axis(坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。)
            // item(数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。)
            // none(什么都不触发。)
            axisPointer: { // 坐标轴指示器配置项。
                show: true, // 默认不显示。但是如果 tooltip.trigger 设置为 'axis' 或者 tooltip.axisPointer.type 设置为 'cross'，则自动显示 axisPointer。
                //坐标系会自动选择显示显示哪个轴的axisPointer，也可以使用 tooltip.axisPointer.axis 改变这种选择。
                type: 'line', // 'line' 直线指示器;'shadow' 阴影指示器.
                lineStyle: { // axisPointer.type为'line'时有效.
                    color: '#fff', // 触发提示时 竖线 的颜色
                    opacity: 0 // 将竖线的透明度设为 0,也可以起到 不显示竖线 的效果.
                }
            },
            formatter: '{b} : {c}' // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式。
        },
        xAxis: {
            data: dataX, // x坐标轴的数据项
            axisLine: { // x坐标轴轴线相关设置
                lineStyle: { // x轴线样式(跟分隔线的配置差不多)
                    color: '#fff' // x轴轴线颜色
                }
            },
            axisLabel: { // 坐标轴刻度标签的相关设置
                color: '#fff', // 刻度标签的字体颜色
                fontSize: 10, // 刻度标签的字体大小
                margin: 5, // 刻度标签与轴线之间的距离。默认为 8
                interval: 0,
                rotate: 40,
                formatter: function (value) { // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。


                    if (value != "" && value != undefined) {
                        return value;
                        // return value.split("").join("\n"); // 让x轴刻度标签竖直排列
                    } else {
                        return "";
                    }
                }
            }
        },
        yAxis: {
            axisLine: { // y坐标轴轴线相关设置
                lineStyle: { // y轴线样式(跟分隔线的配置差不多)
                    color: '#fff' // y轴轴线颜色
                }
            },
            axisLabel: { // 坐标轴刻度标签的相关设置
                color: '#fff', // 刻度标签的字体颜色
                fontSize: 10, // 刻度标签的字体大小
                margin: 10, // 刻度标签与轴线之间的距离。默认为 8
            },
            splitLine: { // 坐标轴在 grid 区域中的分隔线。
                show: false, // 是否显示分隔线。默认数值轴显示，类目轴不显示。
                lineStyle: { // 分隔线样式
                    color: '#fff' // 分隔线颜色
                }
            }
        },
        series: [{ // 系列列表。每个系列通过 type 决定自己的图表类型
            type: 'bar',
            //   barWidth: 10, // 柱条的宽度，不设时自适应。支持设置成相对于类目宽度的百分比。(注:在同一坐标系上，此属性会被多个 'bar' 系列共享。此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，并且是对此坐标系中所有 'bar' 系列生效。)
            itemStyle: { // 图形样式
                normal: {
                    // 柱条的颜色
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, //渐变色比例
                        color: '#F7FAFA' //柱子颜色 上半
                    }, {
                        offset: 0.5, //渐变色比例
                        color: '#00B4FF' //柱子颜色下半
                    }], false),
                    label: { // 柱条上标签
                        show: true, // 是否将数据项对应的数值显示在柱条上
                        textStyle: { // 柱条上标签字体样式
                            color: '#fff', // 柱条上标签字体颜色
                            fontSize: 10 // 柱条上标签字体大小
                        },
                        position: 'top', // 标签位置,'top'(柱条顶部),'center'(柱条内部),'bottom'(柱条底部)
                        formatter: '{c}' // 标签内容
                    }
                }
            },
            data: dataY // 系列1对应的 X轴数据项的值
        }]
    };
    return option;
}

function ringPayModel(data) {
    arrName = getArrayValue(data, "name");
    arrValue = getArrayValue(data, "value");
    sumValue = eval(arrValue.join('+'));
    objData = array2obj(data, "name");
    optionData = getData(data);
    console.log('optionData=============', optionData);

    function getArrayValue(array, key) {
        var key = key || "value";
        var res = [];
        if (array) {
            array.forEach(function (t) {
                res.push(t[key]);
            });
        }
        return res;
    }

    function array2obj(array, key) {
        var resObj = {};
        for (var i = 0; i < array.length; i++) {
            resObj[array[i][key]] = array[i];
        }
        return resObj;
    }

    function getData(data) {
        var res = {
            series: [],
            yAxis: []
        };
        for (let i = 0; i < data.length; i++) {
            res.series.push({
                name: '支付方式',
                type: 'pie',
                clockWise: false, //顺时加载
                hoverAnimation: false, //鼠标移入变大
                radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
                center: ["30%", "55%"],
                label: {
                    show: false
                },
                itemStyle: {
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false
                    },
                    borderWidth: 5,
                },
                data: [{
                    value: data[i].value,
                    name: data[i].name
                }, {
                    value: sumValue - data[i].value,
                    name: '',
                    itemStyle: {
                        color: "rgba(0,0,0,0)",
                        borderWidth: 0
                    },
                    tooltip: {
                        show: false
                    },
                    hoverAnimation: false
                }]
            });
            res.series.push({
                name: '',
                type: 'pie',
                silent: true,
                z: 1,
                clockWise: false, //顺时加载
                hoverAnimation: false, //鼠标移入变大
                radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
                center: ["30%", "55%"],
                label: {
                    show: false
                },
                itemStyle: {
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false
                    },
                    borderWidth: 5,
                },
                data: [{
                    value: 7.5,
                    itemStyle: {
                        color: "#E3F0FF",
                        borderWidth: 0
                    },
                    tooltip: {
                        show: false
                    },
                    hoverAnimation: false
                }, {
                    value: 2.5,
                    name: '',
                    itemStyle: {
                        color: "rgba(0,0,0,0)",
                        borderWidth: 0
                    },
                    tooltip: {
                        show: false
                    },
                    hoverAnimation: false
                }]
            });
            res.yAxis.push((data[i].value / sumValue * 100).toFixed(2) + "%");
        }
        return res;
    }

    option = {
      //  backgroundColor: bgColor, // 背景色，默认无背景。
        title: { // 标题
            text: '支付方式占比', // 标题文本内容
            left: 'center', // 标题左右居中
            top: 3,
            textStyle: { // 标题样式
                color: '#ddd', // 标题字体颜色
                fontSize: '16', // 标题字体大小
            }
        },
        legend: {
            show: true,
            top: "center",
            left: '60%',
            data: arrName,
            itemWidth: 30,
            itemHeight: 20,
            width: 50,
            padding: [0, 5],
            itemGap: 25,
            formatter: function (name) {
                return "{title|" + name + "}\n{value|" + (objData[name].value) + "笔}"
            },
            textStyle: {
                rich: {
                    title: {
                        fontSize: 16,
                        lineHeight: 16,
                        color: '#75fcd7'
                    },
                    value: {
                        fontSize: 16,
                        lineHeight: 16,
                        color: '#75fcd7'
                    }
                }
            },
        },
        tooltip: {
            show: true,
            trigger: "item",
            formatter: "{a}<br>{b}:{c}({d}%)"
        },
        color: ['#00e473', '#009DFF', '#FF8700', '#ffc300'],
        grid: {
            top: '20%',
            bottom: '48%',
            left: "30%",
            containLabel: false
        },
        yAxis: [{
            type: 'category',
            inverse: true,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0,
                inside: true,
                textStyle: {
                    color: "#000",
                    fontSize: 10,
                },
                show: true
            },
            data: optionData.yAxis
        }],
        xAxis: [{
            show: false
        }],
        series: optionData.series
    };
    return option;
}

function departOrder(record) {
    let dataY = record.map((item) => {
        return item.name
    });
    let dataX = record.map((item) => {
        return item.value
    })
    //    let dataY=['杭州市', '宁波市', '温州市', '湖州市', '嘉兴市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'];
    //    let dataX=[3.66, 2.86, 1.82, 1.8, 1.53, 1.47, 1.3, 1.25, 1.1, 1.02, 1]
    console.log('dataY=========', dataY);
    var index = 0;
    var colorList = ['#f36c6c', '#e6cf4e', '#20d180', '#0093ff'];
    option = {
      //  backgroundColor: bgColor, // 背景色，默认无背景。
        title: { // 标题
            text: '科室挂号量排行', // 标题文本内容
            left: 'center', // 标题左右居中
            top: 3,
            textStyle: { // 标题样式
                color: '#ddd', // 标题字体颜色
                fontSize: '16', // 标题字体大小
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            show: false
        },
        grid: {
            left: 100
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'value',

            splitLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            }

        },
        yAxis: {
            type: 'category',
            inverse: true,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisPointer: {
                label: {
                    show: true,
                    margin: 30
                }
            },
            data: dataY,
            axisLabel: {
                margin: 100,
                fontSize: 14,
                align: 'left',
                color: '#fff',
                rich: {
                    a1: {
                        color: '#fff',
                        backgroundColor: colorList[0],
                        width: 30,
                        height: 30,
                        align: 'center',
                        borderRadius: 2
                    },
                    a2: {
                        color: '#fff',
                        backgroundColor: colorList[1],
                        width: 30,
                        height: 30,
                        align: 'center',
                        borderRadius: 2
                    },
                    a3: {
                        color: '#fff',
                        backgroundColor: colorList[2],
                        width: 30,
                        height: 30,
                        align: 'center',
                        borderRadius: 2
                    },
                    b: {
                        color: '#fff',
                        backgroundColor: colorList[3],
                        width: 30,
                        height: 30,
                        align: 'center',
                        borderRadius: 2
                    }
                },
                // formatter: function (params) {
                //     if (index == 6) {
                //         index = 0;
                //     }
                //     index++;
                //     console.log('index==============',index,params);
                //     if (index < 4) {
                //         return [
                //             '{a' + index + '|' + index + '}' + '  ' + params
                //         ].join('\n')
                //     } else {
                //         return [
                //             '{b|' + index + '}' + '  ' + params
                //         ].join('\n')
                //     }
                // }
            }
        },
        series: [{
                z: 2,
                name: 'value',
                type: 'bar',
                data: dataX.map((item, i) => {
                    itemStyle = {
                        color: i > 3 ? colorList[3] : colorList[i]
                    }
                    return {
                        value: item,
                        itemStyle: itemStyle
                    };
                }),
                label: {
                    show: true,
                    position: 'right',
                    color: '#fff',
                    fontSize: 14,
                    offset: [10, 0]
                }
            }

        ]
    };
    return option;
}

function aWeekBuss(record) {

    option = {
       // backgroundColor: bgColor,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        title: { // 标题
            text: '近半年业务统计', // 标题文本内容
            left: 'center', // 标题左右居中
            top: 3,
            textStyle: { // 标题样式
                color: '#ddd', // 标题字体颜色
                fontSize: '16', // 标题字体大小
            }
        },
        legend: {
            data: ['挂号', '门诊缴费', '住院充值'],
            align: 'right',
            top: 28,
            right: 10,
            textStyle: {
                color: "#fff"
            },
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 35
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: record.dataY,
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#063374",
                    width: 1,
                    type: "solid"
                }
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: "#00c7ff",
                }
            },
        }],
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: '{value} %'
            },
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: "#00c7ff",
                    width: 1,
                    type: "solid"
                },
            },
            splitLine: {
                lineStyle: {
                    color: "#063374",
                }
            }
        }],
        series: [{
            name: '挂号',
            type: 'bar',
            data: record.gh,
            barWidth: 10, //柱子宽度
            barGap: 1, //柱子之间间距
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#008cff'
                    }, {
                        offset: 1,
                        color: '#005193'
                    }]),
                    opacity: 1,
                }
            }
        }, {
            name: '门诊缴费',
            type: 'bar',
            data: record.mz,
            barWidth: 10,
            barGap: 1,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#00da9c'
                    }, {
                        offset: 1,
                        color: '#007a55'
                    }]),
                    opacity: 1,
                }
            }
        }, {
            name: '住院充值',
            type: 'bar',
            data: record.zy,
            barWidth: 10,
            barGap: 1,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#c4e300'
                    }, {
                        offset: 1,
                        color: '#728400'
                    }]),
                    opacity: 1,
                }
            }
        }]
    };



    return option;
}

function chinaMap() {
    var chinaGeoCoordMap = {
        '黑龙江': [127.9688, 45.368],
        '内蒙古': [110.3467, 41.4899],
        "吉林": [125.8154, 44.2584],
        '北京市': [116.4551, 40.2539],
        "辽宁": [123.1238, 42.1216],
        "河北": [114.4995, 38.1006],
        "天津": [117.4219, 39.4189],
        "山西": [112.3352, 37.9413],
        "陕西": [109.1162, 34.2004],
        "甘肃": [103.5901, 36.3043],
        "宁夏": [106.3586, 38.1775],
        "青海": [101.4038, 36.8207],
        "新疆": [87.9236, 43.5883],
        "西藏": [91.11, 29.97],
        "四川": [103.9526, 30.7617],
        "重庆": [108.384366, 30.439702],
        "山东": [117.1582, 36.8701],
        "河南": [113.4668, 34.6234],
        "江苏": [118.8062, 31.9208],
        "安徽": [117.29, 32.0581],
        "湖北": [114.3896, 30.6628],
        "浙江": [119.5313, 29.8773],
        "福建": [119.4543, 25.9222],
        "福州中医学院": [109.4543, 25.22],
        "江西": [116.0046, 28.6633],
        "湖南": [113.0823, 28.2568],
        "贵州": [106.6992, 26.7682],
        "云南": [102.9199, 25.4663],
        "广东": [113.12244, 23.009505],
        "广西": [108.479, 23.1152],
        "海南": [110.3893, 19.8516],
        '上海': [121.4648, 31.2891]
    };
    var chinaDatas = [
        [{
            name: '黑龙江',
            value: 0
        }],
        [{
            name: '内蒙古',
            value: 0
        }],
        [{
            name: '吉林',
            value: 0
        }],
        [{
            name: '辽宁',
            value: 0
        }],
        [{
            name: '河北',
            value: 0
        }],
        [{
            name: '天津',
            value: 0
        }],
        [{
            name: '山西',
            value: 0
        }],
        [{
            name: '陕西',
            value: 0
        }],
        [{
            name: '甘肃',
            value: 0
        }],
        [{
            name: '宁夏',
            value: 0
        }],
        [{
            name: '青海',
            value: 0
        }],
        [{
            name: '新疆',
            value: 0
        }],
        [{
            name: '西藏',
            value: 0
        }],
        [{
            name: '四川',
            value: 0
        }],
        [{
            name: '重庆',
            value: 0
        }],
        [{
            name: '山东',
            value: 0
        }],
        [{
            name: '河南',
            value: 0
        }],
        [{
            name: '江苏',
            value: 0
        }],
        [{
            name: '安徽',
            value: 0
        }],
        [{
            name: '湖北',
            value: 0
        }],
        [{
            name: '浙江',
            value: 0
        }],
        [{
            name: '福建',
            value: 0
        }],
        [{
            name: '江西',
            value: 0
        }],
        [{
            name: '湖南',
            value: 0
        }],
        [{
            name: '贵州',
            value: 0
        }],
        [{
            name: '广西',
            value: 0
        }],
        [{
            name: '海南',
            value: 0
        }],
        [{
            name: '上海',
            value: 1
        }]
    ];

    var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = chinaGeoCoordMap[dataItem[0].name];
            var toCoord = [109.4543, 25.22];
            if (fromCoord && toCoord) {
                res.push([{
                    coord: fromCoord,
                    value: dataItem[0].value
                }, {
                    coord: toCoord,
                }]);
            }
        }
        return res;
    };
    var series = [];
    [
        ['福州中医学院', chinaDatas]
    ].forEach(function (item, i) {
        console.log(item)
        series.push({
                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 4, //箭头指向速度，值越小速度越快
                    trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
                    symbol: 'arrow', //箭头图标
                    symbolSize: 2, //图标大小
                },
                lineStyle: {
                    normal: {
                        width: 1, //尾迹线条宽度
                        opacity: 1, //尾迹线条透明度
                        curveness: .3 //尾迹线条曲直度
                    }
                },
                data: convertData(item[1])
            }, {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: { //涟漪特效
                    period: 4, //动画时间，值越小速度越快
                    brushType: 'stroke', //波纹绘制方式 stroke, fill
                    scale: 4 //波纹圆环最大限制，值越大波纹越大
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right', //显示位置
                        offset: [5, 0], //偏移设置
                        formatter: function (params) { //圆环显示文字
                            return params.data.name;
                        },
                        fontSize: 13
                    },
                    emphasis: {
                        show: true
                    }
                },
                symbol: 'circle',
                symbolSize: function (val) {
                    return 5 + val[2] * 5; //圆环大小
                },
                itemStyle: {
                    normal: {
                        show: false,
                        color: '#f00'
                    }
                },
                data: item[1].map(function (dataItem) {
                    return {
                        name: dataItem[0].name,
                        value: chinaGeoCoordMap[dataItem[0].name].concat([dataItem[0].value])
                    };
                }),
            },
            //被攻击点
            {
                type: 'scatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    period: 4,
                    brushType: 'stroke',
                    scale: 4
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        //offset:[5, 0],
                        color: '#0f0',
                        formatter: '{b}',
                        textStyle: {
                            color: "#0f0"
                        }
                    },
                    emphasis: {
                        show: true,
                        color: "#f60"
                    }
                },
                symbol: 'pin',
                symbolSize: 20,
                data: [{
                    name: item[0],
                    value: chinaGeoCoordMap[item[0]].concat([10]),
                }],
            }
        );
    });

    option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(166, 200, 76, 0.82)',
            borderColor: '#FFFFCC',
            showDelay: 0,
            hideDelay: 0,
            enterable: true,
            transitionDuration: 0,
            extraCssText: 'z-index:100',
            formatter: function (params, ticket, callback) {
                //根据业务自己拓展要显示的内容
                var res = "";
                var name = params.name;
                var value = params.value[params.seriesIndex + 1];
                res = "<span style='color:#fff;'>" + name + "</span><br/>数据：" + value;
                return res;
            }
        },
        //	backgroundColor:"#013954",
        visualMap: { //图例值控制
            min: 0,
            max: 1,
            calculable: true,
            show: false,
            color: ['#f44336', '#fc9700', '#ffde00', '#ffde00', '#00eaff'],
            textStyle: {
                color: '#fff'
            }
        },
        geo: {
            map: 'china',
            zoom: 1.2,
            label: {
                emphasis: {
                    show: true
                }
            },
            roam: false, //是否允许缩放
            itemStyle: {
                normal: {
                  areaColor: "rgba(43, 196, 243, 0.42)",
                  borderColor: "rgba(43, 196, 243, 1)",
                  borderWidth: 1
                },
                emphasis: {
                  areaColor: "#2B91B7"
                }
              }
        },
        series: series
    };
    return option;
}