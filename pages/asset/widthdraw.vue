<template>
	<view>
		<view class="form-box">
			<u-form ref="uForm" label-width="130rpx" :model="form">
				<u-form-item label="提现方式" prop="withdrawType" required>
					<u-radio-group v-model="form.withdrawType" @change="radioChange">
						<u-radio label="提现到微信" :name="0"></u-radio>
						<u-radio :customStyle="{marginLeft: '16rpx'}" label="提现到银行卡" :name="1"></u-radio>
					</u-radio-group>
				</u-form-item>
				<template v-if="userBankInfo">
					<u-form-item label="所在地">
						<u-text mode="text" :text="userBankInfo.info.provinceStr + userBankInfo.info.cityStr + userBankInfo.info.areaStr + userBankInfo.info.streetStr" align="right"></u-text>
					</u-form-item>
					<u-form-item label="开户银行">
						<u-text mode="text" :text="userBankInfo.info.bankName" align="right"></u-text>
					</u-form-item>
					<u-form-item label="支行">
						<u-text mode="text" :text="userBankInfo.info.bankBranch" align="right"></u-text>
					</u-form-item>
					<u-form-item label="姓名">
						<u-text mode="name" :text="userBankInfo.info.name" format="encrypt" align="right"></u-text>
					</u-form-item>
					<u-form-item label="账号">
						<u-text mode="name" :text="userBankInfo.info.bankCardNumber" format="encrypt" align="right"></u-text>
					</u-form-item>
				</template>
				<u-form-item label="可提金额">
					<u-text mode="price" :text="balance" align="right"></u-text>
				</u-form-item>
				<u-form-item label="提现金额" prop="amount" required>
					<u-input v-model="form.amount" type="digit" clearable placeholder="请输入提现金额"></u-input>
				</u-form-item>
			</u-form>
		</view>
		<view class="submit-btn">
			<u-button type="success" @click="submit">申请提现</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				balance: 0.00,
				userBankInfo: undefined,
				rules: {
					withdrawType: [{
						required: true,
						type: 'number',
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					amount: [{
						required: true,
						type: 'number',
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				form: {
					withdrawType: 0, // 0微信 1银行卡
					amount: undefined
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
			this._userAmount()
		},
		onShow() {

		},
		methods: {
			async _userAmount() {
				// https://www.yuque.com/apifm/nu0f75/wrqkcb
				const res = await this.$wxapi.userAmount(this.token)
				if (res.code == 0) {
					this.balance = res.data.balance.toFixed(2)
				}
			},
			radioChange(withdrawType) {
				if(withdrawType == 1) {
					this._userBankInfo()
				}
			},
			async _userBankInfo() {
				// https://www.yuque.com/apifm/nu0f75/kpshdz
				const res = await this.$wxapi.userBankInfo(this.token)
				if (res.code == 0) {
					this.userBankInfo = res.data
				} else {
					this.userBankInfo = null
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
				if(this.form.withdrawType == 1 && !this.userBankInfo) {
					uni.$u.toast('请先绑定提现银行卡');
					return
				}
				const data = {
					token: this.token,
					money: this.form.amount,
				}
				if(this.form.withdrawType == 1) {
					data.name = this.userBankInfo.info.name
					data.bankName = this.userBankInfo.info.bankName
					data.bankBranch = this.userBankInfo.info.bankBranch
					data.bankCardNumber = this.userBankInfo.info.bankCardNumber
				}
				// https://www.yuque.com/apifm/nu0f75/qb6lg7
				const res = await this.$wxapi.withDrawApplyV2(data)
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					return
				}
				uni.showToast({
					title: '申请成功，3个工作日内到账'
				})
				uni.navigateBack()
			},
		}
	}
</script>
<style scoped lang="scss">
	.form-box {
		padding: 32rpx;
	}

	.input-select {
		width: 100%;
	}
</style>
