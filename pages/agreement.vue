<template>
	<view class="agreement">
		<u-parse :content="content"></u-parse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: undefined
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			this.commonPageContent(e.key)
		},
		onShow() {

		},
		onShareAppMessage(e) {
			return {
			  title: '',
			  path: ''
			}
		},
		methods: {
			async commonPageContent(key) {
				const res = await this.$wxapi.cmsPage(key)
				if(res.code == 0) {
					uni.setNavigationBarTitle({
						title: res.data.info.title
					})
					this.content = res.data.info.content
				}
			}
		}
	}
</script>
<style scoped lang="scss">
.agreement {
	padding: 32rpx;
}
</style>
