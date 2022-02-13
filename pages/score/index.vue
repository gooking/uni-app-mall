<template>
	<view>
		<view class="score">
		  <view>可用积分</view>
		  <view class="price-score">
		  	<view class="item"><text><image class="score-icon" src="/static/images/score.png"></image></text>{{ score }}</view>
		  </view>
		</view>
		<u-cell title="签到赚积分" isLink url="/pages/score/sign"></u-cell>
		<u-cell title="积分券兑换积分" isLink url="/pages/score/excharge"></u-cell>
		<u-cell title="积分兑换成长值" isLink url="/pages/growth/excharge"></u-cell>
		<u-cell title="积分明细" isLink url="/pages/score/logs"></u-cell>		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				score: 0
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			
		},
		onShow() {
			this._userAmount()
		},
		methods: {
			async _userAmount() {
				const res = await this.$wxapi.userAmount(this.token)
				if (res.code == 0) {
					this.score = res.data.score
				}
			},
		}
	}
</script>
<style scoped lang="scss">
.score {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 750rpx;  
  padding-top:50rpx;
  height: 150rpx;
  text-align: center;
  font-size: 14px;
  line-height: 30px;
}
</style>
