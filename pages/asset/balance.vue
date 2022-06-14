<template>
	<view>
		<view class="asset">
			<view class='item'>
				<view>可用余额(元)</view>
				<view class="amount">{{balance}}</view>
			</view>
			<view class='item'>
				<view>冻结金额(元)</view>
				<view class="amount">{{freeze}}</view>
			</view>
			<view class='item right'>
				<view>累计消费(元)</view>
				<view class="amount">{{totleConsumed}}</view>
			</view>
		</view>
		<u-cell title="我要充值" isLink url="/pages/asset/recharge"></u-cell>
		<u-cell title="绑定银行卡" isLink url="/pages/asset/bindCard"></u-cell>
		<u-cell title="资金明细" isLink url="/pages/asset/cashlog"></u-cell>
		<u-cell title="我要提现" isLink url="/pages/asset/widthdraw"></u-cell>
		<u-cell title="提现记录" isLink url="/pages/asset/withdrawlog"></u-cell>
		<u-cell title="支付押金" isLink url="/pages/asset/deposit"></u-cell>
		<u-cell title="押金记录" isLink url="/pages/asset/depositlog"></u-cell>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				balance: 0.00,
				freeze: 0.00,
				totleConsumed: 0.00,
				score: 0,
				score_sign_continuous: 0.00,
				tabs: [{
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
		},
		onShow() {

		},
		methods: {
			async _userAmount() {
				// https://www.yuque.com/apifm/nu0f75/wrqkcb
				const res = await this.$wxapi.userAmount(this.token)
				if (res.code == 0) {
					this.balance = res.data.balance.toFixed(2)
					this.freeze = res.data.freeze.toFixed(2)
					this.totleConsumed = res.data.totleConsumed.toFixed(2)
					this.score = res.data.score
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
	}

	.asset .item {
		display: flex;
		flex-direction: column;
		width: 250rpx;
		text-align: center;
		font-size: 14px;
		line-height: 30px;
		.amount {
			color: #e64340;
			font-size: 36rpx;
		}
	}
</style>
