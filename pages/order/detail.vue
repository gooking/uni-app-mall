<template>
	<view v-if="orderDetail" class="to-pay-order">
		<u-section class="shop-section" title="配送地址" :right="false"></u-section>
		<u-cell-item v-if="orderDetail.logistics" icon="map" :arrow="false" hover-class="none" :title="orderDetail.logistics.linkMan + ' ' + orderDetail.logistics.mobile" :label="orderDetail.logistics.provinceStr + orderDetail.logistics.cityStr + orderDetail.logistics.areaStr + orderDetail.logistics.address"></u-cell-item>
		<u-section class="shop-section" title="商品信息" :right="false"></u-section>
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
		<u-section v-if="orderDetail.orderInfo.remark" class="shop-section" title="订单备注" :right="false"></u-section>
		<view v-if="orderDetail.orderInfo.remark" class="remark">
			{{ orderDetail.orderInfo.remark }}
		</view>
		<u-section class="shop-section" title="合计" :right="false"></u-section>
		<u-cell-item title="商品金额" :value="'¥' + orderDetail.orderInfo.amount" :arrow="false"></u-cell-item>
		<u-cell-item title="配送费" :value="'¥' + orderDetail.orderInfo.amountLogistics" :arrow="false"></u-cell-item>
		<u-cell-item title="总计" :value="'¥' + orderDetail.orderInfo.amountReal" :arrow="false"></u-cell-item>
		<template v-if="orderDetail.logisticsTraces">
			<u-section class="shop-section" title="配送信息" :right="false"></u-section>
			<view class="logisticsTraces">
				<u-time-line>
					<u-time-line-item v-for="(item, index) in orderDetail.logisticsTraces" :key="index">
						<!-- 此处没有自定义左边的内容，会默认显示一个点 -->
						<template v-slot:content>
							<view>
								<view class="u-order-desc">{{ item.AcceptStation }}</view>
								<view class="u-order-time">{{ item.AcceptTime }}</view>
							</view>
						</template>
					</u-time-line-item>
				</u-time-line>
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
				const res = await this.$api.orderDetail(this.token, orderId)
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
				const res = await this.$api.orderDelivery(this.token, this.orderDetail.orderInfo.id)
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
