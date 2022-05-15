<template>
	<view>
		<u-empty mode="permission" text="请先登陆" marginTop="88rpx"></u-empty>
		<view class="form-box">
			<u-formref="uForm" label-width="130rpx" :model="form">
				<u-form-item label="手机号码" prop="mobile" required>
					<u-input v-model="form.mobile" type="number" clearable maxlength="11" focus placeholder="请输入手机号码"></u-input>
				</u-form-item>
				<u-form-item label="密码" prop="pwd" required>
					<u-input v-model="form.pwd" type="password" clearable placeholder="请输入密码"></u-input>
				</u-form-item>
			</u-form
		</view>
		<view class="submit">
			<u-button type="success" @click="submit">登陆</u-button>
			<view class="text-btns">
				<view @click="goReg">注册新账户</view>
				<view @click="goResetpwd">忘记登陆密码？</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rules: {
					mobile: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					pwd: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				form: {
					mobile: undefined,
					pwd: undefined
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

		},
		onShow() {

		},
		methods: {
			async submit() {
				// https://www.yuque.com/apifm/nu0f75/xrg5e0
				const res = await this.$wxapi.login_mobile(this.form.mobile, this.form.pwd, 'tianshitongzhuang', 'h5')
				if(res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					return
				}
				this.$u.vuex('token', res.data.token)
				this.$u.vuex('uid', res.data.uid)
				setTimeout(() => {
					uni.$emit('loginOK', {})
					uni.navigateBack()
				}, 500)
			},
			goReg() {
				uni.redirectTo({
					url: '/pages/login/reg'
				})
			},
			goResetpwd() {
				uni.navigateTo({
					url: '/pages/login/resetpwd'
				})
			},
		}
	}
</script>
<style scoped lang="scss">
.form-box {
	padding: 32rpx;
}
.submit {
	padding: 32rpx;
}
.text-btns {
	display: flex;
	justify-content: space-between;
	margin-top: 16rpx;
	font-size: 28rpx;
	color: #333;
}
</style>
