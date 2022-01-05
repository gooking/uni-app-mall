<template>
	<u-popup v-if="show" :show="show" class="goods-pop" mode="bottom" round="32rpx" @close="close">
		<view class="goodsList">
			<u--image showLoading lazyLoad :src="pic" radius="16rpx" width="120px" height="120px"></u--image>
			<view class="goods-info">
				<u--text class="t" :lines="3" :text="goodsDetail.basicInfo.name"></u--text>
				<view v-if="goodsDetail.basicInfo.numberSells" class="t2">已售:{{ goodsDetail.basicInfo.numberSells }}</view>
				<view class="price">
					<font>¥</font>{{ price }} 
					<view v-if="score"><font>+￠</font>{{ score }}</view>
				</view>
			</view>
		</view>
		<u-line></u-line>
		<view v-for="(item,index) in goodsDetail.properties" :key="'skup_' + index" class="skuList">
			<view class="t">{{ item.name }}</view>
			<view class="items">
				<u-tag v-for="(item2,index2) in item.childsCurGoods" :key="'skuc_' + index2" :text="item2.name"></u-tag>
			</view>
		</view>
		可选配件
		<u-line></u-line>
		<view class="buy-number">
			<font>购买数量</font>
			<u-number-box v-model="buyNumber" :min="min" :max="max" integer></u-number-box>
		</view>
		<u-line></u-line>
		<view class="btns">
			<view class="icon-btn">
				<u-icon name="chat" size="48rpx"></u-icon>
				<text>客服</text>
			</view>
			<view class="icon-btn">
				<u-icon name="shopping-cart" size="48rpx"></u-icon>
				<text>购物车</text>
				<u-badge type="error" value="10" absolute :offset="[-10, -10]"></u-badge>
			</view>
			<view class="icon-btn">
				<u-icon name="heart" size="48rpx"></u-icon>
				<text>收藏</text>
			</view>
			<!-- <view class="btn">
				<u-button text="加入购物车" shape="circle" color="linear-gradient(90deg,#ffd01e, #ff8917, #ffd01e)"></u-button>
			</view> -->
			<!-- <view class="btn">
				<u-button text="立即购买" shape="circle" color="linear-gradient(90deg, #ff6034, #ee0a24, #ff6034)"></u-button>
			</view> -->
			<view class="btn">
				<u-button class="half-l" text="加入购物车" shape="circle" color="linear-gradient(90deg,#ffd01e, #ff8917)"></u-button>
			</view>
			<view class="btn">
				<u-button class="half-r" text="立即购买" shape="circle" color="linear-gradient(90deg, #ff6034, #ee0a24)"></u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name: 'goods-pop',
		props: {
			show: {
				type: Boolean,
				default: false
			},
			goodsDetail: {
				type: Object,
				default: null
			},
			skuList: {
				type: Array,
				default: null
			},
		},
		data() {
			return {
				pic: undefined,
				price: undefined,
				score: undefined,
				buyNumber: 1,
				min: 1,
				max: 0,
			}
		},
		watch: {
			// word(newVal, oldVal) {
			// 	console.log('最新值是：'+newVal,"原来的值是："+ oldVal);
			// },
		    goodsDetail: {
				// deep: true,
		        immediate: true,
		        handler(newVal, oldName) {
		            this._initData()
		        }
		    }
		},
		mounted() {
			
		},
		methods: {
			_initData() {
				if(!this.goodsDetail) {
					return
				}
				console.log(this.goodsDetail);
				this.pic = this.goodsDetail.basicInfo.pic
				this.price = this.goodsDetail.basicInfo.minPrice
				this.score = this.goodsDetail.basicInfo.minScore
				if(!this.goodsDetail.basicInfo.stores) {
					this.min = 0
				}
				this.max = this.goodsDetail.basicInfo.stores
			},
			close() {
				this.$emit('close')
			},
		}

	}
</script>
<style lang="scss">
.goods-pop {
	.goodsList {
		margin-top: 32rpx;
		padding: 0 8rpx;
		display: flex;
		.goods-info {
			flex: 1;
			margin-left: 24rpx;
			position: relative;
			.t {
				font-weight: bold;
				color: #333;
				font-size: 28rpx;
			}
			.t2 {
				color: #666;
				font-size: 26rpx;
			}
			.price {
				color: #e64340;
				font-size: 40rpx;
				display: flex;
				align-items: center;
				font {
					font-size: 22rpx;
				}
			}
			.addCar {
				position: absolute;
				right: 24rpx;
				bottom: 16rpx;
			}
		}
	}
	.skuList {
		.t {
			margin: 32rpx 0 0 32rpx;
			color: #333;
			font-size: 28rpx;
			// font-weight: bold;
		}
		.items {
			display: flex;
			flex-wrap: wrap;
			margin: 16rpx 0 0 32rpx;
		}
	}
	.buy-number {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx;
		color: #333;
		font-size: 30rpx;
	}
	.btns {
		display: flex;
		padding: 32rpx;
		.icon-btn {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 24rpx;
			color: #333;
			margin-right: 32rpx;
		}
		.btn {
			flex: 1;
			.half-l {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}
			.half-r {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}
		}
	}
}
</style>
