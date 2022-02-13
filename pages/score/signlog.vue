<template>
	<view>
		<page-box-empty v-if="!scoreSignLogs || scoreSignLogs.length == 0" title="暂无签到记录" sub-title="签到即可获得积分～"
			:show-btn="false" />
		<u-cell v-for="(item,index) in scoreSignLogs" :key="index" :title="item.dateAdd" :value="'连续签到' + item.continuous + '天'"></u-cell>		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				scoreSignLogs: []
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			this._scoreSignLogs()
		},
		onShow() {

		},
		onPullDownRefresh() {
			this.page = 1
			this._scoreSignLogs()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			this.page++
			this._scoreSignLogs()
		},
		methods: {
			async _scoreSignLogs() {
				uni.showLoading({
					title: ''
				})
				// https://www.yuque.com/apifm/nu0f75/scftkq
				const res = await this.$wxapi.scoreSignLogs({
					token: this.token,
					page: this.page
				})
				uni.hideLoading()
				if (res.code == 0) {
					res.data.result.forEach(ele => {
						ele.dateAdd = ele.dateAdd.split(' ')[0]
					})
					if(this.page == 1) {
						this.scoreSignLogs = res.data.result
					} else {
						this.scoreSignLogs = this.scoreSignLogs.concat(res.data.result)
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
