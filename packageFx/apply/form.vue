<template>
	<view>
		<image v-if="adPositionFxTopPic" class="logo" :src="adPositionFxTopPic.val" mode="widthFix" />
		
		<u-divider text="申请成为分销商"></u-divider>
		<u-formref="uForm" label-width="130rpx">
			<u-form-item v-if="userDetail && userDetail.referrer" label="邀请人">
				<u-input v-model="userDetail.referrer.nick" />
			</u-form-item>
			<u-form-item label="姓名">
				<u-input v-model="name" clearable required placeholder="请输入真实姓名"/>
			</u-form-item>
			<u-form-item label="手机">
				<u-input v-model="mobile" type="number" clearable required placeholder="请输入手机号码"/>
			</u-form-item>
		
		</u-form
		
		
		<view class="tips">成为分销商后卖出商品，您可以获得佣金</view>
		<view class="btns">
		  <button type="primary" @click="bindSave">申请成为分销商</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				mobile: '',
				userDetail: [],
				adPositionFxTopPic: [],
			}
		},
		methods: {
			onLoad: function (options) {
				this.adPosition()
			},

			onShow: function () {
				const _this = this
				this.$wxapi.userDetail(this.token).then(res => {
					if (res.code === 0) {
						_this.userDetail = res.data
					}
				})
			},
			async adPosition() {
				const res = await this.$wxapi.adPosition('fx-top-pic')
				if (res.code == 0) {
					this.adPositionFxTopPic = res.data
				}
			},
			bindSave(){
				const fx_subscribe_ids = uni.getStorageSync('fx_subscribe_ids')
				if (fx_subscribe_ids) {
					uni.requestSubscribeMessage({
						tmplIds: fx_subscribe_ids.split(','),
						success(res) {

						},
						fail(e) {
							console.error(e)
						},
						complete: (e) => {
							this.bindSaveDone()
						},
					})
				} else{
					this.bindSaveDone()
				}
			},
			bindSaveDone: function () {
				const name = this.name
				const mobile = this.mobile
				if (!name) {
					uni.showToast({
						title: '请输入真实姓名',
						icon: 'none'
					})
					return
				}
				if (!mobile) {
					uni.showToast({
						title: '请输入手机号码',
						icon: 'none'
					})
					return
				}
				this.$wxapi.fxApply(this.token, name, mobile).then(res => {
					if (res.code != 0) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						return
					}
					uni.redirectTo({
						url: "/packageFx/apply/index"
					})
				})
			},
		}
	}
</script>

<style>
	.logo {
		width: 750rpx;
	}
	.tips {
		color: #666;
		font-size: 28rpx;
		padding: 32rpx;
	}
	.btns {
		padding: 32rpx;
	}
</style>
