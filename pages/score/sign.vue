<template>
	<view>
		<u-cell-group v-if="scoreSignRules" title="签到规则">
			<u-cell v-for="(item,index) in scoreSignRules" :title="'连续签到' + item.continuous + '天'"
				:value="'赠送' + item.score + '积分'"></u-cell>
		</u-cell-group>
		<view class="zwqd-box">
		   <image src="/static/images/zw.png" @click="sign"></image>
		   <view>点击签到</view>
		</view>
		<u-alert v-if="todaySigned" class="mt32" title="今日已签到" type = "success" description="坚持每日签到,领取更多积分～" center></u-alert>
		<u-cell class="mt32" title="签到记录" isLink url="/pages/score/signlog"></u-cell>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scoreSignRules: undefined,
				todaySigned: false,
			}
		},
		created() {

		},
		mounted() {

		},
		onReady() {

		},
		onLoad(e) {
			this._scoreSignRules()
			this.scoreTodaySignedInfo()
		},
		onShow() {

		},
		methods: {
			async _scoreSignRules() {
				// https://www.yuque.com/apifm/nu0f75/pg4seb
				const res = await this.$wxapi.scoreSignRules()
				if (res.code == 0) {
					this.scoreSignRules = res.data
				}
			},
			async scoreTodaySignedInfo() {
				// https://www.yuque.com/apifm/nu0f75/hbezwt
				const res = await this.$wxapi.scoreTodaySignedInfo(this.token)
				if (res.code == 0) {
					this.todaySigned = true
				}
			},
			async sign() {
				if(this.todaySigned) {
					uni.showToast({
						title: '今日您已签到',
						icon: 'none'
					})
					return
				}
				// https://www.yuque.com/apifm/nu0f75/dqdgem
				const res = await this.$wxapi.scoreSign(this.token)
				if (res.code == 10000) {
					wx.showToast({
						title: '签到成功',
						icon: 'success'
					})
					this.scoreSignLogs()
					return
				}
				if (res.code != 0) {
					wx.showToast({
						title: res.msg,
						icon: 'none'
					})
				} else {
					wx.showToast({
						title: '签到成功',
						icon: 'success'
					})
					this.scoreSignLogs()
				}
			},
		}
	}
</script>
<style scoped lang="scss">
.zwqd-box {
  text-align: center;
  margin: auto;
  margin-top: 88rpx;
}
.zwqd-box image {
  width: 140rpx;
  height: 140rpx;
  margin: auto;
}
.zwqd-box view {
  margin-top: 16rpx;
  color: #999;
  font-size: 26rpx;
}
</style>
