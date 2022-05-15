<template>
	<view>
		<u-empty mode="permission" text="重置登陆密码" marginTop="88rpx"></u-empty>
		<view class="form-box">
			<u-formref="uForm" label-width="150rpx" :model="form">
				<u-form-item label="手机号码" prop="mobile" required>
					<u-input v-model="form.mobile" type="number" clearable maxlength="11" focus placeholder="请输入手机号码"></u-input>
				</u-form-item>
				<u-form-item label="图片验证码" prop="imgcode" required>
					<u-input v-model="form.imgcode" type="number" clearable maxlength="4" focus placeholder="请输入图片验证码"></u-input>
					<view slot="right">
						<u-image :showLoading="true" :src="imgsrc" width="200rpx" height="80rpx" @click="changeImgCode"></u-image>
					</view>
				</u-form-item>
				<u-form-item label="短信验证码" prop="code" required>
					<u-input v-model="form.code" type="number" clearable maxlength="4" focus placeholder="请输入短信验证码"></u-input>
					<view slot="right" style="padding-left: 24rpx;">
						<u-toast ref="uToast"></u-toast>
						<u-code :seconds="seconds" @end="end" @start="start" ref="uCode" keepRunning @change="codeChange"></u-code>
						<u-button type="success" size="small" @tap="getCode">{{tips}}</u-button>
					</view>
				</u-form-item>
				<u-form-item label="新密码" prop="pwd" required>
					<u-input v-model="form.pwd" type="password" clearable placeholder="请输入新的登陆密码"></u-input>
				</u-form-item>
			</u-form
		</view>
		<view class="submit">
			<u-button type="success" @click="submit">立即重置密码</u-button>
			<view class="text-btns">
				<view @click="goLogin">已有账号？直接登陆</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgkey: undefined, // 图形验证码的key
				imgsrc: undefined, // 图形验证码图片地址
				seconds: 60, // 倒计时多少秒
				tips: undefined, // 倒计时提示信息
				rules: {
					mobile: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					imgcode: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					code: [{
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
					imgcode: undefined,
					code: undefined,
					pwd: undefined
				},
			}
		},
		created() {
			this.changeImgCode()
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
			changeImgCode() {
				this.imgkey = Math.random()
				// https://www.yuque.com/apifm/nu0f75/spvwou
				this.imgsrc = this.$wxapi.graphValidateCodeUrl(this.imgkey)
			},
			// 倒计时
			codeChange(text) {
				this.tips = text;
			},
			async getCode() {
				if(this.$refs.uCode.canGetCode) {
					if(!this.form.mobile) {
						uni.$u.toast('请输入手机号码');
						return
					}
					if(!this.form.imgcode) {
						uni.$u.toast('请输入图形验证码');
						return
					}
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					// https://www.yuque.com/apifm/nu0f75/pmoz4u
					const res = await this.$wxapi.smsValidateCode(this.form.mobile, this.imgkey, this.form.imgcode)
					if(res.code != 0) {
						uni.$u.toast(res.msg);
						return
					}
					uni.hideLoading();
					uni.$u.toast('验证码已发送');
					this.$refs.uCode.start();
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			end() {
				// uni.$u.toast('倒计时结束');
			},
			start() {
				// uni.$u.toast('倒计时开始');
			},
			goLogin() {
				uni.redirectTo({
					url: '/pages/login/login'
				})
			},
			async submit() {
				if(!this.form.mobile) {
					uni.$u.toast('请输入手机号码');
					return
				}
				if(!this.form.code) {
					uni.$u.toast('请输入短信验证码');
					return
				}
				// https://www.yuque.com/apifm/nu0f75/iu8731
				const res = await this.$wxapi.resetPwdUseMobileCode(this.form.mobile, this.form.pwd, this.form.code)
				if(res.code == 10000) {
					uni.$u.toast('当前用户不存在，请先注册');
					return
				}
				if(res.code != 0) {
					uni.$u.toast(res.msg);
					return
				}
				uni.navigateBack()
			}
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
