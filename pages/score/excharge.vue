<template>
	<view>
		<view class="form-box">
			<u-formref="uForm" label-width="130rpx" :model="form">
				<u-form-item label="券号" prop="number" required>
					<u-input v-model="form.number" clearable focus placeholder="请输入积分券号码"></u-input>
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
					number: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				form: {
					number: undefined
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
				// https://www.yuque.com/apifm/nu0f75/pdg67o
				const res = await this.$wxapi.scoreExchange(this.token, this.form.number)
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
