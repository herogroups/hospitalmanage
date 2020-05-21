/**
 * date工具类
 * @author yanhang0610
 */

var YT_DATE_UTILS = {
	/**
	* 获取系统当前时间，yyyy-MM-dd HH:mm:ss 格式
	*/
	getNowDateTime: function getCurrentDateString() {
		var date = new Date();

		return date.getFullYear() + "-" +
				YT_DATE_UTILS.numberStrPader(date.getMonth() + 1, 10) + "-" +
				YT_DATE_UTILS.numberStrPader(date.getDate(), 10) + " " +
				YT_DATE_UTILS.numberStrPader(date.getHours(), 10) + ":" +
				YT_DATE_UTILS.numberStrPader(date.getMinutes(), 10) + ":" +
				YT_DATE_UTILS.numberStrPader(date.getSeconds(), 10);
	},

	/**
	* 时间比较，如果datetime1>datetime2，返回true，反之返回false
	*/
	datetimeCompare: function (datetime1, datetime2) {
		var datetimeNum1 = YT_DATE_UTILS.simpleConvertDatetimeToNumber(datetime1);
		var datetimeNum2 = YT_DATE_UTILS.simpleConvertDatetimeToNumber(datetime2);

		return datetimeNum1 > datetimeNum2;
	},

	/**
	* 数字格式化，如将3格式化为03、003
	* @param data 要格式化的数字
	* @param baseData 格式化基数，为10、100、1000等，作用是将data格式化为如03、003、0003格式
	*/
	numberStrPader: function padNumber(data, baseData) {
		if (data > baseData) {
			return data;
		} else {
			return new Number(baseData * 10 + data).toString().substring(1);
		}
	},

	/**
	* 将yyyy-MM-dd HH:mm:ss格式时间转换为数值yyyyMMddHHmmss
	*/
	simpleConvertDatetimeToNumber: function simpleConvertDatetimeToNumber(datetime) {
		if (datetime == null) {
			return 0;
		}

		datetime = datetime.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");

		if (isNaN(datetime)) {
			return 0;
		}

		return datetime;
	},

	/**
	* 休眠ms毫秒
	*/
	sleep: function (ms) {
		var begin = new Date().getTime();
		var now = new Date().getTime();

		while (now - begin <= ms) {
			now = new Date().getTime();
		}
	},

	/**      
	* 对Date的扩展，将 Date 转化为指定格式的String并返回      
	* 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符      
	* 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)      
	* eg:      
	* format(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2016-07-02 08:09:09.423      
	* format(new Date(), "yyyy-MM-dd E HH:mm:ss") ==> 2019-03-10 二 20:09:02      
	* format(new Date(), "yyyy-MM-dd EE hh:mm:ss") ==> 2019-03-10 周二 08:09:03      
	* format(new Date(), "yyyy-MM-dd EEE hh:mm:ss") ==> 2019-03-10 星期二 08:09:01      
	* format(new Date(), "yyyy-M-d h:m:s.S") ==> 2016-7-2 8:9:1.18     
	* @param date	要格式化的时间
	* @param fmt	格式化 
	* @return 	格式化后的时间日期字符串
	*/
	format: function (date, fmt) {
		var o = {
			"M+": date.getMonth() + 1, //月份         
			"d+": date.getDate(), //日         
			"h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时         
			"H+": date.getHours(), //小时         
			"m+": date.getMinutes(), //分         
			"s+": date.getSeconds(), //秒         
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度         
			"S": date.getMilliseconds() //毫秒         
		};

		var week = {
			"0": "日",
			"1": "一",
			"2": "二",
			"3": "三",
			"4": "四",
			"5": "五",
			"6": "六"
		};

		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}

		if (/(E+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay() + ""]);
		}

		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}

		return fmt;
	},

	/**
	* 获取一定时间间隔后的日期对象。当timeInterval为负数时，获取过去的时间；当timeInterval为正数时，获取将来时间。
	* @param date 	要计算的 Date 对象
	* @param timeInterval 	需前进或后退的时间，单位：毫秒
	* @return 	计算后新的日期对象
	*/
	dateIntervalAdd: function (date, timeInterval) {
		var newDate = new Date();
		newDate.setTime(date.getTime() + timeInterval);

		return newDate;
	},

	/**
	* 按递增或递减方式获取N个一定时间间隔后的日期对象数组。当timeInterval为负数时，获取过去的时间；当timeInterval为正数时，获取将来时间。
	* @param date 	要计算的 Date 对象
	* @param timeInterval 	递增或递减时间间隔，单位：毫秒
	* @param n 	要获取的个数
	* @return 	计算后的日期对象数组，包含给定的date对象
	*/
	getIntervalDates: function (date, timeInterval, n) {
		var array = new Array();

		for (i = 0; i < n; i++) {
			array.push(YT_DATE_UTILS.dateIntervalAdd(date, timeInterval * i));
		}

		return array;
	},

	/**
	* 日期计算
	* @param srcDate 	要计算的 Date 对象
	* @param intervalType 	计算间隔类型，yMdHmswq:年月日时分秒周季度
	* @param intervalCount 	间隔次数
	* @return 	计算后新的日期对象
	*/
	dateAdd: function (srcDate, intervalType, intervalCount) {
		var dtTmp = srcDate;
		switch (intervalType) {
			case 's': return new Date(Date.parse(dtTmp) + (1000 * intervalCount));
			case 'm': return new Date(Date.parse(dtTmp) + (60 * 1000 * intervalCount));
			case 'H': return new Date(Date.parse(dtTmp) + (60 * 60 * 1000 * intervalCount));
			case 'd': return new Date(Date.parse(dtTmp) + (24 * 60 * 60 * 1000 * intervalCount));
			case 'w': return new Date(Date.parse(dtTmp) + (7 * 24 * 60 * 60 * 1000 * intervalCount));   // 周
			case 'q': return new Date(dtTmp.getFullYear(), dtTmp.getMonth() + intervalCount * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());   // 季度
			case 'M': return new Date(dtTmp.getFullYear(), dtTmp.getMonth() + intervalCount, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
			case 'y': return new Date(dtTmp.getFullYear() + intervalCount, dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
		}
	},

	/**
	* 比较日期差
	* @param dtStart 	要计算的开始 Date 对象
	* @param dtEnd 	要计算的结束 Date 对象
	* @param intervalType 	计算间隔类型，yMdHmsw:年月日时分秒周
	* @return 	间隔时间，不同intervalType对应单位不同，yMdHmsw:年月日时分秒周
	*/
	dateDiff: function (dtStart, dtEnd, intervalType) {
		switch (intervalType) {
			case 's': return parseInt((dtEnd - dtStart) / 1000);
			case 'm': return parseInt((dtEnd - dtStart) / 60000);
			case 'H': return parseInt((dtEnd - dtStart) / 3600000);
			case 'd': return parseInt((dtEnd - dtStart) / 86400000);
			case 'w': return parseInt((dtEnd - dtStart) / (86400000 * 7));
			case 'M': return (dtEnd.getFullYear() - dtStart.getFullYear()) * 12 + (dtEnd.getMonth() - dtStart.getMonth());
			case 'y': return dtEnd.getFullYear() - dtStart.getFullYear();
		}
	},

	/**
	* 把日期分割成数组
	* @param date 	要计算的 Date 对象
	* @return 	存放日期不同类型值的数组
	*/
	toArray: function (date) {
		var array = Array();
		array[0] = date.getFullYear();
		array[1] = date.getMonth();
		array[2] = date.getDate();
		array[3] = date.getHours();
		array[4] = date.getMinutes();
		array[5] = date.getSeconds();

		return myArray;
	},

	/**
	* 获取在 beginDate 和 endDate 之间的均匀间隔的 Date 数组
	* @param beginDate	开始时间对象
	* @param endDate	结束时间对象
	* @param intervalType	间隔类型，"H"：按小时间隔，"d"：按天间隔，"M"：按月间隔
	* @param interval	间隔，正整数，几小时、几天、几月
	* @param return	均匀间隔的 Date 数组
	*/
	getUniformIntervalDates: function (beginDate, endDate, intervalType, interval) {
		var result = new Array();
		result.push(beginDate);

		if ((intervalType == "M" || intervalType == "d" || intervalType == "H") && interval > 0) {

			if (beginDate > endDate) {
				interval = -interval;  // 递减
			}

			var format = "yyyy-MM-dd";
			if (intervalType == "H") {
				format = "yyyy-MM-dd HH";
			} else if (intervalType == "d") {
				format = "yyyy-MM-dd";
			} else if (intervalType == "M") {
				format = "yyyy-MM";
			}

			var endDateStr = YT_DATE_UTILS.format(endDate, format);
			var tmpDate = beginDate;
			while (true) {
				tmpDate = YT_DATE_UTILS.dateAdd(tmpDate, intervalType, interval);
				if ((YT_DATE_UTILS.format(tmpDate, format) != endDateStr) && (interval > 0 ? tmpDate <= endDate : tmpDate >= endDate)) {
					result.push(tmpDate);
				} else {
					break;
				}
			}

		}

		result.push(endDate);

		return result;
	},
	timestampToTime:function(timestamp) {
var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
Y = date.getFullYear() + '-';
M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
D = date.getDate() + ' ';
h = date.getHours() + ':';
m = date.getMinutes() + ':';
s = date.getSeconds();
return Y+M+D+h+m+s;
},
	/**
	* 把日期字符串转换为 Date 对象
	* @param dateStr
	* @return 	Date 对象
	*/
	convertDateStrToDate: function (dateStr) {
		var date = new Date();
		date.setTime(Date.parse(dateStr));

		return date;
	},
    getNowFormatDate :function(date){
    //  var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    //   + " " + date.getHours() + seperator2 + date.getMinutes()
    //    + seperator2 + date.getSeconds();
    return currentdate;
}
}





