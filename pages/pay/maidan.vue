<template>
	<view>
		<view class="form-box">
			<u--form ref="uForm" label-width="130rpx" :model="form">
				<u-form-item label="消费金额" prop="amount" required>
					<u--input v-model="form.amount" type="digit" clearable focus placeholder="请询问服务员本次消费金额"></u--input>
				</u-form-item>
				<u-form-item label="消费金额" prop="payType" required>
					<u-radio-group v-model="form.payType">
						<u-radio label="余额支付" :name="0"></u-radio>
						<u-radio :customStyle="{marginLeft: '16rpx'}" label="微信支付" :name="1"></u-radio>
					</u-radio-group>
				</u-form-item>
			</u--form>
		</view>
		<u-cell-group v-if="payBillDiscounts" title="优惠规则">
			<u-cell v-for="(item,index) in payBillDiscounts" :title="'累计消费满' + item.consume + '元'" :label="item.loop ? '可累计' : ''"
				:value="'减' + item.discounts + '元'"></u-cell>
		</u-cell-group>
		<u-cell-group class="mt32" title="我的余额">
			<u-cell title="可用余额" :value="balance"></u-cell>
			<u-cell title="冻结余额" :value="freeze"></u-cell>
		</u-cell-group>
		<view class="submit-btn">
			<u-button type="success" @click="submit">立即支付</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				balance: 0.00,
				freeze: 0.00,
				rules: {
					amount: [{
						required: true,
						type: 'number',
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					payType: [{
						required: true,
						type: 'number',
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				form: {
					amount: undefined,
					payType: 0
				},
				payBillDiscounts: undefined
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(e) {
			this._payBillDiscounts()
			this._userAmount()
		},
		onShow() {

		},
		methods: {
			async _userAmount() {
				// https://www.yuque.com/apifm/nu0f75/wrqkcb
				const res = await this.$wxapi.userAmount(this.token)
				if (res.code == 0) {
					this.balance = res.data.balance.toFixed(2)
					this.freeze = res.data.freeze.toFixed(2)
				}
			},
			async _payBillDiscounts() {
				// https://www.yuque.com/apifm/nu0f75/ugh8nw
				const res = await this.$wxapi.payBillDiscounts()
				if (res.code == 0) {
					this.payBillDiscounts = res.data.filter(ele => { return ele.openScenePay })
				}
			},
			async submit() {
				this.$refs.uForm.validate().then(res => {
					this._submit()
				}).catch(errors => {
					uni.showToast({
						title: '表单请填写完整',
						icon: 'none'
					})
				})
			},
			async _submit() {
				if(this.form.payType == 0) {
					// 余额买单
					// https://www.yuque.com/apifm/nu0f75/aesrcd
					const res = await this.$wxapi.payBillV2({
						token: this.token,
						shopId: '',
						money: this.form.amount
					})
					if(res.code != 0) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						return
					}
					uni.showToast({
						title: '买单成功'
					})
					setTimeout(function() {
						uni.navigateTo({
							url: '/pages/asset/cashlog'
						})
					}, 1000);
				}
				if(this.form.payType == 1) {
					// 微信支付
					// #ifdef H5
					const ua = window.navigator.userAgent.toLowerCase();
					if (ua.match(/MicroMessenger/i) == 'micromessenger') {
						// https://www.yuque.com/apifm/nu0f75/mghxuo
						res = await this.$wxapi.wxpayJsapi({
							token: this.token,
							money: this.form.amount,
							remark: '优惠买单',
							payName: '优惠买单',
							nextAction: `{type: 4, shopId: '', money: ${this.form.amount}}`
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
							  uni.navigateTo({
							  	url: '/pages/asset/cashlog'
							  })
							}
						})
					} else {
						// 普通浏览器，调用h5支付
						// https://www.yuque.com/apifm/nu0f75/pv7gll
						const res = await this.$wxapi.wxpayH5({
							token: this.token,
							money: this.form.amount,
							remark: '优惠买单',
							payName: '优惠买单',
							nextAction: `{type: 4, shopId: '', money: ${this.form.amount}}`
						})
						if(res.code != 0) {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
							return
						}
						location.href = res.data.mweb_url
					}
					// #endif
					// #ifdef MP-WEIXIN
					wxpay.wxpay('paybill', this.form.amount, 0, '/pages/asset/cashlog', {
						money: this.form.amount
					})
					// #endif
					// #ifdef APP-PLUS
					// https://www.yuque.com/apifm/nu0f75/uvauoz
					const res = await this.$wxapi.wxpayApp({
						token: this.token,
						appid: getApp().globalData.wxpayOpenAppId,
						money: this.form.amount,
						remark: '优惠买单',
						payName: '优惠买单',
						nextAction: `{type: 4, shopId: '', money: ${this.form.amount}}`
					})
					uni.requestPayment({
						provider: 'wxpay', // alipay wxpay baidu appleiap
						orderInfo: res.data, // https://uniapp.dcloud.io/api/plugins/payment?id=orderinfo
						success: res => {
							uni.navigateTo({
								url: "/pages/asset/cashlog"
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
			},
		}
	}
</script>
<style scoped lang="scss">

</style>
