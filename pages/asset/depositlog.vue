<template>
	<view>
		<page-box-empty v-if="!depositLogs || depositLogs.length == 0" title="暂无押金记录" sub-title="可前往用户中心支付押金～" :show-btn="false" />
		<u-cell v-for="(item,index) in depositLogs" :key="index" :title="item.statusStr + ' ('+ item.number +')'" :label="item.dateAdd"
			:value="'¥' + item.amount" isLink :name="index" @click="depositBackApply"></u-cell>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				depositLogs: undefined,
			}
		},
		created() {

		},
		mounted() {

		},
		onReady() {

		},
		onLoad(e) {
			this._depositLogs()
		},
		onShow() {

		},
		onReachBottom() {
			this.page++
			this._depositLogs()
		},
		onPullDownRefresh() {
			this.page = 1
			this._depositLogs()
			uni.stopPullDownRefresh()
		},
		methods: {
			async _depositLogs() {
				// https://www.yuque.com/apifm/nu0f75/xd6g5h
				const res = await this.$wxapi.depositList({
					token: this.token,
					page: this.page
				})
				if (res.code == 0) {
					if(this.page == 1) {
						this.depositLogs = res.data.result
					} else {
						this.depositLogs = this.depositLogs.concat(res.data.result)
					}
				} else {
					if(this.page > 1) {
						uni.showToast({
							title: '没有更多了'
						})
					}
				}
			},
			depositBackApply(e) {
				const item = this.depositLogs[e.name]
				if (item.status != 1) {
					return
				}
				uni.showModal({
					title: '请确认',
					content: '确认要申请退还押金？',
					success: res => {
						if (res.confirm) {
							this._depositBackApply(e.name)
						}
					}
				});
			},
			async _depositBackApply(index) {
				const item = this.depositLogs[index]
				const res = await this.$wxapi.depositBackApply(this.token, item.id)
				if (res.code != 0) {
					uni.showToast({
						title: '没有更多了',
						icon:"none"
					})
					return
				}
				uni.showModal({
					showCancel:false,
					title: '成功',
					content: '申请成功，请等待财务处理',
					confirmText: '知道了',
					success: () => {
						this.page = 1
						this._depositLogs()
					}
				})
			}
		}
	}
</script>
<style scoped lang="scss">

</style>
