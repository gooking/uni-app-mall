<template>
	<view class="category-page-box">
		<view class="category-page">
			<view class="main">
				<scroll-view class="u-tab-view menu-scroll-view" scroll-y scroll-with-animation>
					<view v-for="(item,index) in category" :key="index" class="u-tab-item"
						:class="[current==index ? 'u-tab-item-active' : '']" :data-current="index"
						@tap.stop="categoryChange(index)">
						<text class="u-line-1">{{item.name}}</text>
					</view>
				</scroll-view>
				<scroll-view class="goods-container" scroll-y :scroll-top="scrolltop">
					<page-box-empty v-if="!cmsArticles" title="暂无记录" sub-title="当前类目无法为你检索到相关信息～" :show-btn="false" />
					<u-cell v-for="(item,index) in cmsArticles" :key="index" :title="item.title" isLink clickable :url="'/pages/help/detail?id=' + item.id"></u-cell>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				category: undefined,
				current: 0,
				scrolltop: 0,
				cmsArticles: undefined,
			}
		},
		created() {

		},
		mounted() {

		},
		onReady() {

		},
		onLoad(e) {
			this.cmsCategories()
		},
		onShow() {

		},
		methods: {
			async cmsCategories() {
				const res = await this.$wxapi.cmsCategories()
				if (res.code == 0) {
					const category = res.data.filter(ele => {
						return ele.type == 'qa'
					})
					this.category = category
					if (category && category.length > 0) {
						this.articles(category[0].id)
					}
				}
			},
			async articles(categoryId) {
				wx.showLoading({
					title: '',
				})
				const res = await this.$wxapi.cmsArticles({
					categoryId
				})
				wx.hideLoading()
				if (res.code == 0) {
					this.cmsArticles = res.data
				} else {
					this.cmsArticles = null
				}
			},
			categoryChange(index) {
				this.current = index
				const category = this.category[index]
				this.articles(category.id)
			},
		}
	}
</script>
<style scoped lang="scss">
	.category-page {
		display: flex;
		flex-direction: column;
		width: 100vw;
		// height: calc(100vh - var(--window-bottom) - var(--status-bar-height) - var(--window-top));
		height: 100vh;
		.main {
			flex: 1;
			overflow: hidden;
			display: flex;

			.u-tab-view {
				width: 180rpx;
				height: 100%;
				background-color: #f6f6f6;
			}

			.u-tab-item {
				height: 110rpx;
				background: #f6f6f6;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 26rpx;
				color: #444;
				font-weight: 400;
				line-height: 1;
			}

			.u-tab-item-active {
				position: relative;
				color: #000;
				font-size: 30rpx;
				font-weight: 600;
				background: #fff;
			}

			.u-tab-item-active::before {
				content: "";
				position: absolute;
				border-left: 4px solid #e64340;
				height: 60rpx;
				left: 0;
				top: 25rpx;
			}

			.goods-container {
				flex: 1;
				height: 100%;

				.goodsList {
					margin-bottom: 32rpx;
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
			}
		}

	}
</style>
