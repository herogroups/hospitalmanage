class DateUtils {
	constructor() {
		Date.prototype.Format = function (fmt) { //author: meizz 
			var o = {
				"M+": this.getMonth() + 1, //月份 
				"d+": this.getDate(), //日 
				"h+": this.getHours(), //小时 
				"m+": this.getMinutes(), //分 
				"s+": this.getSeconds(), //秒 
				"S": this.getMilliseconds() //毫秒 
			};
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
				if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		}

	}
	/**
	 * [getYestoday 获得昨天的格式化日期]
	 * @return {[type]} [description]
	 */
	getYestoday(formatstr) {
		return new Date(new Date().getTime() - 1000 * 60 * 60 * 24).Format(formatstr)
	}
	getAddDays(days,formatstr) {
		return new Date(new Date().getTime() + 1000 * 60 * 60 * 24*days).Format(formatstr)
	}
	/**
	 * [getToday 获得今天的格式化日期]
	 * @return {[type]} [description]
	 */
	getToday(formatstr) {
		return new Date().Format(formatstr)
	}

	/**
	 * [getTomorrow 获得明天的格式化日期]
	 * @return {[type]} [description]
	 */
	getTomorrow(formatstr) {
		return new Date(new Date().getTime() + 1000 * 60 * 60 * 24).Format(formatstr)
	}
	Format(thisday,formatstr){
		return new Date(thisday ).Format(formatstr)
	}
}
module.exports = new DateUtils;