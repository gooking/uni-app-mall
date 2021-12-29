import Vue from 'vue';

function navTo(url) {
	uni.navigateTo({
		url
	})
};
// type 1:将Thu Sep 20 2018 16:23:03 GMT+0800 (中国标准时间)转换为"2018-09-20 16:23:03"日期格式
// type 2:将Thu Sep 20 2018 16:47:52 GMT+0800 (中国标准时间)||2018-09-20 16:23:03||2018-09-20转换为1537433272051时间戳格式
// 不传入参数时，type默认取值1，inputTime默认取值new Date()
function formatDateTime(type = 1, inputTime) {
	if(typeof(inputTime)=='string'){inputTime=inputTime.replace(/-/g, '/')}
	var date = inputTime ? new Date(inputTime) : new Date();
	switch (type) {
		case 1:
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? ('0' + m) : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			var h = date.getHours();
			h = h < 10 ? ('0' + h) : h;
			var minute = date.getMinutes();
			var second = date.getSeconds();
			minute = minute < 10 ? ('0' + minute) : minute;
			second = second < 10 ? ('0' + second) : second;
			return y + '-' + m + '-' + d + '-' + h + ':' + minute + ':' + second;
			break;
		case 2:
			// console.log(date,date.getTime())
			return date.getTime()
	}
};
