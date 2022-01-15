<template>
	<view class="category-page-box">
		<view class="category-page">
			<view class="search">
				<u-search placeholder="输入关键词搜索" v-model="kw" :showAction="false" @search="search">
				</u-search>
				<!--  #ifndef  H5 || MP-KUAISHOU -->
				<view class="scan" @click="searchscan">
					<u-icon name="scan" size="48rpx"></u-icon>
				</view>
				<!--  #endif -->
			</view>
			<view class="main">
				<scroll-view class="u-tab-view menu-scroll-view" scroll-y="true" scroll-with-animation="true">
					<!-- <van-sidebar custom-class="sidebar-l" active-key="{{ activeCategory }}">
						<van-sidebar-item wx:if="{{item.level == 1}}" id="category{{item.id}}" wx:for="{{firstCategories}}"
							wx:key="id" data-idx="{{index}}" bindtap="onCategoryClick" title="{{ item.name }}" />
					</van-sidebar> -->
					<view v-for="(item,index) in firstCategories" :key="index" class="u-tab-item"
						:class="[current==index ? 'u-tab-item-active' : '']" :data-current="index"
						@tap.stop="swichMenu(index)">
						<text class="u-line-1">{{item.name}}</text>
					</view>
				</scroll-view>
				<scroll-view class="goods-container" scroll-y="true" :scroll-top="scrolltop"
					@scrolltolower="goodsGoBottom">
					<u-empty v-if="!goodsList" mode="list" text="暂无商品" marginTop="200rpx" />
					<view v-for="(item, index) in goodsList" :key="index" class="goodsList">
						<u--image showLoading lazyLoad :src="item.pic" radius="16rpx" width="240rpx" height="240rpx"
							@click="goDetail(item)"></u--image>
						<view class="goods-info">
							<u--text class="t" :lines="3" :text="item.name" @click="goDetail(item)"></u--text>
							<view v-if="item.numberSells" class="t2">已售:{{ item.numberSells }}</view>
							<view class="price">
								<font>¥</font>{{ item.minPrice }}
								<view v-if="item.gotScore">
									<font>+￠</font>{{ item.gotScore }}
								</view>
							</view>
							<view class="addCar">
								<u-icon v-if="item.propertyIds || item.hasAddition" name="plus-circle" color="#e64340"
									size="48rpx" @click="_showGoodsPop(item)"></u-icon>
								<u-icon v-else name="shopping-cart" color="#e64340" size="64rpx" @click="addCart(item)">
								</u-icon>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<goods-pop :show="showGoodsPop" :goodsDetail="goodsDetail" @close="showGoodsPop = false"></goods-pop>
	</view>
</template>

<script>
	const TOOLS = require('@/common/tools')
	export default {
		data() {
			return {
				kw: '',
				categorySelected: {},
				activeCategory: 0,
				categories: undefined,
				firstCategories: undefined,
				adPosition: undefined,
				current: 0, // 预设当前项的值
				scrolltop: 0,
				goodsList: undefined,
				skuCurGoods: undefined,
				page: 1,
				// 下面为弹出商品详情
				showGoodsPop: false,
				goodsDetail: undefined
			}
		},
		created() {

		},
		mounted() {

		},
		onReady() {

		},
		onLoad(e) {
			// #ifdef  MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
			uni.showShareMenu({
				withShareTicket: true,
			})
			// #endif
			this._categories();
			TOOLS.showTabBarBadge()
		},
		onShow() {

		},
		onShareAppMessage(e) {
			return {
				title: '"' + this.sysconfigMap.mallName + '" ' + this.sysconfigMap.share_profile,
				path: '/pages/index/index?inviter_id=' + this.uid
			}
		},
		methods: {
			async _categories() {
				uni.showLoading({
					title: '',
				})
				// https://www.yuque.com/apifm/nu0f75/racmle
				const res = await this.$wxapi.goodsCategory()
				uni.hideLoading()
				let categorySelected = this.categorySelected
				if (res.code == 0) {
					const categories = res.data.filter(ele => {
						return !ele.vopCid1 && !ele.vopCid2
					})
					categories.forEach(p => {
						p.childs = categories.filter(ele => {
							return p.id == ele.pid
						})
					})
					const firstCategories = categories.filter(ele => {
						return ele.level == 1
					})
					if (this.categorySelected.id) {
						this.activeCategory = firstCategories.findIndex(ele => {
							return ele.id == this.categorySelected.id
						})
						categorySelected = firstCategories[this.activeCategory]
					} else {
						categorySelected = firstCategories[0]
					}
					// https://www.yuque.com/apifm/nu0f75/ypi79p
					const resAd = await this.$wxapi.adPosition('category_' + categorySelected.id)
					let adPosition = null
					if (resAd.code === 0) {
						adPosition = resAd.data
					}
					this.categories = categories
					this.firstCategories = firstCategories
					this.categorySelected = categorySelected
					this.adPosition = adPosition
					this.getGoodsList(0)
				}
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if (index == this.current) return;
				this.current = index;
				// 如果为0，意味着尚未初始化
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				this.scrollTop = 0
				this.getGoodsList(index)
			},
			async getGoodsList(categoryIndex) {
				uni.showLoading({
					title: '',
				})
				const category = this.firstCategories[categoryIndex]
				// https://www.yuque.com/apifm/nu0f75/wg5t98
				const res = await this.$wxapi.goodsv2({
					categoryId: category.id,
					page: this.page,
					pageSize: 20
				})
				uni.hideLoading()
				if (res.code == 700) {
					if (this.page == 1) {
						this.goodsList = null
					} else {
						uni.showToast({
							title: '没有更多了',
							icon: 'none'
						})
					}
					return
				}
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					return
				}
				if (this.page == 1) {
					this.goodsList = res.data.result
				} else {
					this.goodsList = this.goodsList.concat(res.data.result)
				}
			},
			// 弹出商品购买弹窗
			async _showGoodsPop(item) {
				// https://www.yuque.com/apifm/nu0f75/vuml8a
				const res = await this.$wxapi.goodsDetail(item.id, this.token)
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					return
				}
				this.goodsDetail = res.data
				this.showGoodsPop = true
			},
			async addCart(item) {
				let res
				if(item.supplyType == 'vop_jd') {
					// https://www.yuque.com/apifm/nu0f75/yum741
					res = await this.$wxapi.jdvopCartAdd({
						token: this.token,
						goodsId: item.yyId,
						number: 1
					})
				} else {
					// https://www.yuque.com/apifm/nu0f75/et6m6m
					res = await this.$wxapi.shippingCarInfoAddItem(this.token, item.id, 1, [], [])
				}
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					return
				}
				TOOLS.showTabBarBadge()
				uni.showToast({
					title: '加入购物车'
				})
			},
			search(v) {
				console.log(v);
				uni.navigateTo({
					url: '/pages/goods/list?kw=' + v,
				})
			},
			searchscan() {
				uni.scanCode({
					scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
					success: res => {
						this.kw = res.result
						uni.navigateTo({
							url: '/pages/goods/list?kw=' + res.result,
						})
					}
				})
			},
			goDetail(item) {
				uni.navigateTo({
					url: '/pages/goods/detail?id=' + item.id
				})
			}
		}
	}
</script>
<style scoped lang="scss">
	.category-page {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: calc(100vh - var(--window-bottom) - var(--status-bar-height) - var(--window-top));

		.search {
			padding: 8rpx;
			display: flex;
			align-items: center;

			.scan {
				padding: 0 16rpx;
			}
		}

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
