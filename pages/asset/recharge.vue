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
	const PAY = require('@/common/pay.js')
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
				PAY.pay('wxpay', {
					appid: getApp().globalData.wxpayOpenAppId
				}, this.amount, '在线充值', '在线充值', null, () => {
					uni.navigateBack()
				}, () => {
					uni.showToast({
						title: '支付失败',
						icon: 'none'
					})
				})
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
