<template>
	<view>
		<u-empty v-if="!members || members.length == 0" mode="car" text="暂无记录" icon="http://cdn.uviewui.com/uview/empty/car.png"></u-empty>
		<u-cell v-for="(item,index) in members" :title="'月份' + item.month" :value="'¥' + item.curSaleroom" :label="'目标¥' + item.standardSaleroom"></u-cell>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1 // 读取第几页
			}
		},
		methods: {
			onLoad(e) {
				this.teamId = e.teamId
				this.fxTeamReport()
			},
			onShow: function () {

			},
			async fxTeamReport() {
				const res = await this.$wxapi.fxTeamReport({
					token: this.token,
					teamId: this.teamId,
					page: this.page
				})
				if (res.code == 700) {
					if (this.page == 1) {
						this.members = []
					} else {
						uni.showToast({
							title: '没有更多了',
							icon: 'none'
						})
					}
				}
				if (res.code == 0) {
					if (this.page == 1) {
						this.members = res.data.result
					} else {
						this.members = this.members.concat(res.data.result)
					}
				}
			},
			onReachBottom: function() {
				this.page += 1
				this.fxTeamReport()
			},
			onPullDownRefresh: function() {
				this.page = 1
				this.fxTeamReport()
				uni.stopPullDownRefresh()
			},
		}
	}
</script>

<style>
	.list {
		display: flex;
		align-items: center;
		width: 100vw;
		padding: 8rpx 32rpx;
		box-sizing: border-box;
	}
	.list .l {
		width: 88rpx;
		height: 88rpx;
	}
	.list .r {
		flex: 1;
	}
</style>
