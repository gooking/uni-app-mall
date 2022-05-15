<template>
	<view>
		<view class="form-box">
			<u-formref="uForm" label-width="130rpx" :model="form">
				<u-form-item label="消耗积分" prop="deductionScore" required>
					<u-input v-model="form.deductionScore" type="number" clearable focus placeholder="请输入积分数量"></u-input>
				</u-form-item>
			</u-form
		</view>
		<view class="submit-btn">
			<u-button type="success" @click="submit">立即兑换</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rules: {
					deductionScore: [{
						required: true,
						type: 'number',
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				form: {
					deductionScore: undefined
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
				// https://www.yuque.com/apifm/nu0f75/sq3tzp
				const res = await this.$wxapi.exchangeScoreToGrowth(this.token, this.form.deductionScore)
				console.log(res);
				if(res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					return
				}
				uni.showToast({
					title: '兑换成功'
				})
				setTimeout(function() {
					uni.navigateBack()
				}, 1000);
			},
		}
	}
</script>
<style scoped lang="scss">

</style>
