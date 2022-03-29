<template>
	<view>
		<view class="container">
			<u-empty v-if="!orderList || orderList.length == 0" mode="car" text="暂无订单" icon="http://cdn.uviewui.com/uview/empty/car.png"></u-empty>
			<view class="order-list" :hidden="orderList.length>0 ? false : true">
				<view class="a-order" v-for="(item, index) in orderList">
					<u-cell icon="integral-fill" :title="'订单号：' + item.orderNumber" :value="item.statusStr" :label="'购买用户: ' + item.buyerUserNick"></u-cell>
					<u-cell v-for="(g,index2) in item.goodsList" :title="g.goodsName" :value="g.amountSingle" :label="g.number">
						<u-avatar slot="icon" shape="square" size="35" :src="g.pic?g.pic:'error'" customStyle="margin: -3px 5px -3px 0"></u-avatar>
						
						<view slot="label">
							<view class="u-font-14 u-tips-color">{{ g.commisionRecord.bili }}% 返佣</view>
							<view class="u-font-14 u-tips-color">{{ g.commisionRecord.money }} {{g.commisionRecord.unit==0?'元':'积分'}}</view>
							<text v-if="g.commisionRecord.isSettlement" style='color:green;margin-left:10px;font-size:14px;'>已结算</text>
							<text v-else-if="item.status != -1" style='color:gray;margin-left:10px;font-size:14px;'>待结算</text>
						</view>
						<view slot="right-icon">x {{ item.stores }}</view>
					</u-cell>

					<view class="goods-price">共 {{item.goodsNumber}} 件商品 合计：
						<text class="p" v-if="item.score <= 0">¥ {{item.amountReal}}</text>
						<text class="p" v-if="item.score > 0">¥ {{item.amountReal}} + {{item.score}} 积分</text>
					，累计佣金 <text class="p" v-if="item.score <= 0">{{item.totalCommision}}</text>
					</view>
					<u-cell v-if="userInviter[item.goodsList[0].commisionRecord.uids]" :title="'销售员: ' + userInviter[item.goodsList[0].commisionRecord.uids].nick"></u-cell>
					<view class="goods-info">
						<view class="goods-des">
							<view class="remark" v-if="item.remark && item.remark != ''">{{item.remark}}</view>
							<view style="font-size:24rpx;color:#666;">下单日期：{{item.dateAdd}} </view>
						</view>
					</view>
				</view>
			</view>
		  <view class="safeAreaOldMarginBttom safeAreaNewMarginBttom"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: [],
				dateBegin: undefined,
				dateEnd: undefined,
				sellerMobile: undefined,
				aggregate: {
					sum_sale_amount: 0
				}
			}
		},
		methods: {
			onLoad(options) {},
			onShow: function () {
				//获取佣金列表
				this.getCommisionLog()
			},
			async getCommisionLog() {
				const postData = {
					token: this.token,
					dateAddBegin: this.dateBegin ? this.dateBegin : '',
					dateAddEnd: this.dateEnd ? this.dateEnd : '',
					sellerMobile: this.sellerMobile ? this.sellerMobile : ''
				}
				await this.$wxapi.fxCommisionLog(postData).then(res => {
					if (res.code == 0) {
						const goodsMap = res.data.goodsMap
						const commisionLog = res.data.result
						if (goodsMap) {
							res.data.orderList.forEach(ele => {
								const _goods = goodsMap[ele.id] // 该订单下的商品列表
								if (_goods) {
									let totalCommision = 0
									_goods.forEach(c => {
										const commisionRecord = commisionLog.find(d => {
											return d.orderId == ele.id && d.goodsName == c.goodsName //  FIXME 要么根据销售额，还是别的来匹配返佣记录
										})
										if (commisionRecord) {
											totalCommision += commisionRecord.money
											c.commisionRecord = commisionRecord
											ele.buyerUserNick = commisionRecord.nicks ? commisionRecord.nicks : '用户' + commisionRecord.uids
										}
									})
									ele.goodsList = _goods
									ele.totalCommision = totalCommision
								}
							})
						}
						this.commisionLog = commisionLog
						this.orderList = res.data.orderList
						this.logisticsMap = res.data.logisticsMap
						this.goodsMap = goodsMap
						this.aggregate = res.data.aggregate
						this.userInviter = res.data.userInviter
					} else {
						this.commisionLog = []
						this.orderList = []
						this.logisticsMap = []
						this.goodsMap = []
					}
				})
			},
			dateBeginCancel() {
				this.dateBegin = null
			},
			dateBeginChange(e) {
				this.dateBegin = e.detail.value
			},
			dateEndCancel() {
				this.dateEnd = null
			},
			dateEndChange(e) {
				this.dateEnd = e.detail.value
			}
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}

	.container{
		width: 100%;
		background-color: #F5f5f5;
	}
	.status-box{
		width:100%;
		height: 88rpx;
		line-height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
	}
	.status-box .status-label{
		width: 150rpx;
		height: 100%;
		text-align: center;
		font-size:28rpx;
		color:#353535;
		box-sizing: border-box;
		position: relative;
	}
	.status-box .status-label.active{
		color:#393640;
		border-bottom: 6rpx solid #393640;
	}
	.order-list{
		width: 100%;
	}
	.order-list .a-order{
		width: 100%;
		background-color: #fff;
		margin-top: 20rpx;
	}
	.a-order  .goods-info,
	.goods-img-container{
		width: 720rpx;
		margin-left: 30rpx;
		border-top: 1rpx solid #eee;
		padding: 30rpx 0;
		display: flex;
		align-items: center;
	}
	.goods-price {
		font-size:26rpx;
		width:720rpx;
		text-align: right;
	}
	.goods-price .p {
		font-size:36rpx;
		color:#e64340;
	}
	.goods-info .img-box{
		width: 120rpx;
		height: 120rpx;
		overflow: hidden;
		margin-right: 30rpx;
		background-color: #f7f7f7;
	}
	.goods-info .img-box .goods-img,
	.goods-img-container .img-box .goods-img{
		width: 120rpx;
		height: 120rpx;
	}
	.goods-info  .goods-des{
		font-size:26rpx;
		color:#000000;
	}
	.goods-img-container{
		height: 180rpx;
		box-sizing: border-box;
		white-space: nowrap;
	}
	.goods-img-container .img-box{
		width: 120rpx;
		height: 120rpx;
		overflow: hidden;
		margin-right: 20rpx;
		background-color: #f7f7f7;
		display: inline-block;
	}
	.price-box{
		width: 720rpx;
		display: flex;
		flex-direction:row-reverse;
		padding-bottom: 30rpx;
	}
	.price-box .btn{
		width: 166rpx;
		height: 60rpx;
		box-sizing: border-box;
		text-align: center;
		line-height: 60rpx;
		border: 1rpx solid #ccc;
		border-radius: 6rpx;
		margin-left: 20rpx;
		font-size:26rpx;

		width: 160rpx;
		height: 60rpx;
		border-radius: 30rpx;

	}
	.price-box .active{
		border:1rpx solid #e64340;
		color: #e64340;
	}
	.remark {
		color:#e64340;
		margin-bottom: 20rpx;
	}
	.btn-box {
		padding: 32rpx;
	}
</style>
