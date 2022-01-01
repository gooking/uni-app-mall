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
			<u-notice-bar class="notice" v-if="goodsDynamic" icon="bag" :text="goodsDynamic" direction="column"
				mode="link" :disableTouch="false" @click="noticeclick"></u-notice-bar>
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
		<u-notice-bar v-if="notice" class="notice" icon="volume" :text="notice.title" mode="link"
			:url="'/pages/index/notice?id=' + notice.id"></u-notice-bar>
		<u--image v-if="adPosition['index-live-pic']" class="live-pic" :showLoading="true"
			:src="adPosition['index-live-pic'].val" width="100vw" radius="32rpx" mode="widthFix"
			@click="goUrl(adPosition['index-live-pic'].url)"></u--image>
		<view v-if="miaoshaGoods" class="miaoshaGoods">
			<view class="t">
				<u-line class="l"></u-line>
				<view class="content">
					<image src="/static/images/miaosha.png"></image>
					<text>限时秒杀</text>
				</view>
				<u-line class="l"></u-line>
			</view>
			<view v-for="(item, index) in miaoshaGoods" :key="index" class="miaosha-goods-list" @click="toDetailsTap">
				<image :src="item.pic" class="image" mode="aspectFill" lazy-load="true" />
				<view class="r">
					<view class="goods-title">{{item.name}}</view>
					<u-count-down v-if="item.dateStartInt > 0" class="count-down" :time="item.dateStartInt" format="距离开始: HH 时 mm 分 ss 秒"></u-count-down>
					<u-count-down v-if="item.dateStartInt <= 0 && item.dateEndInt > 0" class="count-down" :time="item.dateEndInt" format="剩余: HH 时 mm 分 ss 秒"></u-count-down>
					<view class="miaosha-price-btn">
						<view class="price">￥{{item.minPrice}} <text>￥{{item.originalPrice}}</text></view>
						<van-button custom-class="msbtn" v-if="item.dateStartInt > 0" type="danger" size="small" round
							plain disabled>未开始</van-button>
						<van-button custom-class="msbtn" v-if="item.dateEndInt <= 0" type="danger" size="small" round>
							已结束
						</van-button>
						<van-button custom-class="msbtn" v-if="item.stores <= 0" type="danger" size="small" round>已抢完
						</van-button>
						<van-button custom-class="msbtn"
							v-if="item.dateStartInt <= 0 && item.dateEndInt > 0 && item.stores > 0" type="danger"
							size="small" round>立即抢购</van-button>
					</view>
				</view>
			</view>
		</view>
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
				adPosition: {},
				miaoshaGoods: undefined
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
			this._miaoshaGoods()
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
				if (url) {
					uni.navigateTo({
						url
					})
				}
			},
			noticeclick(e) {
				console.log(e);
			},
			async _miaoshaGoods() {
				// https://www.yuque.com/apifm/nu0f75/wg5t98
				const res = await this.$wxapi.goodsv2({
					miaosha: true
				})
				if (res.code == 0) {
					res.data.result.forEach(ele => {
						const _now = new Date().getTime()
						if (ele.dateStart) {
							ele.dateStartInt = new Date(ele.dateStart.replace(/-/g, '/')).getTime() - _now
						}
						if (ele.dateEnd) {
							ele.dateEndInt = new Date(ele.dateEnd.replace(/-/g, '/')).getTime() - _now
						}
					})
					this.miaoshaGoods = res.data.result
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
			margin-top: 8rpx;

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

		.miaoshaGoods {
			.t {
				display: flex;
				align-items: center;
				margin-top: 24rpx;

				.l {
					flex: 1;
				}

				.content {
					display: flex;
					align-items: center;
					padding: 0 16rpx;

					image {
						width: 34rpx;
						height: 42rpx;
					}

					text {
						color: #333;
						font-size: 28rpx;
					}
				}
			}

			.miaosha-goods-list {
				margin: 20rpx;
				border-radius: 16rpx;
				display: flex;
				padding: 20rpx;
			}

			.miaosha-goods-list .image {
				width: 260rpx;
				height: 260rpx;
				flex-shrink: 0;
				border-radius: 16rpx;
			}

			.miaosha-goods-list .r {
				margin-left: 32rpx;
			}

			.miaosha-goods-list .r .goods-title {
				color: #333;
				font-size: 28rpx;
			}

			.miaosha-goods-list .r .label {
				color: #e64340;
				font-size: 24rpx;
				display: flex;
				align-items: flex-start;
				margin-top: 8rpx;
			}

			.miaosha-goods-list .r .label text {
				margin-left: 8rpx;
			}

			.miaosha-goods-list .count-down {
				background: rgba(250, 195, 198, 0.3);
				border-radius: 5rpx;
				font-size: 14rpx;
				color: red;
				font-weight: 400;
				padding: 6rpx 16rpx;
				margin-top: 6rpx;
				text-align: center;
				border-radius: 10rpx;
			}
		}
	}
</style>
