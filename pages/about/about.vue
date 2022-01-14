<template>
	<view v-if="resData" class="about">
		<view class="content">
			<u-parse :html="resData.info.content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: undefined,
				resData: undefined,
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			this.key = e.key
			this._cmsPage()
		},
		onShow() {

		},
		onShareAppMessage(e) {
			
		},
		methods: {
			async _cmsPage() {
				const res = await this.$api.cmsPage(this.key)
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					uni.navigateBack()
					return
				}
				uni.setNavigationBarTitle({
					title: res.data.info.title
				})
				this.resData = res.data
			},
		}
	}
</script>
<style scoped lang="scss">
.about {
	.content {
		padding: 32rpx;
	}
}
</style>
