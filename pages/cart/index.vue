<template>
	<view class="cart">
		<view class="blank-top"></view>
		<view class="title">
			购物车
			<text></text>
		</view>
		<view class="title-sub">左滑可删除商品</view>
		<page-box-empty v-if="!shippingCarInfo || shippingCarInfo.number == 0" title="您还没有挑选任何商品" sub-title="可以去看看有那些想买的～" :show-btn="true" />
		<view v-if="shippingCarInfo" class="order">
			<u-swipe-action :show="item.show" :index="index" 
				v-for="(item, index) in shippingCarInfo.items" :key="index"
				@click="click"
				@open="open"
				:options="options"
			>
				<view class="item">
					<view class="left">
						<image :src="item.pic" mode="aspectFill"></image>
					</view>
					<view class="content">
						<view class="title u-line-2">{{ item.name }}</view>
						<view class="type">
							<text v-for="(item2, index2) in item.sku"
								:key="'b' + index2">{{ item2.optionName }}:{{ item2.optionValueName }}/</text>
							<text v-for="(item3, index3) in item.additions"
								:key="'c' + index3">{{ item3.pname }}:{{ item3.name }}/</text>
						</view>
						<view class="delivery-time">
							<u-number-box class="bjq" v-model="item.number" :index="index" :min="item.minBuyNumber" :max="item.stores" @change="numberChange"></u-number-box>
						</view>
					</view>
					<view class="right">
						<view class="price">
							￥{{ item.price }}
						</view>
					</view>
				</view>
			</u-swipe-action>
			<view class="total">
				共 {{ shippingCarInfo.number }} 件商品 合计:
				<text class="total-price">
					￥{{ shippingCarInfo.price }}
				</text>
			</view>
			<view v-if="shippingCarInfo && shippingCarInfo.number > 0" class="submit">
				<u-button type="error" @click="submit">提交订单</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shippingCarInfo: undefined,
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
			this._shippingCarInfo()
		},
		methods: {
			async _shippingCarInfo() {
				const res = await this.$api.shippingCarInfo(this.token)
				if (res.code == 0) {
					res.data.items.forEach(ele => {
						ele.show = false
					})
					this.shippingCarInfo = res.data
				} else {
					this.shippingCarInfo = null
				}
			},
			async numberChange(e) {
				// console.log(e.value, e.index);
				const item = this.shippingCarInfo.items[e.index]
				const res = await this.$api.shippingCarInfoModifyNumber(this.token, item.key, e.value)
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				} else {
					this._shippingCarInfo()
				}
			},
			open(index) {
				this.shippingCarInfo.items.forEach(ele => {
					ele.show = false
				})
				this.shippingCarInfo.items[index].show = true
			},
			async click(index1, index2) {
				const item = this.shippingCarInfo.items[index1]
				if(index2 == 0) {
					// 删除
					const res = await this.$api.shippingCarInfoRemoveItem(this.token, item.key)
					this._shippingCarInfo()
				}
			},
			submit() {
				uni.navigateTo({
					url: '../to-pay-order/index?mod=cart'
				})
			},
		}
	}
</script>
<style scoped lang="scss">
	.cart {

	}
	.blank-top {
		height: 88rpx;
	}

	.title {
		font-size: 90rpx;
		margin-left: 20px;
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
			align-items: center;
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
	.submit {
		margin-top: 64rpx;
	}
</style>
