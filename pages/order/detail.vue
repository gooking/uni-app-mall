<template>
	<view v-if="orderDetail" class="to-pay-order">
		<u-divider text="收货地址"></u-divider>
		<u-cell v-if="orderDetail.logistics" icon="map" :border="false" :title="orderDetail.logistics.linkMan + ' ' + orderDetail.logistics.mobile" :label="orderDetail.logistics.provinceStr + orderDetail.logistics.cityStr + orderDetail.logistics.areaStr + orderDetail.logistics.address"></u-cell>
		<u-divider text="商品信息"></u-divider>
		<view class="order">
			<view class="item" v-for="(item, index) in orderDetail.goods" :key="'a' + index">
				<view class="left"><image :src="item.pic" mode="aspectFill"></image></view>
				<view class="content">
					<view class="title u-line-2">{{ item.goodsName }}</view>
					<view class="type">{{ item.property }}</view>
				</view>
				<view class="right">
					<view class="price">
						￥{{ item.amountSingle }}
					</view>
					<view class="number">x{{ item.number }}</view>
				</view>
			</view>
			<view class="total">
				共 {{ orderDetail.orderInfo.goodsNumber }} 件商品 合计:
				<text class="total-price">
					￥{{ orderDetail.orderInfo.amountReal }}
				</text>
			</view>
		</view>
		<u-divider v-if="orderDetail.orderInfo.remark" text="订单备注"></u-divider>
		<view v-if="orderDetail.orderInfo.remark" class="remark">
			{{ orderDetail.orderInfo.remark }}
		</view>
		<u-divider text="合计"></u-divider>
		<u-cell :border="false" title="商品金额" :value="'¥' + orderDetail.orderInfo.amount" :arrow="false"></u-cell>
		<u-cell :border="false" title="快递费" :value="'¥' + orderDetail.orderInfo.amountLogistics" :arrow="false"></u-cell>
		<u-cell :border="false" title="总计" :value="'¥' + orderDetail.orderInfo.amountReal" :arrow="false"></u-cell>
		<template v-if="orderDetail.logisticsTraces">
			<u-divider text="快递信息"></u-divider>
			<view class="logisticsTraces">
				<u-steps dot direction="column">
					<u-steps-item v-for="(item, index) in orderDetail.logisticsTraces" :key="index" :title="item.AcceptStation" :desc="item.AcceptTime"></u-steps-item>
				</u-steps>
			</view>
		</template>
		<view v-if="orderDetail.orderInfo.status == 2" class="submit safe-area-inset-bottom">
			<u-button type="success" @click="orderDelivery">确认收货</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderDetail: undefined,
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			this._orderDetail(e.id)
		},
		onShow() {

		},
		methods: {
			async _orderDetail(orderId) {
				// https://www.yuque.com/apifm/nu0f75/oamel8
				const res = await this.$wxapi.orderDetail(this.token, orderId)
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					uni.navigateBack()
					return
				}
				this.orderDetail = res.data
			},
			async orderDelivery() {
				uni.showModal({
				    title: '请确认',
				    content: '确定要确认收货吗？',
				    success: res => {
				        if (res.confirm) {
				            this._orderDelivery()
				        }
				    }
				})
			},
			async _orderDelivery() {
				// https://www.yuque.com/apifm/nu0f75/vy8eai
				const res = await this.$wxapi.orderDelivery(this.token, this.orderDetail.orderInfo.id)
				if(res.code == 0) {
					uni.showToast({
						title: '已收到货',
					})
					this._orderDetail(this.orderDetail.orderInfo.id)
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			}
		}
	}
</script>
<style scoped lang="scss">
.to-pay-order {
	padding-bottom: 100rpx;
	.shop-section {
		margin-top: 32rpx;
	}
}
.order {
	width: 710rpx;
	background-color: #ffffff;
	margin: 20rpx auto;
	border-radius: 20rpx;
	box-sizing: border-box;
	padding: 20rpx;
	font-size: 28rpx;
	.top {
		display: flex;
		justify-content: space-between;
		.left {
			display: flex;
			align-items: center;
			.store {
				margin: 0 10rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
		.right {
			color: $u-warning-dark;
		}
	}
	.item {
		display: flex;
		margin: 20rpx 0 0;
		.left {
			margin-right: 20rpx;
			image {
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
			}
		}
		.content {
			flex: 1;
			.title {
				font-size: 28rpx;
				line-height: 50rpx;
			}
			.type {
				margin: 10rpx 0;
				font-size: 24rpx;
				color: $u-tips-color;
			}
			.delivery-time {
				color: #e5d001;
				font-size: 24rpx;
			}
		}
		.right {
			margin-left: 10rpx;
			padding-top: 20rpx;
			text-align: right;
			.decimal {
				font-size: 24rpx;
				margin-top: 4rpx;
			}
			.number {
				color: $u-tips-color;
				font-size: 24rpx;
			}
		}
	}
	.total {
		margin-top: 20rpx;
		text-align: right;
		font-size: 24rpx;
		.total-price {
			font-size: 32rpx;
		}
	}
	.bottom {
		display: flex;
		margin-top: 40rpx;
		padding: 0 10rpx;
		justify-content: space-between;
		align-items: center;
		.btn {
			line-height: 52rpx;
			width: 160rpx;
			border-radius: 26rpx;
			border: 2rpx solid $u-border-color;
			font-size: 26rpx;
			text-align: center;
			color: $u-info-dark;
		}
		.evaluate {
			color: $u-warning-dark;
			border-color: $u-warning-dark;
		}
	}
}
.remark {
	padding: 32rpx;
}
.submit {
	position: fixed;
	width: 100vw;
	left: 0;
	bottom: 0;
	z-index: 9;
}
.logisticsTraces {
	padding: 32rpx;
}
.u-node {
		width: 44rpx;
		height: 44rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #d0d0d0;
	}
	
	.u-order-title {
		color: #333333;
		font-weight: bold;
		font-size: 32rpx;
	}
	
	.u-order-desc {
		color: rgb(150, 150, 150);
		font-size: 28rpx;
		margin-bottom: 6rpx;
	}
	
	.u-order-time {
		color: rgb(200, 200, 200);
		font-size: 26rpx;
	}
</style>
