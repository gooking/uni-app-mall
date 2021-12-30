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
	}
</style>
