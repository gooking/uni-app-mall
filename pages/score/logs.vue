<template>
	<view>
		<page-box-empty v-if="!scorelogs || scorelogs.length == 0" title="暂无积分明细记录" sub-title="可以去看看有那些想买的～"
			:show-btn="false" />
		<u-cell v-for="(item,index) in scorelogs" :key="index" :title="item.typeStr" :label="item.dateAdd"
			:value="item.score"></u-cell>		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				scorelogs: []
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			this._scoreLogs()
		},
		onShow() {

		},
		onPullDownRefresh() {
			this.page = 1
			this._scoreLogs()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			this.page++
			this._scoreLogs()
		},
		methods: {
			async _scoreLogs() {
				uni.showLoading({
					title: ''
				})
				// https://www.yuque.com/apifm/nu0f75/khq7xu
				const res = await this.$wxapi.scoreLogs({
					token: this.token,
					page: this.page
				})
				uni.hideLoading()
				if (res.code == 0) {
					if(this.page == 1) {
						this.scorelogs = res.data.result
					} else {
						this.scorelogs = this.scorelogs.concat(res.data.result)
					}
				} else {
					if(this.page > 1) {
						uni.showToast({
							title: '没有更多了～',
							icon: 'none'
						})
					}
				}
			},
		}
	}
</script>
<style scoped lang="scss">

</style>
