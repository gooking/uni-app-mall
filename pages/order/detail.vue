<template>
	<view v-if="orderDetail" class="to-pay-order">
		<u-cell-group title="订单信息">
			<u-cell title="订单ID" :value="orderDetail.orderInfo.id"></u-cell>
			<u-cell title="订单号" :value="orderDetail.orderInfo.orderNumber"></u-cell>
			<u-cell v-if="orderDetail.orderInfo.type == 5" title="京东订单号" :value="orderDetail.orderInfo.orderNumberOuter"></u-cell>
		</u-cell-group>
		<u-cell-group v-if="refundApplyInfo" title="用户申请售后信息">
			<u-cell title="售后类型" :value="refundApplyInfo.baseInfo.typeStr"></u-cell>
			<u-cell title="售后原因" :value="refundApplyInfo.baseInfo.reason"></u-cell>
			<u-cell v-if="refundApplyInfo.baseInfo.outerOrderId" title="售后订单号" :value="refundApplyInfo.baseInfo.outerOrderId"></u-cell>
			<u-cell title="申请时间" :value="refundApplyInfo.baseInfo.dateAdd"></u-cell>
			<u-cell v-if="refundApplyInfo.baseInfo.remark" title="备注" :value="refundApplyInfo.baseInfo.remark"></u-cell>
			<u-cell title="状态" :value="refundApplyInfo.baseInfo.statusStr"></u-cell>
		</u-cell-group>
		<view class="refundApplyInfo-pics" v-if="refundApplyInfo && refundApplyInfo.pics">
			<u-album :urls="refundApplyInfo.pics" keyName="pic" multipleSize="125"></u-album>
		</view>
		<u-cell-group v-if="joycityPointsAfterSaleOrderInfo" title="售后进度">
			<u-cell v-for="(item,index) in joycityPointsAfterSaleOrderInfo.afsLogs" :title="item.operator + item.operationDesc" :label="item.createdTime"></u-cell>
		</u-cell-group>
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
				refundApplyInfo: undefined,
				joycityPointsAfterSaleOrderInfo: undefined
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
				if(res.data.orderInfo.refundStatus != 0 || res.data.orderInfo.hasRefund) {
					this.refundApplyDetail()
				}
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
			},
			async refundApplyDetail() {
				// https://www.yuque.com/apifm/nu0f75/rgng3x
				const res = await this.$wxapi.refundApplyDetail(this.token, this.orderDetail.orderInfo.id)
				if(res.code == 0) {
					this.refundApplyInfo = res.data[0]
					if(this.orderDetail.orderInfo.type == 5) {
						this.joycityPointsSearchAfsOrderDetail(this.refundApplyInfo.baseInfo.outerOrderId)
					}
				}
			},
			async joycityPointsSearchAfsOrderDetail(afterSaleId) {
				const res = await this.$wxapi.joycityPointsSearchAfsOrderDetail({
					token: this.token,
					afterSaleId
				})
				if(res.code == 0) {
					this.joycityPointsAfterSaleOrderInfo = res.data
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
	.refundApplyInfo-pics {
		padding: 16rpx;
	}
</style>
