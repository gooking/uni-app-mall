<template>
	<view>
		<view class="wrap">
			<u-sticky bgColor="#ffffff">
				<view class="u-tabs-box">
					<u-tabs lineColor="#e64340" :list="list" :current="current" @change="change"></u-tabs>
				</view>
			</u-sticky>
			<page-box-empty v-if="!orderList || orderList.length == 0" title="您还没有相关的订单" sub-title="可以去看看有那些想买的～"
				:show-btn="true" />
			<view v-else class="page-box">
				<view class="order" v-for="(item, index) in orderList" :key="item.id">
					<view class="top" @click="godetail(item.id)">
						<view class="left">
							订单号: {{ item.orderNumber }}
						</view>
						<view class="right">{{ item.statusStr }}</view>
					</view>
					<view class="item" v-for="(item2, index2) in item.goodsList" :key="item2.id">
						<view class="left">
							<image :src="item2.pic" mode="aspectFill"></image>
						</view>
						<view class="content">
							<view class="title u-line-2">{{ item2.goodsName }}</view>
							<view v-if="item2.property" class="type">{{ item2.property }}</view>
						</view>
						<view class="right">
							<view class="price-score">
								<view v-if="item2.amountSingle" class="item"><text>¥</text>{{item2.amountSingle}}</view>
								<view v-if="item2.score" class="item"><text>
										<image class="score-icon" src="/static/images/score.png"></image>
									</text>{{item2.score}}</view>
							</view>
							<view class="number">x{{ item2.number }}</view>
						</view>
					</view>
					<view class="total">
						共{{ item.goodsNumber }}件商品 合计:
						<view class="price-score" style="display: inline-flex;">
							<view v-if="item.amountReal" class="item"><text>¥</text>{{item.amountReal}}</view>
							<view v-if="item.score" class="item"><text>
									<image class="score-icon" src="/static/images/score.png"></image>
								</text>{{item.score}}</view>
						</view>
					</view>
					<view v-if="item.status == 0" class="bottom">
						<view class="exchange btn" @click="close(item.id)">取消订单</view>
						<view class="evaluate btn ml24" @click="pay(index)">立即支付</view>
					</view>
					<view v-if="item.status > 0 && !item.isEnd" class="bottom">
						<view v-if="item.refundStatus == 1" class="btn-box">
							<u-button type="error" plain size="small" shape="circle" text="撤销售后"
								@click="refundCancel(item)"></u-button>
						</view>
						<view v-else class="btn-box">
							<u-button type="error" plain size="small" shape="circle" text="退换货" @click="refund(item)">
							</u-button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const wxpay = require('@/common/wxpay.js')
	export default {
		data() {
			return {
				orderList: undefined,
				dataList: undefined,
				list: [{
						name: '全部',
						status: ''
					},
					{
						name: '待付款',
						status: '0'
					},
					{
						name: '待发货',
						status: '1'
					},
					{
						name: '待收货',
						status: '2'
					},
					{
						name: '待评价',
						status: '3'
					},
					{
						name: '售后',
						status: '99'
					},
				],
				current: 0,
			};
		},
		onLoad(e) {
			if (e.status) {
				const a = this.list.findIndex(ele => {
					return ele.status == e.status
				})
				if (a != -1) {
					this.current = a * 1
				}
			}
			this.change({
				index: this.current
			})
		},
		methods: {
			async _orderStatistics() {
				// https://www.yuque.com/apifm/nu0f75/dapuli
				const res = await this.$wxapi.orderStatisticsv2({
					token: this.token
				})
				if (res.code == 0) {
					this.list[0].count = res.data.count_id_no_pay
					this.list[1].count = res.data.count_id_no_transfer
					this.list[2].count = res.data.count_id_no_confirm
					this.list.splice(0, 0)
				}
			},
			// 页面数据
			async getOrderList() {
				const curTab = this.list[this.current]
				this.orderList = null
				const postData = {
					token: this.token,
					status: curTab.status
				}
				if (curTab.status == 99) {
					// 售后订单
					postData.refundStatus = 1
					postData.status = ''
				}
				// https://www.yuque.com/apifm/nu0f75/uwggsm
				const res = await this.$wxapi.orderList(postData)
				if (res.code == 0) {
					const goodsMap = res.data.goodsMap
					res.data.orderList.forEach(ele => {
						ele.goodsList = goodsMap[ele.id]
					})
					this.orderList = res.data.orderList
				}
			},
			goIndex() {
				uni.switchTab({
					url: "../index/index"
				})
			},
			// tab栏切换
			change(e) {
				this.current = e.index
				this._orderStatistics()
				this.getOrderList();
			},
			async close(orderId) {
				uni.showModal({
					title: '请确认',
					content: '确定要取消该订单吗？',
					success: res => {
						if (res.confirm) {
							this._close(orderId)
						}
					}
				});
			},
			async _close(orderId) {
				// https://www.yuque.com/apifm/nu0f75/wh4rrs
				const res = await this.$wxapi.orderClose(this.token, orderId)
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				} else {
					uni.showToast({
						title: '已取消'
					})
					this.change(this.current)
				}
			},
			async pay(index) {
				// https://www.yuque.com/apifm/nu0f75/wrqkcb
				let res = await this.$wxapi.userAmount(this.token)
				let balance = 0
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
				balance = res.data.balance
				const orderInfo = this.orderList[index]
				const needPay = (orderInfo.amountReal - balance).toFixed(2)
				if (needPay <= 0) {
					// 直接调用支付接口 https://www.yuque.com/apifm/nu0f75/lwt2vi
					const res = await this.$wxapi.orderPay(this.token, orderInfo.id)
					if (res.code != 0) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: '支付成功'
						})
						this.change(1)
					}
				} else {
					// 发起在线支付
					// #ifdef MP-WEIXIN
					wxpay.wxpay('order', needPay, orderInfo.id, '')
					// #endif
					// #ifdef H5
					const ua = window.navigator.userAgent.toLowerCase();
					if (ua.match(/MicroMessenger/i) == 'micromessenger') {
						// https://www.yuque.com/apifm/nu0f75/mghxuo
						res = await this.$wxapi.wxpayJsapi({
							token: this.token,
							money: needPay,
							remark: '支付订单 ：' + orderInfo.id,
							payName: '支付订单 ：' + orderInfo.id,
							nextAction: `{type: 0, id: ${orderInfo.id}}`
						})
						if(res.code != 0) {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
							return
						}
						window.WeixinJSBridge.invoke(
						  'getBrandWCPayRequest', {
							'appId': res.data.appid,
							'timeStamp': res.data.timeStamp,
							'nonceStr': res.data.nonceStr,
							'package': 'prepay_id=' + res.data.prepayId,
							'signType': 'MD5',
							'paySign': res.data.sign
						  },
						  function(res) {
							if (res.err_msg === 'get_brand_wcpay_request:ok') {
							  this.change(1)
							}
						})
					} else {
						// 普通浏览器，调用h5支付
						// https://www.yuque.com/apifm/nu0f75/pv7gll
						const res = await this.$wxapi.wxpayH5({
							token: this.token,
							money: needPay,
							remark: '支付订单 ：' + orderInfo.id,
							payName: '支付订单 ：' + orderInfo.id,
							nextAction: `{type: 0, id: ${orderInfo.id}}`
						})
						if(res.code != 0) {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
							uni.redirectTo({
								url: "../order/index?status=0"
							})
							return
						}
						location.href = res.data.mweb_url
					}
					// #endif
					// #ifdef APP-PLUS
					// TODO SDK 地址
					const res = await this.$wxapi.wxpayApp({
						token: this.token,
						appid: getApp().globalData.wxpayOpenAppId,
						money: needPay,
						remark: '支付订单 ：' + orderInfo.id,
						payName: '支付订单 ：' + orderInfo.id,
						nextAction: `{type: 0, id: ${orderInfo.id}}`
					})
					console.log(res);
					uni.requestPayment({
						provider: 'wxpay', // alipay wxpay baidu appleiap
						orderInfo: { // https://uniapp.dcloud.io/api/plugins/payment?id=orderinfo
							
						},
						success: res => {
							console.log(res);
						},
						fail: err => {
							console.log(err);
						}
					})
					// #endif
				}
			},
			godetail(orderId) {
				uni.navigateTo({
					url: './detail?id=' + orderId
				})
			},
			async refund(item) {
				if(item.type == 5) {
					// 判断是否可售后
					const goodsId = item.goodsList[0].goodsIdStr
					uni.setStorageSync('afsGoodsId', goodsId) // 京东权益订单，售后的商品编号
					const res = await this.$wxapi.joycityPointsCanApplyAfterSale({
						token: this.token,
						orderId: item.id,
						goodsId
					})
					if(res.code != 0) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						return
					}
					if(!res.data.canApply) {
						uni.showToast({
							title: res.data.cannotApplyTip,
							icon: 'none'
						})
						return
					}
					if(res.data.supportMethod == 2) {
						uni.showToast({
							title: '请联系客服进行售后:' + res.data.afsHotLine,
							icon: 'none'
						})
						return
					}
					// 可申请的售后类型保存到 storage
					uni.setStorageSync('supportAfsTypeList', res.data.supportAfsTypeList) // 支持的售后类型列表 10-退货 20-换货
				}
				uni.setStorageSync('orderType', item.type)
				uni.navigateTo({
					url: '../refund/apply?orderId=' + item.id
				})
			},
			async refundCancel(item) {
				uni.showModal({
					title: '请确认',
					content: '确定要撤销售后吗？',
					success: res => {
						if (res.confirm) {
							this._refundCancel(item)
						}
					}
				});
			},
			async _refundCancel(item) {
				// https://www.yuque.com/apifm/nu0f75/bq6e6r
				const res = await this.$wxapi.refundApplyCancel(this.token, item.id)
				if (res.code == 0) {
					uni.showToast({
						title: '已撤销',
						icon: 'none'
					})
					this.getOrderList();
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			}
		}
	};
</script>

<style>
	/* #ifndef H5 */
	page {
		background-color: #f2f2f2;
	}

	/* #endif */
</style>

<style lang="scss" scoped>
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
			justify-content: end;
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

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}

	.ml24 {
		margin-left: 24rpx;
	}

	.btn-box {
		width: 160rpx;
	}
</style>
