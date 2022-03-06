const WXAPI = require('apifm-uniapp')
import store from '@/store'

/**
 * provider 支付通道 alipay wxpay baidu appleiap
 * postDataExt 需要额外提交的参数放这里，如果没有额外提交参数，填 {}
 * money: 发起支付的金额
 * payName: 弹起用户观看的付款信息
 * remark 本次支付的备注信息，记录在后台支付记录的备注字段
 * nextAction 下一步需要做的工作，充值请填 null
 * successFuc 支付成功的回调函数
 * failFuc 支付失败的回调函数
 */
function pay(provider, postDataExt, money, payName, remark, nextAction, successFuc, failFuc) {
	const postData = {
		token: store.state.token,
		money,
		payName,
		remark,
		...postDataExt
	}
	if (nextAction) {
		postData.nextAction = JSON.stringify(nextAction)
	}
	// #ifdef H5
	const ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		// 微信浏览器
		WXAPI.wxpayJsapi(postData).then(res => {
			if (res.code != 0) {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				return
			}
			window.WeixinJSBridge.invoke(
			  'getBrandWCPayRequest', {
				'appId': res.data.appid,
				'timeStamp': res.data.timeStamp,
				'nonceStr': res.data.nonceStr,
				'package': 'prepay_id=' + res.data.prepayId,
				'signType': 'MD5',
				'paySign': res.data.sign
			  },
			  function(res) {
				if (res.err_msg === 'get_brand_wcpay_request:ok') {
					successFuc()
				} else {
					failFuc()
				}
			})
		})
		return
	} else {
		// 普通浏览器
		WXAPI.wxpayH5(postData).then(res => {
			if (res.code != 0) {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				return
			}
			window.location.href = res.data.mweb_url
		})
		return
	}
	// #endif
	// #ifdef MP-WEIXIN
	if (provider == 'wxpay') {
		WXAPI.wxpay(postData).then(res => {
			if (res.code != 0) {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				return
			}
			uni.requestPayment({
				timeStamp: res.data.timeStamp,
				nonceStr: res.data.nonceStr,
				package: res.data.package,
				signType: res.data.signType,
				paySign: res.data.paySign,
				fail: (err) => {
					console.error(err);
					failFuc(err)
				},
				success: () => {
					successFuc()
				}
			})
		})
	}
	// #endif
	// #ifdef APP-PLUS
	if (provider == 'wxpay') {
		const res = WXAPI.wxpayApp(postData).then(res => {
			if (res.code != 0) {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				return
			}
			uni.requestPayment({
				provider: 'wxpay', // alipay wxpay baidu appleiap
				orderInfo: res.data, // https://uniapp.dcloud.io/api/plugins/payment?id=orderinfo
				success: () => {
					successFuc()
				},
				fail: (err) => {
					console.error(err);
					failFuc(err)
				}
			})
		})
		return
	}
	if (provider == 'alipay') {
		const res = WXAPI.alipayAPP(postData).then(res => {
			if (res.code != 0) {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				return
			}
			uni.requestPayment({
				provider: 'alipay', // alipay wxpay baidu appleiap
				orderInfo: res.data.url, // https://uniapp.dcloud.io/api/plugins/payment?id=orderinfo
				success: () => {
					successFuc()
				},
				fail: (err) => {
					console.error(err);
					failFuc(err)
				}
			})
		})
		return
	}
	// #endif
}

module.exports = {
	pay: pay
}
