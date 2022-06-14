<template>
	<view>
		<view class="form-box">
			<u-form ref="uForm" label-width="130rpx" :model="form">
				<u-form-item label="可用余额">
					<u-text mode="price" :text="balance" align="right"></u-text>
				</u-form-item>
				<u-form-item label="支付金额" prop="amount" required>
					<u-input v-model="form.amount" type="digit" clearable placeholder="请输入押金金额"></u-input>
				</u-form-item>
			</u-form>
		</view>
		<view class="submit-btn">
			<u-button type="success" @click="submit">支付押金</u-button>
		</view>
	</view>
</template>

<script>
	const PAY = require('@/common/pay.js')
	export default {
		data() {
			return {
				balance: 0.00,
				rules: {
					amount: [{
						required: true,
						type: 'number',
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				form: {
					amount: null
				},
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
				}
			},
			submit() {
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
				const onlinePayAmount = this.form.amount - this.balance
				if (onlinePayAmount <= 0) {
					// 使用余额支付押金 https://www.yuque.com/apifm/nu0f75/mpsdwi
					const res = await this.$wxapi.payDeposit({
						token: this.token,
						amount: this.form.amount
					})
					if (res.code != 0) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						return
					}
					uni.showModal({
						showCancel:false,
						title: '成功',
						content: '支付成功',
						confirmText: '知道了',
						success: () => {
							uni.redirectTo({
								url: "/pages/asset/depositlog"
							})
						}
					})
				} else {
					// 在线支付押金 TODO
					PAY.pay('wxpay', {
						appid: getApp().globalData.wxpayOpenAppId
					}, onlinePayAmount.toFixed(2), '支付押金', '支付押金', {
						type: 5,
						amount: this.form.amount
					}, () => {
						uni.redirectTo({
							url: "/pages/asset/depositlog"
						})
					}, (err) => {
						uni.showToast({
							title: '支付失败',
							icon: 'none'
						})
					})
				}
			},
		}
	}
</script>
<style scoped lang="scss">
	.form-box {
		padding: 32rpx;
	}
</style>
