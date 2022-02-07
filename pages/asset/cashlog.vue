<template>
	<view>
		<page-box-empty v-if="!cashlogs || cashlogs.length == 0" title="暂无资金明细记录" sub-title="可以去看看有那些想买的～" :show-btn="false" />
		<u-cell v-for="(item,index) in cashlogs" :key="index" :title="item.typeStr" :label="item.dateAdd"
			:value="item.amount"></u-cell>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				cashlogs: undefined,
			}
		},
		created() {

		},
		mounted() {

		},
		onReady() {

		},
		onLoad(e) {
			this._cashLogsV2()
		},
		onShow() {

		},
		onReachBottom() {
			this.page++
			this._cashLogsV2()
		},
		onPullDownRefresh() {
			this.page = 1
			this._cashLogsV2()
			uni.stopPullDownRefresh()
		},
		methods: {
			async _cashLogsV2() {
				// https://www.yuque.com/apifm/nu0f75/khq7xu
				const res = await this.$wxapi.cashLogsV2({
					token: this.token,
					page: this.page
				})
				if (res.code == 0) {
					if(this.page == 1) {
						this.cashlogs = res.data.result
					} else {
						this.cashlogs = this.cashlogs.concat(res.data.result)
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
