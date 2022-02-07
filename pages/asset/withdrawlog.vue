<template>
	<view>
		<page-box-empty v-if="!withDrawLogs || withDrawLogs.length == 0" title="暂无提现记录" sub-title="可前往用户中心申请提现～" :show-btn="false" />
		<u-cell v-for="(item,index) in withDrawLogs" :key="index" :title="item.statusStr" :label="item.dateAdd"
			:value="item.money"></u-cell>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				withDrawLogs: undefined,
			}
		},
		created() {

		},
		mounted() {

		},
		onReady() {

		},
		onLoad(e) {
			this._withDrawLogs()
		},
		onShow() {

		},
		onReachBottom() {
			this.page++
			this._withDrawLogs()
		},
		onPullDownRefresh() {
			this.page = 1
			this._withDrawLogs()
			uni.stopPullDownRefresh()
		},
		methods: {
			async _withDrawLogs() {
				// https://www.yuque.com/apifm/nu0f75/aw6qt6
				const res = await this.$wxapi.withDrawLogs({
					token: this.token,
					page: this.page
				})
				if (res.code == 0) {
					if(this.page == 1) {
						this.withDrawLogs = res.data
					} else {
						this.withDrawLogs = this.withDrawLogs.concat(res.data)
					}
				} else {
					if(this.page > 1) {
						uni.showToast({
							title: '没有更多了'
						})
					}
				}
			},
		}
	}
</script>
<style scoped lang="scss">

</style>
