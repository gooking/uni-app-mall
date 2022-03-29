<template>
	<view>
		<view class='noApply' v-if="applyStatus == -1">
			<u-empty mode="car" text="诚邀您成为分销商" icon="http://cdn.uviewui.com/uview/empty/car.png"></u-empty>
			<view class="block-btn">
				<van-button type="primary" block round bind:click="goForm">免费申请 等待管理员审核</van-button>
			</view>
			<view v-if=" setting.canBuy " class="block-btn">
				<u-button type="warning" round @click="buy" :text="'直接支付' + setting.price + '元，立即免审开通'"></u-button>
			</view>
		</view>

		<view class='noApply' v-if="applyStatus == 0">
			<u-empty mode="car" text="感谢您的支持，请等待管理员审核" icon="http://cdn.uviewui.com/uview/empty/car.png"></u-empty>
			<view class="block-btn">
				<u-button type="primary" round @click="goShop" text="先去逛逛"></u-button>
			</view>
		</view>

		<view class='noApply' v-if="applyStatus == 1">
			<u-empty mode="car" :text="'很遗憾，您的申请没有通过' + applyInfo.remark" icon="http://cdn.uviewui.com/uview/empty/car.png"></u-empty>
			<view class="block-btn">
				<u-button type="error" round @click="goShop" text="回首页"></u-button>
			</view>
		</view>

		<view class='noApply' v-if="applyStatus == 2">
			<u-icon name="checkmark-circle" color="#07c160" size="240"></u-icon>
			<view>恭喜您成为分销商</view>
			<view class="block-btn" style="margin-top:240rpx;">
				<u-button type="primary" round @click="goFx" text="前往分销中心"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wxlogin: true,

				applyStatus: -2, // -1 表示未申请，0 审核中 1 不通过 2 通过
				applyInfo: {},
				canvasHeight: 0
			}
		},
		methods: {
			onLoad: function (options) {
				this.setting()
			},
			onShow() {
				this.$wxapi.checkToken(this.token).then(res => {
					if (res.code === 0) {
						this.doneShow();
					}
				})
			},
			async doneShow() {
				const _this = this
				const userDetail = await this.$wxapi.userDetail(this.token)
				this.$wxapi.fxApplyProgress(this.token).then(res => {
					let applyStatus = userDetail.data.base.isSeller ? 2 : -1
					if (res.code == 2000) {
						this.wxlogin = false
						return
					}
					if (res.code === 700) {
						_this.applyStatus = applyStatus
					}
					if (res.code === 0) {
						if (userDetail.data.base.isSeller) {
							applyStatus = 2
						} else {
							applyStatus = res.data.status
						}
						_this.applyStatus = applyStatus
						_this.applyInfo = res.data
					}
				})
			},
			goForm: function (e) {
				uni.navigateTo({
					url: "/packageFx/apply/form"
				})
			},
			goShop: function (e) {
				uni.switchTab({
					url: '/pages/index/index',
				})
			},
			goFx: function (e) {
				uni.redirectTo({
					url: '/packageFx/index/index',
				})
			},
			async setting() {
				const res = await this.$wxapi.fxSetting()
				if (res.code == 0) {
					this.setting = res.data
				}
			},
			async buy() {
				const token = this.token
				let res = await this.$wxapi.userAmount(token)
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					return
				}
				if (res.data.balance >= this.setting.price) {
					// 余额足够
					res = await this.$wxapi.fxBuy(token)
					if (res.code != 0) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						return
					}
					uni.showToast({
						title: '升级成功',
					})
					setTimeout(() => {
						uni.redirectTo({
							url: '/packageFx/index/index',
						})
					}, 1000);
				} else {
					let price = this.setting.price - res.data.balance
					price = price.toFixed(2)
					wxpay.wxpay('fxsBuy', price, 0, "/packageFx/index/index");
				}
			}
		}
	}
</script>

<style>
	.noApply {
		margin-top: 150rpx;
		text-align: center;
	}
	.noApply image {
		width: 300rpx;
	}
	.profile {
		text-align: center;
		margin-top:30rpx;
		font-size: 14px;
		color:#888;
	}
	.mini-btn{
		margin-top: 50rpx;
		margin-left: 50px;
		margin-right: 50px;
	}
	.qrcode-button {
		padding:30rpx;
	}
	.canvas {
		width:750rpx;
	}
	.block-btn {
		padding: 8rpx 32rpx;
	}
</style>
