<template>
	<view>
		<u-sticky>
			<u-subsection :list="list" :current="activeIndex" @change="tabChange"></u-subsection>
		</u-sticky>
		<u-empty v-if="!members || members.length == 0" text="暂无团队" mode="car" icon="http://cdn.uviewui.com/uview/empty/car.png"></u-empty>
		<view v-for="(item,index) in members" class="list">
			<image :src="item.avatarUrls" mode="aspectFill" class="l"></image>
			<view class="r">
				<u-cell :title="item.nicks" :label="item.mobileMasks" isLink :url="'myusers-detail?id=' + item.uids"></u-cell>
				<u-cell title="成交额" :value="'¥' + item.totalPayAmount ? item.totalPayAmount : 0" titleStyle="flex:2"></u-cell>
				<u-cell title="订单数" :value="item.totalPayNumber ? item.totalPayNumber : 0 + '笔'" :label="'最近下单:' + item.lastOrderDate ? item.lastOrderDate : '-'" titleStyle="flex:2"></u-cell>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				members: [],
				list: [
					{
						name: '直推'
					}, 
					{
						name: '间推'
					}
				],
				number1: 0, // 直推用户数
				number2: 0, // 间推用户数
				activeIndex: 0, // tab点亮索引
				page: 1 // 读取第几页
			}
		},
		methods: {
			onLoad: function () {
				this.fxMembersStatistics()
				this.fxMembers()
			},
			onShow: function () {

			},
			async fxMembersStatistics() {
				const res = await this.$wxapi.fxMembersStatistics(this.token)
				if (res.code == 0) {
					this.number1 = res.data.totleFansLevel1
					this.number2 = res.data.totleFansLevel2
				}
			},
			async fxMembers() {
				const res = await this.$wxapi.fxMembers({
					token: this.token,
					page: this.page,
					level: this.activeIndex == 0 ? 1 : 2
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
					const statisticsCommisionMap = res.data.statisticsCommisionMap
					const userCashMap = res.data.userCashMap
					res.data.result.forEach(ele => {
						if (!ele.avatarUrls) {
							ele.avatarUrls = '/images/nav/my-off.png'
						}
						if (!ele.nicks) {
							ele.nicks = '用户' + ele.uids
						}
						const _statisticsCommisionMap = statisticsCommisionMap[ele.uids]
						if (_statisticsCommisionMap) {
							ele.saleroom = _statisticsCommisionMap.saleroom
							ele.numberOrder = _statisticsCommisionMap.numberOrder
						}
						if (userCashMap) {
							const _userCashMap = userCashMap[ele.uids]
							if (_userCashMap) {
								ele.totleConsumed = _userCashMap.totleConsumed
								ele.totalPayNumber = _userCashMap.totalPayNumber
								ele.totalPayAmount = _userCashMap.totalPayAmount
							}
						}
					})
					if (this.page == 1) {
						this.members = res.data.result
					} else {
						this.members = this.members.concat(res.data.result)
					}
				}
			},
			tabChange(index) {
				this.activeIndex = index
				this.page = 1
				this.fxMembers()
			},
			onReachBottom: function() {
				this.page += 1
				this.fxMembers()
			},
			onPullDownRefresh: function() {
				this.page = 1
				this.fxMembersStatistics()
				this.fxMembers()
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
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}
	.list .r {
		flex: 1;
	}
</style>
