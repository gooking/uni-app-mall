<template>
	<view>
		<view class="asset">
			<view class='item'>
				<view>可用余额(元)</view>
				<view>{{balance}}</view>
			</view>
			<view class='item'>
				<view>冻结金额(元)</view>
				<view>{{freeze}}</view>
			</view>
			<view class='item right'>
				<view>累计消费(元)</view>
				<view>{{totleConsumed}}</view>
			</view>
		</view>
		<!-- <u-tabs lineColor="#e64340" :list="tabs" :current="current" @change="change"></u-tabs> -->
		<page-box-empty v-if="!cashlogs || cashlogs.length == 0" title="暂无资金明细记录" sub-title="可以去看看有那些想买的～"
			:show-btn="false" />
		<u-cell v-for="(item,index) in cashlogs" :key="index" :title="item.typeStr" :label="item.dateAdd"
			:value="item.amount"></u-cell>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				balance: 0.00,
				freeze: 0,
				score: 0,
				score_sign_continuous: 0,
				cashlogs: undefined,
				tabs: [{
						name: '资金明细'
					},
					{
						name: '提现记录'
					},
					{
						name: '押金记录'
					},
				],
				current: 0,
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
			this._cashLogsV2()
		},
		onShow() {

		},
		methods: {
			async _userAmount() {
				const res = await this.$wxapi.userAmount(this.token)
				if (res.code == 0) {
					this.balance = res.data.balance.toFixed(2),
					this.freeze = res.data.freeze.toFixed(2),
					this.totleConsumed = res.data.totleConsumed.toFixed(2),
					this.score = res.data.score
				}
			},
			async _cashLogsV2() {
				// https://www.yuque.com/apifm/nu0f75/khq7xu
				const res = await this.$wxapi.cashLogsV2({
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
	.asset {
		display: flex;
		padding-top: 50rpx;
		height: 150rpx;
		background-color: #e85654;
	}

	.asset .item {
		display: flex;
		flex-direction: column;
		width: 250rpx;
		text-align: center;
		font-size: 14px;
		line-height: 30px;
		color: #fff;
	}

	.btn-view {
		height: 88rpx;
		background-color: #e85654;
		padding-right: 40rpx;
		padding-bottom: 30rpx;
		width: 100vw;
		display: flex;
		flex-direction: row-reverse;
	}

	.btn-view .btn {
		border-color: #fff !important;
		color: #fff !important;
		margin-right: 20rpx;
	}

	.btn-hover {
		border-color: #fff;
		color: #fff;
	}

	.no-data {
		margin-top: 100rpx;
		text-align: center;
		font-size: 13px;
		color: #ccc;
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
		width: 600rpx;
		padding-left: 30rpx;
	}

	.cashlogs .amount {
		width: 150rpx;
	}
</style>
