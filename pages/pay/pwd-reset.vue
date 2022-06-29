<template>
	<view>
		<view class="form-box">
			<u-form ref="uForm" label-width="160rpx" :model="form">
				<u-form-item v-if="mobile" label="手机号码">
					<u-text mode="phone" :text="mobile" format="encrypt"></u-text>
				</u-form-item>
				<u-form-item v-else label="手机号码" required>
					<u-button type="success" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">绑定后重置</u-button>
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
			</u-form>
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
				form: {
					imgcode: null,
					code: null,
					pwd: null
				},
				rules: {
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
			getPhoneNumber(e) {
				if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
					// wx.showModal({
					// 	title: '提示',
					// 	content: e.detail.errMsg,
					// 	showCancel: false
					// })
					console.error(e)
					return;
				}
				this._getPhoneNumber(e)
			},
			async _getPhoneNumber(e) {
				const res = await this.$wxapi.bindMobileWxappV2(this.token, e.detail.code)
				if (res.code == 0) {
					uni.showToast({
						title: '绑定成功',
						icon: 'success',
						duration: 2000
					})
					this.$u.vuex('mobile', res.data)
				} else {
					uni.showModal({
						title: '提示',
						content: res.msg,
						showCancel: false
					})
				}
			},
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
					if(!this.mobile) {
						uni.$u.toast('请先绑定手机号码');
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
					const res = await this.$wxapi.smsValidateCode(this.mobile, this.imgkey, this.form.imgcode)
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
				if(!this.mobile) {
					uni.$u.toast('请先绑定手机号码');
					return
				}
				if(!this.form.code) {
					uni.$u.toast('请输入短信验证码');
					return
				}
				// https://www.yuque.com/apifm/nu0f75/iu8731
				const res = await this.$wxapi.resetPwdUseMobileCode(this.mobile, this.form.pwd, this.form.code)
				if(res.code != 0) {
					uni.$u.toast(res.msg);
					return
				}
				uni.showModal({
					showCancel:false,
					title: '成功',
					content: '修改成功',
					confirmText: '知道了',
					success: () => {
						uni.navigateBack()
					}
				})
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
