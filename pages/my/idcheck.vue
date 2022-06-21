<template>
	<view>
		<view class="form-box">
			<u-form ref="uForm" label-width="140rpx" :model="form">
				<u-form-item label="姓名" prop="name" required>
					<u-input v-model="form.name" clearable placeholder="请输入姓名"></u-input>
				</u-form-item>
				<u-form-item label="身份证号" prop="idcard" required>
					<u-input v-model="form.idcard" type="idcard" clearable placeholder="请输入身份证号"></u-input>
				</u-form-item>
			</u-form>
		</view>
		<view class="submit-btn">
			<u-button type="success" @click="submit">立即认证</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rules: {
					name: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					idcard: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				form: {
					name: null,
					idcard: null,
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
				const res = await this.$wxapi.idcardCheck(this.token, this.form.name, this.form.idcard)
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
					content: '认证成功',
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
