<template>
	<view v-if="!userBankInfo && userBankInfoOk">
		<view class="form-box">
			<u-form ref="uForm" label-width="130rpx" :model="form">
				<u-form-item label="银行名称" prop="bankName" required>
					<picker class="input-select" mode="selector" v-model="userBankSelectBanksIndex" :range="userBankSelectBanks" range-key="bankName" @change="userBankSelectBanksChange">
						<view @click="userBankSelectBanksShow = true">
							<u-input v-model="form.bankName" readonly placeholder="请选择开户银行" suffixIcon="arrow-right"></u-input>
						</view>
					</picker>
				</u-form-item>
				<u-form-item label="所在地区" prop="areaDisplay" required>
					<view class="input-select" @click="showRegion = true">
						<u-input v-model="form.areaDisplay" readonly placeholder="请选择省市区县、乡镇信息" suffixIcon="arrow-right"></u-input>
					</view>
					<city-select v-model="showRegion" :area-code="areaCode" :level="4" @city-change="cityChange"></city-select>
				</u-form-item>
				<u-form-item label="开户行" prop="bankBranch" required>
					<u-input v-model="form.bankBranch" clearable placeholder="请输入开户支行名称"></u-input>
				</u-form-item>
				<u-form-item label="姓名" prop="name" required>
					<u-input v-model="form.name" clearable placeholder="请输入银行开户姓名"></u-input>
				</u-form-item>
				<u-form-item label="银行账号" prop="bankCardNumber" required>
					<u-input v-model="form.bankCardNumber" type="number" clearable placeholder="请输入银行账号"></u-input>
				</u-form-item>
			</u-form>
		</view>
		<view class="submit-btn">
			<u-button type="success" @click="submit">立即绑定</u-button>
		</view>
	</view>
	<view v-else-if="userBankInfoOk">
		<u-cell title="所在地" :value="userBankInfo.info.provinceStr + userBankInfo.info.cityStr + userBankInfo.info.areaStr + userBankInfo.info.streetStr"></u-cell>
		<u-cell title="开户银行" :value="userBankInfo.info.bankName"></u-cell>
		<u-cell title="支行" :value="userBankInfo.info.bankBranch"></u-cell>
		<u-cell title="姓名">
			<u-text slot="value" mode="name" :text="userBankInfo.info.name" format="encrypt" align="right"></u-text>
		</u-cell>
		<u-cell title="账号">
			<u-text slot="value" mode="name" :text="userBankInfo.info.bankCardNumber" format="encrypt" align="right"></u-text>
		</u-cell>
		<view class="submit-btn">
			<u-button type="error" @click="userBankUnBind">解除绑定</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userBankSelectBanks: undefined,
				userBankSelectBanksIndex: -1,
				userBankInfo: undefined,
				userBankInfoOk: false,
				showRegion: false,
				rules: {
					bankName: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					areaDisplay: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					provinceId: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					cityId: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					districtId: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					streetId: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					name: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					bankBranch: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					bankCardNumber: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				form: {
					bankName: undefined,
					areaDisplay: '',
					provinceId: undefined,
					cityId: undefined,
					districtId: undefined,
					streetId: undefined,
					name: undefined,
					bankBranch: undefined,
					bankCardNumber: undefined,
				},
				areaCode: [], // 省市区的初始化，例如 ['123', '456', '789']
			}
		},
		created() {

		},
		mounted() {

		},
		onReady() {

		},
		onLoad(e) {
			this._userBankSelectBanks()
			this._userBankInfo()
		},
		onShow() {

		},
		methods: {
			async _userBankSelectBanks() {
				// https://www.yuque.com/apifm/nu0f75/asvk4y
				const res = await this.$wxapi.userBankSelectBanks()
				if(res.code == 0) {
					this.userBankSelectBanks = res.data
				}
			},
			userBankSelectBanksChange(e) {
				this.userBankSelectBanksIndex = e.detail.value
				this.form.bankName = this.userBankSelectBanks[this.userBankSelectBanksIndex].bankName
			},
			async _userBankInfo() {
				// https://www.yuque.com/apifm/nu0f75/kpshdz
				const res = await this.$wxapi.userBankInfo(this.token)
				if(res.code == 0) {
					this.userBankInfo = res.data
				} else {
					this.userBankInfo = null
					setTimeout(() => {
						this.$refs.uForm.setRules(this.rules);
					}, 500);
				}
				this.userBankInfoOk = true
			},
			cityChange(e) {
				this.form.provinceId = e.province.value
				this.form.cityId = e.city.value
				this.form.districtId = e.area.value
				this.form.streetId = e.street.value
				this.form.areaDisplay = e.province.label + e.city.label + e.area.label + e.street.label
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
				// https://www.yuque.com/apifm/nu0f75/bzvplv
				const res = await this.$wxapi.userBankBind({
					token: this.token,
					...this.form
				})
				if(res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					return
				}
				uni.showToast({
					title: '绑定成功'
				})
				this._userBankInfo()
			},
			async userBankUnBind() {
				uni.showModal({
					title: '请确认',
					content: '确定要解除绑定吗？',
					success: res => {
						if (res.confirm) {
							this._userBankUnBind()
						}
					}
				});
			},
			async _userBankUnBind() {
				// https://www.yuque.com/apifm/nu0f75/sheb7a
				const res = await this.$wxapi.userBankUnBind(this.token)
				if (res.code == 0) {
					uni.showToast({
						title: '解绑成功'
					})
					this._userBankInfo()
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
.input-select {
	width: 100%;
}
</style>
