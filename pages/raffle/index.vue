<template>
	<view class="raffle">
		<l-dialer size="568rpx" ref="dialer" :prizeList="prizeList" @click="onClick" @done="onDone">
			<template #prize="{item}">
				<image style="width: 72rpx; height: 72rpx;" :src="item.img" />
			</template>
		</l-dialer>
		<view class="number">剩余抽奖次数: {{ timesPerUser }}</view>
		<view v-if="logs" class="logs">
			<u-cell-group title="抽奖记录">
				<u-cell v-for="item in logs" :title="item.prizeName" :value="item.dateAdd"></u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	// https://ext.dcloud.net.cn/plugin?id=5367
	export default {
		data() {
			return {
				id: undefined,
				timesPerUser: 0,
				prizeList: [],
				logs: undefined,
			}
		},
		created() {

		},
		mounted() {

		},
		onReady() {

		},
		onLoad(e) {
			this.id = e.id
		},
		onShow() {
			this.luckyInfo()
		},
		onShareAppMessage(e) {

		},
		methods: {
			async luckyInfo() {
				uni.showLoading({
					title: ''
				})
				const res = await this.$wxapi.luckyInfo(this.id)
				uni.hideLoading()
				if (res.code == 0) {
					this.timesPerUser = res.data.info.timesPerUser
					if (res.data.luckyGoods) {
						const prizeList = []
						res.data.luckyGoods.forEach(ele => {
							prizeList.push({
								id: '' + ele.id,
								goodsId: ele.goodsId,
								name: ele.title,
								img: ele.pic
							})
						})
						this.prizeList = prizeList
					}
					if (this.uid) {
						const res2 = await this.$wxapi.luckyInfoJoinLogs({
							lid: this.id,
							uid: this.uid
						})
						if (res2.code == 0) {
							this.timesPerUser -= res2.data.totalRow
							this.logs = res2.data.result
						}
					} else {
						this.logs = null
					}
				}
			},
			onDone(index) {
				const prize = this.prizeList[index]
				uni.showModal({
					title: prize.goodsId == -1 ? '很遗憾' : '恭喜您',
					content: '获得' + prize.name
				})
				this.luckyInfo()
			},
			async onClick() {
				if (this.timesPerUser <= 0) {
					uni.showToast({
						title: '抽奖次数已用完',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: ''
				})
				const res = await this.$wxapi.luckyInfoJoin(this.id, this.token)
				uni.hideLoading()
				if (res.code == 2000) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					return
				}
				this.timesPerUser--
				const prizeName = res.data.prizeName
				const index = this.prizeList.findIndex(ele => ele.name == prizeName) // 服务器返回的中奖的是哪个商品
				this.$refs.dialer.run(index)
			},
		}
	}
</script>
<style scoped lang="scss">
	.raffle {
		// #ifdef H5
		min-height: calc(100vh - 44px);
		// #endif
		// #ifndef H5
		min-height: 100vh;
		// #endif
		background-color: #6339b5;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.number {
			margin: 64rpx 0;
			padding: 8rpx 16rpx;
			color: #ffffff;
			background: #9077c4;
			border-radius: 16rpx;
			font-size: 30rpx;
		}
	}
	.logs {
		width: 90vw;
		background: #fff;
	}
</style>