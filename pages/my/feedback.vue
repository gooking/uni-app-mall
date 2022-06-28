<template>
	<view>
		<view class="form-box">
			<u-form ref="uForm" label-width="130rpx" :model="form">
				<u-form-item label="姓名" prop="name" required>
					<u-input v-model="form.name" clearable placeholder="如何称呼您"></u-input>
				</u-form-item>
				<u-form-item label="联系电话" prop="mobile" required>
					<u-input v-model="form.mobile" clearable placeholder="方便我们与您联系"></u-input>
				</u-form-item>
				<u-form-item label="微信号" prop="wx">
					<u-input v-model="form.wx" clearable placeholder="填写您的微信号"></u-input>
				</u-form-item>
				<u-form-item label="上传文件" prop="wx">
					<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" accept="media" multiple>
					</u-upload>
				</u-form-item>
				<u-form-item label="反馈内容" prop="content">
					<u-textarea v-model="form.content" clearable placeholder="请留下您的宝贵建议或意见～"></u-textarea>
				</u-form-item>
			</u-form>
		</view>
		<view class="submit-btn">
			<u-button type="success" @click="submit">提交反馈</u-button>
		</view>
	</view>
</template>

<script>
	const PAY = require('@/common/pay.js')
	export default {
		data() {
			return {
				fileList: [],
				balance: 0.00,
				rules: {
					name: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					mobile: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					content: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				form: {
					name: null,
					mobile: null,
					wx: null,
					content: null,
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
		onShareAppMessage() {
			return {
				title: '意见反馈 - ' + this.sysconfigMap.mallName,
				path: '/pages/my/feedback?inviter_id=' + this.uid
			}
		},
		methods: {
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				this.fileList = this.fileList.concat(event.file)
			},
			deletePic(event) {
				this.fileList.splice(event.index, 1)
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
				const extJsonStr = {}
				extJsonStr['姓名'] = this.form.name
				extJsonStr['联系电话'] = this.form.mobile
				extJsonStr['微信'] = this.form.wx
				// 批量上传附件
				if (this.fileList) {
					for (let index = 0; index < this.fileList.length; index++) {
						const pic = this.fileList[index];
						const res = await this.$wxapi.uploadFile(this.token, pic.url)
						if (res.code == 0) {
							extJsonStr['file' + index] = res.data.url
						}
					}
				}
				const res = await this.$wxapi.addComment({
					token: this.token,
					type: 1,
					extJsonStr: JSON.stringify(extJsonStr),
					content: this.form.content
				})
				if (res.code == 0) {
					uni.showModal({
						showCancel: false,
						title: '成功',
						content: '提交成功',
						confirmText: '知道了',
						success: () => {
							uni.navigateBack()
						}
					})
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
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
