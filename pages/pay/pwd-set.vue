<template>
	<view>
		<view class="form-box">
			<u-form ref="uForm" label-width="130rpx" :model="form">
				<u-form-item label="交易密码" prop="pwd" required>
					<u-input v-model="form.pwd" type="password" clearable placeholder="请输入交易密码"></u-input>
				</u-form-item>
				<u-form-item label="再次输入" prop="pwd2" required>
					<u-input v-model="form.pwd2" type="password" clearable placeholder="请再次输入交易密码"></u-input>
				</u-form-item>
				<u-alert title="为了保障您的资金安全，余额支付、优惠买单、申请提现的时候可能会需要交易密码" type="error" :description="description">
				</u-alert>
			</u-form>
		</view>
		<view class="submit-btn">
			<u-button type="success" @click="submit">设置交易密码</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rules: {
					pwd: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					pwd2: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				form: {
					pwd: null,
					pwd2: null,
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
		onLoad(e) {},
		onShow() {

		},
		methods: {
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
				if (this.form.pwd != this.form.pwd2) {
					uni.showToast({
						title: '两次密码输入不一致',
						icon: 'none'
					})
					return
				}
				const res = await this.$wxapi.setPayPassword(this.token, this.form.pwd)
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
					content: '设置成功',
					confirmText: '知道了',
					success: () => {
						uni.navigateBack()
					}
				})
			},
		}
	}
</script>
<style scoped lang="scss">
	.form-box {
		padding: 32rpx;
	}
</style>
