<template>
	<view class="cart">
		<u-tabs :list="tabs" :current="tabIndex" lineColor="#e64340" @click="tabclick"></u-tabs>
		<page-box-empty v-if="tabIndex == 0 && (!shippingCarInfo || shippingCarInfo.number == 0)" title="您还没有挑选任何商品" sub-title="可以去看看有那些想买的～" :show-btn="true" />
		<page-box-empty v-if="tabIndex == 1 && (!jdvopCartInfo || jdvopCartInfo.number == 0)" title="您还没有挑选任何商品" sub-title="可以去看看有那些想买的～" :show-btn="true" />
		<view v-if="tabIndex == 0 && shippingCarInfo" class="order">
			<u-swipe-action>
				<u-swipe-action-item v-for="(item, index) in shippingCarInfo.items" :key="index" :show="item.show" :index="index" :options="options" @click="deleterecord0">
				  <view class="item">
				  	<view class="left">
				  		<image :src="item.pic" mode="aspectFill"></image>
				  	</view>
				  	<view class="content">
				  		<view class="title">{{ item.name }}</view>
				  		<view class="type">
				  			<text v-for="(item2, index2) in item.sku"
				  				:key="'b' + index2">{{ item2.optionName }}:{{ item2.optionValueName }}/</text>
				  			<text v-for="(item3, index3) in item.additions"
				  				:key="'c' + index3">{{ item3.pname }}:{{ item3.name }}/</text>
				  		</view>
				  		<view class="delivery-time">
				  			<u-number-box class="bjq" v-model="item.number" :name="index" :min="item.minBuyNumber" :max="item.stores" @change="numberChange0"></u-number-box>
				  		</view>
				  	</view>
				  	<view class="right">
				  		<view class="price">
				  			<text>￥</text>{{ item.price }}
				  		</view>
				  	</view>
				  </view>
				</u-swipe-action-item>
			</u-swipe-action>
			<view class="total">
				共 {{ shippingCarInfo.number }} 件商品 合计:
				<text class="total-price">
					<text>￥</text>{{ shippingCarInfo.price }}
				</text>
			</view>
			<view v-if="shippingCarInfo && shippingCarInfo.number > 0" class="submit0">
				<u-button type="error" @click="submit0">提交订单</u-button>
			</view>
		</view>
		<view v-if="tabIndex == 1 && jdvopCartInfo" class="order">
			<u-swipe-action>
				<u-swipe-action-item v-for="(item, index) in jdvopCartInfo.items" :key="index" :show="item.show" :index="index" :options="options" @click="deleterecord1">
				  <view class="item">
				  	<view class="left">
				  		<image :src="item.pic" mode="aspectFill"></image>
				  	</view>
				  	<view class="content">
				  		<view class="title">{{ item.name }}</view>
				  		<view class="delivery-time">
				  			<u-number-box class="bjq" v-model="item.number" :name="index" :min="item.minBuyNumber" :max="item.stores" @change="numberChange1"></u-number-box>
				  		</view>
				  	</view>
				  	<view class="right">
				  		<view class="price">
				  			<text>￥</text>{{ item.price }}
				  		</view>
				  	</view>
				  </view>
				</u-swipe-action-item>
			</u-swipe-action>
			<view class="total">
				共 {{ jdvopCartInfo.number }} 件商品 合计:
				<text class="total-price">
					<text>￥</text>{{ jdvopCartInfo.price }}
				</text>
			</view>
			<view v-if="jdvopCartInfo && jdvopCartInfo.number > 0" class="submit1">
				<u-button type="error" @click="submit">提交订单</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	const TOOLS = require('@/common/tools')
	export default {
		data() {
			return {
				tabs: [
					{
						name: '自营商品'
					},
					{
						name: '京东商品'
					}
				],
				tabIndex: 0,
				shippingCarInfo: undefined,
				jdvopCartInfo: undefined,
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
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
			if(this.tabIndex == 0) {
				this._shippingCarInfo()
			}
			if(this.tabIndex == 1) {
				this._jdvopCartInfo()
			}
		},
		methods: {
			tabclick(e) {
				this.tabIndex = e.index
				if(this.tabIndex == 0) {
					this._shippingCarInfo()
				}
				if(this.tabIndex == 1) {
					this._jdvopCartInfo()
				}
			},
			async _shippingCarInfo() {
				// https://www.yuque.com/apifm/nu0f75/awql14
				const res = await this.$wxapi.shippingCarInfo(this.token)
				if (res.code == 0) {
					res.data.items.forEach(ele => {
						ele.show = false
					})
					this.shippingCarInfo = res.data
				} else {
					this.shippingCarInfo = null
				}
			},
			async _jdvopCartInfo() {
				// https://www.yuque.com/apifm/nu0f75/gwat37
				const res = await this.$wxapi.jdvopCartInfo(this.token)
				if (res.code == 0) {
					res.data.items.forEach(ele => {
						ele.show = false
					})
					this.jdvopCartInfo = res.data
				} else {
					this.jdvopCartInfo = null
				}
			},
			async deleterecord0(e) {
				// 删除购物车记录 https://www.yuque.com/apifm/nu0f75/pndgyc
				const item = this.shippingCarInfo.items[e.index]
				const res = await this.$wxapi.shippingCarInfoRemoveItem(this.token, item.key)
				if (res.code == 0) {
					uni.showToast({
						title: '已删除'
					})
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
				this._shippingCarInfo()
				TOOLS.showTabBarBadge()
			},
			async deleterecord1(e) {
				// 删除购物车记录 https://www.yuque.com/apifm/nu0f75/syqlot
				const item = this.jdvopCartInfo.items[e.index]
				const res = await this.$wxapi.jdvopCartRemove(this.token, item.key)
				if (res.code == 0) {
					uni.showToast({
						title: '已删除'
					})
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
				this._jdvopCartInfo()
				TOOLS.showTabBarBadge()
			},
			async numberChange0(e) {
				const item = this.shippingCarInfo.items[e.name]
				// https://www.yuque.com/apifm/nu0f75/kbi5b0
				const res = await this.$wxapi.shippingCarInfoModifyNumber(this.token, item.key, e.value)
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				} else {
					this._shippingCarInfo()
					TOOLS.showTabBarBadge()
				}
			},
			async numberChange1(e) {
				// https://www.yuque.com/apifm/nu0f75/vkd6q5
				const item = this.jdvopCartInfo.items[e.name]
				const res = await this.$wxapi.jdvopCartModifyNumber(this.token, item.key, e.value)
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				} else {
					this._jdvopCartInfo()
					TOOLS.showTabBarBadge()
				}
			},
			open(index) {
				this.shippingCarInfo.items.forEach(ele => {
					ele.show = false
				})
				this.shippingCarInfo.items[index].show = true
			},
			submit0() {
				uni.navigateTo({
					url: '../pay/order?mod=cart&cartType=apifm'
				})
			},
			submit1() {
				uni.navigateTo({
					url: '../pay/order?mod=cart&cartType=vop'
				})
			},
		}
	}
</script>
<style scoped lang="scss">
	.title {
		font-size: 90rpx;
		color: #293539;
		font-weight: 300;
		position: relative;

		text {
			width: 7px;
			height: 7px;
			position: absolute;
			border: 2px solid #a78845;
			border-radius: 50%;
		}
	}

	.title-sub {
		margin-left: 25px;
		color: #293539;
		font-size: 36rpx;
		font-weight: 300;
	}

	.order {
		width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;
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
				.price {
					text {
						font-size: 26rpx;
					}
					font-size: 38rpx;
					color: #e64340;
				}
			}
		}

		.total {
			margin-top: 20rpx;
			text-align: right;
			font-size: 24rpx;

			.total-price {
				text {
					font-size: 26rpx;
				}
				font-size: 38rpx;
				color: #e64340;
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
	.submit {
		margin-top: 64rpx;
	}
</style>
