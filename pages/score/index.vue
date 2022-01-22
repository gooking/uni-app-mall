<template>
	<view>
		<view class="score">
		  <view>可用积分</view>
		  <view>{{score}}</view>
		</view>
		<page-box-empty v-if="!cashlogs || cashlogs.length == 0" title="暂无积分明细记录" sub-title="可以去看看有那些想买的～"
			:show-btn="false" />
		<u-cell v-for="(item,index) in cashlogs" :key="index" :title="item.typeStr" :label="item.dateAdd"
			:value="item.score"></u-cell>		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				score: 0,
				cashlogs: undefined
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			this._userAmount()
			this._scoreLogs()
		},
		onShow() {

		},
		methods: {
			async _userAmount() {
				const res = await this.$wxapi.userAmount(this.token)
				if (res.code == 0) {
					this.score = res.data.score
				}
			},
			async _scoreLogs() {
				// https://www.yuque.com/apifm/nu0f75/khq7xu
				const res = await this.$wxapi.scoreLogs({
					token: this.token
				})
				if (res.code == 0) {
					this.cashlogs = res.data.result
				}
			},
		}
	}
</script>
<style scoped lang="scss">
.score {
  display: flex;
  flex-direction: column;
  width: 750rpx;  
  padding-top:50rpx;
  height: 150rpx;
  background-color: #e85654;
  text-align: center;
  font-size: 14px;
  line-height: 30px;
  color:#fff;
}

.no-data {
  margin-top: 100rpx;
  text-align: center;
  font-size: 13px;
  color:#ccc;
}

.cashlogs {
  display: flex;
  font-size: 12px;
  margin-top: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1px solid #eee;
  line-height: 20px;
}
.cashlogs .profile {
  width:600rpx;
  padding-left: 30rpx;
}
.cashlogs .amount {
  width:150rpx;
}
</style>
