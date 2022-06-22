<template>
	<view>
		<u-cell title="读取微信开票信息" isLink @click="chooseInvoiceTitle"></u-cell>
		<view class="form-box">
			<u-form ref="uForm" label-width="130rpx" :model="form">
				<u-form-item v-if="merchantId == 951" label="手机号码" prop="mobile" required>
					<u-input v-model="form.mobile" type="number" clearable placeholder="注册api工厂的手机号码"></u-input>
				</u-form-item>
				<u-form-item label="发票抬头" prop="comName" required>
					<u-input v-model="form.comName" type="text" clearable placeholder="公司名称"></u-input>
				</u-form-item>
				<u-form-item label="税号" prop="tfn" required>
					<u-input v-model="form.tfn" type="text" clearable placeholder="填写税号"></u-input>
				</u-form-item>
				<u-form-item label="发票内容" prop="consumption" required>
					<u-input v-model="form.consumption" type="text" clearable placeholder="发票上填写的服务内容"></u-input>
				</u-form-item>
				<u-form-item label="发票金额" prop="amount" required>
					<u-input v-model="form.amount" type="digit" clearable placeholder="申请开票金额"></u-input>
				</u-form-item>
				<u-form-item label="地址电话" prop="address">
					<u-input v-model="form.address" type="digit" clearable placeholder="发票栏目处填写的地址与电话"></u-input>
				</u-form-item>
				<u-form-item label="银行账号" prop="bank">
					<u-input v-model="form.bank" type="text" clearable placeholder="发票栏目处填写的开户行与账号"></u-input>
				</u-form-item>
				<u-form-item label="电子邮箱" prop="email" required>
					<u-input v-model="form.email" type="text" clearable placeholder="发票将通过邮件发送给你"></u-input>
				</u-form-item>
				<u-form-item label="备注" prop="remark">
					<u-input v-model="form.remark" type="text" clearable placeholder="如有特殊说明，请告诉我们"></u-input>
				</u-form-item>
			</u-form>
		</view>
		<view class="submit-btn">
			<u-button type="success" @click="submit">申请发票</u-button>
		</view>
		<view class="bottom">
			<u-cell title="发票管理" isLink url="/pages/invoice/list"></u-cell>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				merchantId: undefined,
				rules: {
					mobile: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					comName: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					tfn: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					consumption: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					amount: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					email: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				form: {
					mobile: null,
					comName: null,
					tfn: null,
					consumption: '服务费',
					amount: null,
					address: null,
					bank: null,
					email: null,
					remark: null,
					orderId: '',
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
			this.merchantId = getApp().globalData.merchantId
			if (e.orderId) {
				this.form.orderId = e.orderId
				this.orderDetail(e.orderId)
			}
		},
		onShow() {

		},
		onShareAppMessage(e) {
			return {
				title: '申请开票',
				path: '/pages/invoice/apply?inviter_id=' + this.uid
			}
		},
		methods: {
			async orderDetail(orderId) {
				const res = await this.$wxapi.orderDetail(this.token, orderId)
				if (res.code == 0) {
					this.form.amount = res.data.orderInfo.amountReal + ''
				}
			},
			chooseInvoiceTitle() {
				uni.chooseInvoiceTitle({
					success: (res) => {
						this.form.comName = res.title
						this.form.tfn = res.taxNumber
						this.form.address = res.companyAddress + res.telephone
						this.form.bank = res.bankName + res.bankAccount
					},
					fail: err => {
						console.error(err);
						uni.showToast({
							title: '读取失败',
							icon: 'none'
						})
					}
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
				const extJsonStr = {}
				extJsonStr['api工厂账号'] = this.form.mobile
				extJsonStr['地址与电话'] = this.form.address
				extJsonStr['开户行与账号'] = this.form.bank
				const res = await this.$wxapi.invoiceApply({
					token: this.token,
					...this.form,
					extJsonStr: JSON.stringify(extJsonStr)
				})
				if (res.code == 0) {
					uni.showModal({
						title: '成功',
						content: '提交成功，请耐心等待我们处理！',
						showCancel: false,
						confirmText: '我知道了',
						success(res) {
							uni.navigateTo({
								url: "/pages/invoice/list"
							})
						}
					})
				} else {
					uni.showModal({
						title: '失败',
						content: res.msg,
						showCancel: false,
						confirmText: '我知道了'
					})
				}
			},
		}
	}
</script>
<style scoped lang="scss">
.bottom {
	padding-bottom: 48rpx;
}
</style>
