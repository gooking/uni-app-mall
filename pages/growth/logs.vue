<template>
	<view>
		<page-box-empty v-if="!growthLogs || growthLogs.length == 0" title="暂无成长值变动记录" sub-title="可以去看看有那些想买的～"
			:show-btn="false" />
		<u-cell v-for="(item,index) in growthLogs" :key="index" :title="item.typeStr" :label="item.dateAdd"
			:value="item.growth"></u-cell>		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				growthLogs: []
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			this._growthLogs()
		},
		onShow() {

		},
		onPullDownRefresh() {
			this.page = 1
			this._growthLogs()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			this.page++
			this._growthLogs()
		},
		methods: {
			async _growthLogs() {
				uni.showLoading({
					title: ''
				})
				// https://www.yuque.com/apifm/nu0f75/gpb15y
				const res = await this.$wxapi.growthLogs({
					token: this.token,
					page: this.page
				})
				uni.hideLoading()
				if (res.code == 0) {
					if(this.page == 1) {
						this.growthLogs = res.data.result
					} else {
						this.growthLogs = this.growthLogs.concat(res.data.result)
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
