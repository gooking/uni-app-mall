<template>
	<view class="index">
		<u-sticky></u-sticky><!-- TODO h5 下会把内容遮住 -->
		<view class="top-box" :style="headerMarginTopStyle">
			<view class="t">{{ sysconfigMap.mallName }}</view>
			<view class="search">
				<u-search placeholder="输入关键词搜索" v-model="kw" :showAction="false" :disabled="true" @click="goSearch">
				</u-search>
			</view>
			<!--  #ifdef  MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ -->
			<view class="mp-btn" :style="menuButtonInfoStyle"></view>
			<!--  #endif -->
		</view>

		<u-cell v-if="shopInfo" icon="map" :title="shopInfo.name" value="切换门店" url="/pages/shop/select" clickable
			isLink></u-cell>
		<view class="swiper">
			<u-swiper v-if="banners" :list="banners" indicator circular keyName="picUrl" height="375rpx"
				@click="tapBanner">
			</u-swiper>
			<!-- TODO 点击具体哪一条公告，可以区分跳转 -->
			<u-notice-bar class="notice" v-if="goodsDynamic" icon="bag" :text="goodsDynamic" direction="column"
				mode="link" :disableTouch="false"></u-notice-bar>
		</view>
		<view v-if="categories && categories.length > 0" class="category-container">
			<view class="category-box">
				<view class="category-list" v-for="(item, index) in categories" wx:key="index">
					<view class="category-column" @click="categoryClick(item)">
						<image mode="aspectFill" class="category-imgbox" :src="item.icon"></image>
						<view class="category-title">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>
		<u-notice-bar v-if="notice" class="notice" icon="volume" :text="notice.title"
			mode="link" :url="'/pages/index/notice?id=' + notice.id"></u-notice-bar>
		<u--image v-if="adPosition['index-live-pic']" class="live-pic" :showLoading="true" :src="adPosition['index-live-pic'].val" width="100vw" radius="32rpx" mode="widthFix" @click="goUrl(adPosition['index-live-pic'].url)"></u--image>
	</view>
</template>



<script>
	export default {
		data() {
			return {
				headerMarginTopStyle: 'margin-top:32rpx',
				kw: '',
				menuButtonInfoStyle: '',
				shopInfo: undefined,
				banners: undefined,
				goodsDynamic: undefined,
				categories: undefined,
				notice: undefined,
				adPosition: {}
			}
		},
		onLoad() {
			// #ifdef  MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
			const systemInfo = uni.getSystemInfoSync()
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.menuButtonInfoStyle =
				`width: ${systemInfo.screenWidth - menuButtonInfo.left}px;height: ${menuButtonInfo.height}px`
			this.headerMarginTopStyle = `margin-top:${menuButtonInfo.top}px`
			// #endif
			uni.setNavigationBarTitle({
				title: this.sysconfigMap.mallName
			});
			this.shopInfo = uni.getStorageSync('shopInfo')
			this._banners()
			this._categories()
			this._notice()
			this._adPosition()
		},
		onShow() {
			this._goodsDynamic()
		},
		created() {},
		methods: {
			goSearch() {
				uni.navigateTo({
					url: '/pages/search/index'
				})
			},
			async _banners() {
				// https://www.yuque.com/apifm/nu0f75/ms21ki
				const res = await this.$wxapi.banners({
					type: 'index'
				})
				if (res.code == 0) {
					this.banners = res.data
				} else {
					uni.showToast({
						title: '后台未维护Banner数据',
						icon: 'none'
					})
				}
			},
			tapBanner(index) {
				const linkUrl = this.banners[index].linkUrl
				if (linkUrl) {
					uni.navigateTo({
						linkUrl
					})
				}
			},
			async _goodsDynamic() {
				// https://www.yuque.com/apifm/nu0f75/xehbuk
				const res = await this.$wxapi.goodsDynamic(0)
				if (res.code == 0) {
					this.goodsDynamic = []
					res.data.forEach(ele => {
						this.goodsDynamic.push(`${ele.nick}购买了${ele.goodsName}`)
					})
				}
			},
			async _categories() {
				// https://www.yuque.com/apifm/nu0f75/racmle
				const res = await this.$wxapi.goodsCategory()
				if (res.code == 0) {
					this.categories = res.data.filter(ele => {
						return ele.level == 1
					})
				}
			},
			categoryClick(category) {
				if (category.vopCid1 || category.vopCid2) {
					wx.navigateTo({
						url: '/pages/goods/list-vop?cid1=' + (category.vopCid1 ? category.vopCid1 : '') +
							'&cid2=' + (category.vopCid2 ? category.vopCid2 : ''),
					})
				} else {
					wx.setStorageSync("_categoryId", category.id)
					wx.switchTab({
						url: '/pages/goods/category',
					})
				}
			},
			async _notice() {
				// https://www.yuque.com/apifm/nu0f75/zanb9r
				const res = await this.$wxapi.noticeLastOne()
				if (res.code == 0) {
					this.notice = res.data
				}
			},
			async _adPosition() {
				// https://www.yuque.com/apifm/nu0f75/ypi79p
				const res = await this.$wxapi.adPositionBatch('indexPop,index-live-pic')
				if (res.code == 0) {
					res.data.forEach(ele => {
						this.adPosition[ele.key] = ele
					})
				}
			},
			goUrl(url) {
				if(url) {
					uni.navigateTo({
						url
					})
				}
			},
		}
	}
</script>
<style scoped lang="scss">
	.index {
		.top-box {
			display: flex;
			align-items: center;
			background-color: #FFFFFF;

			.t {
				padding-left: 8rpx;
				font-size: 28rpx;
				color: #333;
			}

			.search {
				padding: 0 8rpx;
				flex: 1;
			}
		}

		.swiper {
			position: relative;

			.notice {
				position: absolute;
				bottom: 46rpx;
				left: 24rpx;
				width: 668rpx;
				color: #fff;
				font-size: 24rpx;
				opacity: 0.8;
				border-radius: 32rpx;
			}
		}

		.category-container {
			padding: 0 0 10px 0;
			margin-top: 16rpx;
			position: relative;
			background-color: white;

			.category-box {
				background-color: #fff;
				display: flex;
				flex-wrap: wrap;
				box-shadow: 0px 0px 18px 0px rgba(5, 5, 5, 0.15);
				width: 700rpx;
				margin-left: 25rpx;
				border-radius: 10px;
				padding: 20rpx 0;
				position: inherit;
			}

			.category-list {
				width: 140rpx;
				text-align: center;
				display: inline-block;
				overflow: hidden;
			}

			.category-column {
				width: 100%;
				margin-top: 20rpx;
				overflow: hidden;
			}

			.category-imgbox {
				width: 100rpx;
				height: 100rpx;
			}

			.category-title {
				font-size: 24rpx;
				text-align: center;
			}
		}
		.live-pic {
			margin-top: 16rpx;
		}
	}
</style>
