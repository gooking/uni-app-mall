<template>
	<view>
		<u-cell title="头像" isLink @click="selectAvatarUrl" :border="false">
			<view slot="value">
				<text v-if="!userDetail || !userDetail.avatarUrl">设置</text>
				<image v-else class="avatarUrl" :src="userDetail.avatarUrl" mode="aspectFill"></image>
			</view>
		</u-cell>
		<view class="form-box">
			<u-form ref="uForm" label-width="130rpx" :model="form">
				<u-form-item label="昵称" prop="nick" required>
					<u-input v-model="form.nick" type="digit" clearable placeholder="请输入押金金额"></u-input>
				</u-form-item>
				<u-form-item
						label="性别"
						@click="showSex = true;"
						required
				>
					<u-input
						v-model="sex"
						disabled
						disabledColor="#ffffff"
						placeholder="请选择性别"
						border="none"
					></u-input>
					<u-icon
							slot="right"
							name="arrow-right"
					></u-icon>
				</u-form-item>
				<u-form-item
						label="手机号"
						required
				>
					<u-input
						v-model="form.mobile"
						disabled
						disabledColor="#ffffff"
						placeholder="未绑定"
						border="none"
					></u-input>
					<u-button slot="right" type="success" :text="form.mobile ? '重新绑定' : '立即绑定'" size="mini" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"></u-button>
				</u-form-item>
			</u-form>
		</view>
		<view class="submit-btn">
			<u-button type="success" @click="submit">保存</u-button>
		</view>
		<u-action-sheet
				:show="showSex"
				:actions="actions"
				title="请选择性别"
				description="如果选择保密会报错"
				@close="showSex = false"
				@select="sexSelect"
		>
		</u-action-sheet>
	</view>
</template>

<script>
	const PAY = require('@/common/pay.js')
	export default {
		data() {
			return {
				userDetail: undefined,
				avatarUrl: undefined,
				showSex: false,
				actions: [
					{
						name: '男',
					},
					{
						name: '女',
					},
				],
				sex: '',
				rules: {
					nick: [{
						required: true, 
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				form: {
					nick: null,
					mobile: null,
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
			this._userDetail()
		},
		onShow() {

		},
		methods: {
			async _userDetail() {
				// https://www.uviewui.com/components/form.html
				const res = await this.$wxapi.userDetail(this.token)
				if (res.code == 0) {
					this.userDetail = res.data.base
					this.form.nick = res.data.base.nick
					if (res.data.base.gender == 1) {
						this.sex = '男'
					}
					if (res.data.base.gender == 2) {
						this.sex = '女'
					}
					this.form.mobile = res.data.base.mobile
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
				const d = {
					token: this.token,
					nick: this.form.nick
				}
				if (this.avatarUrl) {
					const res = await this.$wxapi.uploadFile(this.token, this.avatarUrl)
					if (res.code == 0) {
						d.avatarUrl = res.data.url
					}
				}
				if (this.sex == '男') {
					d.gender = 1
				}
				if (this.sex == '女') {
					d.gender = 2
				}
				const res = await this.$wxapi.modifyUserInfo(d)
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
					content: '编辑成功',
					confirmText: '知道了',
					success: () => {
						uni.navigateBack({
							
						})
					}
				})
			},
			selectAvatarUrl() {
				uni.chooseImage({
					count: 1,
					success: res => {
						this.avatarUrl = res.tempFilePaths[0]
						this.userDetail.avatarUrl = res.tempFilePaths[0]
					}
				})
			},
			sexSelect(e) {
				this.sex = e.name
			},
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
					this.form.mobile = res.data
				} else {
					uni.showModal({
						title: '提示',
						content: res.msg,
						showCancel: false
					})
				}
			}
		}
	}
</script>
<style scoped lang="scss">
	.form-box {
		padding: 0 32rpx 32rpx 32rpx;
	}
	.avatarUrl {
		width: 88rpx;
		height: 88rpx;
	}
</style>
