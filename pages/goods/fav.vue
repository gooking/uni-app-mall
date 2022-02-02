<template>
	<view>
		<page-box-empty v-if="!goods || goods.length == 0" title="暂无收藏记录" sub-title="可以去看看有那些想买的～" :show-btn="true" />
		<view class="goods-container">
			<view v-for="(item, index) in goods" :key="index" class="goods-box">
				<view class="img-box">
					<image :src="item.pic" class="image" mode="aspectFill" lazy-load="true" @click="goDetail(item)" />
				</view>
				<u--text class="goods-title" :text="item.goodsName" :lines="3" size="28rpx" color="#333" @click="goDetail(item)"></u--text>
				<view class="delete">
					<u-icon name="trash" color="#F20C32" size="48rpx" @click="deleteFav(index, item)"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				goods: []
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			this._favList()
		},
		onShow() {

		},
		onReachBottom() {
			this.page += 1
			this._favList()
		},
		methods: {
			async _favList() {
				// https://www.yuque.com/apifm/nu0f75/cusiow
				const res = await this.$wxapi.goodsFavList({
					token: this.token,
					page: this.page
				})
				if (res.code == 0) {
					res.data.forEach(ele => {
						if(ele.json) {
							const jsonStr = JSON.parse(ele.json)
							if(jsonStr.pic) {
								ele.pic = jsonStr.pic
							}
							if(jsonStr.goodsName) {
								ele.goodsName = jsonStr.goodsName
							}
							if(jsonStr.supplyType) {
								ele.supplyType = jsonStr.supplyType
							}
						}
					})
					if (this.page == 1) {
						this.goods = res.data
					} else {
						this.goods = this.goods.concat(res.data)
					}
				} else {
					if (this.page != 1) {
						uni.showToast({
							title: '没有更多了～',
							icon: 'none'
						})
					}
				}
			},
			async deleteFav(index, item) {
				uni.showModal({
				    title: '提示',
				    content: '确定要取消收藏吗？',
				    success: res => {
				        if (res.confirm) {
				            this._deleteFav(index, item)
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				})
			},
			async _deleteFav(index, item) {
				const data = {
					token: this.token,
					id: item.id,
					type: item.type
				}
				// https://www.yuque.com/apifm/nu0f75/zy4sil
				const res = await this.$wxapi.goodsFavDeleteV2(data)
				if(res.code == 0) {
					uni.showToast({
						title: '取消收藏'
					})
					this.goods.splice(index, 1)
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			},
			goDetail(item) {
				if(item.supplyType == 'vop_jd') {
					uni.navigateTo({
						url: '/pages/goods/detail?supplyType=vop_jd&yyId=' + item.goodsId
					})
				} else {
					uni.navigateTo({
						url: '/pages/goods/detail?id=' + item.goodsId
					})
				}
			}
		}
	}
</script>
<style scoped lang="scss">
.goods-container {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		box-sizing: content-box;
		padding: 0 24rpx;
		.goods-box {
			width: 339rpx;
			background-color: #fff;
			overflow: hidden;
			margin-top: 24rpx;
			border-radius: 5px;
			border: 1px solid #D1D1D1;
			padding-bottom: 10rpx;
			.img-box {
				width: 339rpx;
				height: 339rpx;
				overflow: hidden;
				image {
					width: 339rpx;
					height: 339rpx;
				}
			}
			.goods-title {
				padding: 0 4rpx;
			}
			.goods-price-container {
				display: flex;
				align-items: baseline;
			}
			.goods-price {
				overflow: hidden;
				font-size: 34rpx;
				color: #F20C32;
				margin-left: 24rpx;
			}
			.goods-price2 {
				overflow: hidden;
				font-size: 26rpx;
				color: #aaa;
				text-decoration: line-through;
				margin-left: 20rpx;
			}
		}
		
	}
	.delete {
		padding: 16rpx;
		display: flex;
		justify-content: center;
	}
</style>
