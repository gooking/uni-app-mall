<template>
	<view>
		<view class="score">
		  <view>当前成长值</view>
		  <view class="price-score">
		  	<view class="item"><text>€</text>{{ growth }}</view>
		  </view>
		</view>
		<u-cell title="积分兑换成长值" isLink url="/pages/growth/excharge"></u-cell>
		<u-cell title="成长值明细" isLink url="/pages/growth/logs"></u-cell>		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				growth: 0
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
					this.growth = res.data.growth
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
