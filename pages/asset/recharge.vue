<template>
	<view>
		<u-grid col="2" :border="true" @click="gridClick">
			<u-grid-item v-for="(item,index) in rechargeSendRules" :name="index" class="grid-item">
				<text class="grid-text"><text>¥</text>{{ item.confine }}</text>
				<u-badge v-if="item.send" type="error" :value="'赠送 ¥' + item.send"></u-badge>
			</u-grid-item>
		</u-grid>
		<view class="submit-btn">
			<u--input placeholder="请输入充值金额" v-model="amount" type="digit" fontSize="38rpx" clearable></u--input>
		</view>
		<view class="submit-btn">
			<u-button type="success" @click="submit">立即充值</u-button>
		</view>
	</view>
</template>

<script>
	const wxpay = require('@/common/wxpay.js')
	export default {
		data() {
			return {
				amount: undefined,
				rechargeSendRules: undefined
			}
		},
		created() {

		},
		mounted() {

		},
		onReady() {

		},
		onLoad(e) {
			this._rechargeSendRules()
		},
		onShow() {

		},
		methods: {
			async _rechargeSendRules() {
				// https://www.yuque.com/apifm/nu0f75/be1cqu
				const res = await this.$wxapi.rechargeSendRules()
				if (res.code == 0) {
					this.rechargeSendRules = res.data
				}
			},
			gridClick(index) {
				const item = this.rechargeSendRules[index]
				this.amount = item.confine
				this.submit()
			},
			async submit() {
				if(!this.amount) {
					uni.$u.toast('请输入充值金额');
					return
				}
				if(this.sysconfigMap.recharge_amount_min && this.sysconfigMap.recharge_amount_min*1 > this.amount*1) {
					uni.$u.toast('至少充值金额：' + this.sysconfigMap.recharge_amount_min);
					return
				}
				// 发起在线支付
				// #ifdef MP-WEIXIN
				wxpay.wxpay('recharge', this.amount, 0, '/pages/asset/balance')
				// #endif
				// #ifdef H5
				const ua = window.navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == 'micromessenger') {
					// https://www.yuque.com/apifm/nu0f75/mghxuo
					res = await this.$wxapi.wxpayJsapi({
						token: this.token,
						money: this.amount,
						remark: '在线充值',
						payName: '在线充值'
					})
					if(res.code != 0) {
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
						  uni.navigateBack()
						}
					})
				} else {
					// 普通浏览器，调用h5支付
					// https://www.yuque.com/apifm/nu0f75/pv7gll
					const res = await this.$wxapi.wxpayH5({
						token: this.token,
						money: this.amount,
						remark: '在线充值',
						payName: '在线充值'
					})
					if(res.code != 0) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						uni.navigateBack()
						return
					}
					location.href = res.data.mweb_url
				}
				// #endif
				// #ifdef APP-PLUS
				// https://www.yuque.com/apifm/nu0f75/uvauoz
				const res = await this.$wxapi.wxpayApp({
					token: this.token,
					appid: getApp().globalData.wxpayOpenAppId,
					money: this.amount,
					remark: '在线充值',
					payName: '在线充值'
				})
				uni.requestPayment({
					provider: 'wxpay', // alipay wxpay baidu appleiap
					orderInfo: res.data, // https://uniapp.dcloud.io/api/plugins/payment?id=orderinfo
					success: res => {
						uni.navigateTo({
							url: "/pages/asset/balance"
						})
					},
					fail: err => {
						uni.showToast({
							title: '支付失败',
							icon: 'none'
						})
					}
				})
				// #endif
			}
		}
	}
</script>
<style scoped lang="scss">
	.grid-item {
		height: 200rpx;
		position: relative;
	}

	.grid-text {
		text {
			font-size: 26rpx;
		}
	}
</style>
