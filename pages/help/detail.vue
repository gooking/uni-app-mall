<template>
	<view>
		<view v-if="cmsArticleDetail" class="content">
			<u-parse :content="cmsArticleDetail.content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cmsArticleDetail: undefined
			}
		},
		created() {

		},
		mounted() {

		},
		onReady() {

		},
		onLoad(e) {
			this.fetchDetail(e.id)
		},
		onShow() {

		},
		methods: {
			async fetchDetail(id) {
				const res = await this.$wxapi.cmsArticleDetail(id)
				if (res.code == 0) {
					this.cmsArticleDetail = res.data
					uni.setNavigationBarTitle({
						title: res.data.title,
					})
				}
			},
		}
	}
</script>
<style scoped lang="scss">
	.content {
		padding: 32rpx;
		color: #333;
		line-height: 64rpx;
	}
</style>
