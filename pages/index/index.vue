<template>
	<view class="index">
		<u-sticky bgColor="#FFFFFF" customNavHeight="0">
			<!--  #ifdef  APP-PLUS -->
			<view class="app-status-bar-height"></view>
			<!--  #endif -->
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
		</u-sticky>
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
			url="/pages/notice/list"></u-notice-bar>
		<u-image v-if="adPosition['index-live-pic']" class="live-pic" :showLoading="true"
			:src="adPosition['index-live-pic'].val" width="100vw" height="auto" radius="32rpx" mode="widthFix"
			@click="goUrl(adPosition['index-live-pic'].url)"></u-image>
		<view v-if="miaoshaGoods" class="miaoshaGoods">
			<view class="ttt">
				<view class="l"><u-line></u-line></view>
				<view class="content">
					<image src="/static/images/miaosha.png"></image>
					<text>限时秒杀</text>
				</view>
				<view class="l"><u-line></u-line></view>
			</view>
			<view v-for="(item, index) in miaoshaGoods" :key="index" class="miaosha-goods-list" @click="toDetailsTap">
				<image :src="item.pic" class="image" mode="aspectFill" lazy-load="true" @click="goDetail(item)" />
				<view class="r">
					<view class="goods-title" @click="goDetail(item)">{{item.name}}</view>
					<u-count-down v-if="item.dateStartInt > 0" class="count-down" :time="item.dateStartInt"
						format="距离开始: HH时mm分ss秒"></u-count-down>
					<u-count-down v-if="item.dateStartInt <= 0 && item.dateEndInt > 0" class="count-down"
						:time="item.dateEndInt" format="剩余: HH时mm分ss秒"></u-count-down>
					<view class="miaosha-price-btn">
						<view class="price">￥{{item.minPrice}} <text>￥{{item.originalPrice}}</text></view>
						<u-button v-if="item.dateStartInt > 0" type="warning" size="mini" plain disabled text="即将开始"
							@click="goDetail(item)">
						</u-button>
						<u-button v-else-if="item.dateEndInt <= 0" type="info" size="mini" plain disabled text="已结束"
							@click="goDetail(item)">
						</u-button>
						<u-button v-else-if="item.stores <= 0" type="info" size="mini" plain disabled text="已抢完"
							@click="goDetail(item)">
						</u-button>
						<u-button v-else type="error" size="mini" plain text="立即抢购" @click="goDetail(item)"></u-button>
					</view>
				</view>
			</view>
		</view>
		<view v-if="goodsRecommend" class="goodsRecommend">
			<view class="ttt">
				<view class="l"><u-line></u-line></view>
				<view class="content">
					<image src="/static/images/recommend.png"></image>
					<text>爆款推荐</text>
				</view>
				<view class="l"><u-line></u-line></view>
			</view>
			<view class="goods-container">
				<view v-for="(item, index) in goodsRecommend" :key="index" class="goods-box" bindtap="toDetailsTap">
					<view class="img-box">
						<image :src="item.pic" class="image" mode="aspectFill" lazy-load="true"
							@click="goDetail(item)" />
					</view>
					<view class="goods-title u-line-3 pt16" @click="goDetail(item)">
						<u-tag v-if="item.supplyType == 'vop_jd' || item.supplyType == 'jdJoycityPoints'" text="京东自营"
							bgColor="#e64340" borderColor="#e64340" size="mini" class="goods-title-tag"></u-tag>
						<text class="goods-title">{{ item.name }}</text>
					</view>
					<u-text v-if="item.characteristic" class="goods-title" :text="item.characteristic" size="28rpx"
						color="#c95060"></u-text>
					<view class="price-score">
						<view v-if="item.minPrice" class="item"><text>¥</text>{{item.minPrice}}</view>
						<view v-if="item.minScore" class="item"><text>
								<image class="score-icon" src="/static/images/score.png"></image>
							</text>{{item.minScore}}</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="kanjiaList" class="miaoshaGoods">
			<view class="ttt">
				<view class="l"><u-line></u-line></view>
				<view class="content">
					<image src="/static/images/kanjia.png"></image>
					<text>疯狂砍价</text>
				</view>
				<view class="l"><u-line></u-line></view>
			</view>
			<view v-for="(item, index) in kanjiaList" :key="index" class="miaosha-goods-list" @click="toDetailsTap">
				<image :src="item.pic" class="image" mode="aspectFill" lazy-load="true" @click="goDetail(item)" />
				<view class="r">
					<view class="goods-title" @click="goDetail(item)">{{item.name}}</view>
					<u-text v-if="item.characteristic" class="goods-title" :text="item.characteristic" size="28rpx"
						color="#c95060"></u-text>
					<u-line-progress :percentage="item.process" activeColor="#ff0000"></u-line-progress>
					<view class="miaosha-price-btn">
						<view class="price">￥{{item.kanjiaPrice}} <text>￥{{item.minPrice}}</text></view>
						<u-button type="error" size="mini" plain text="我要砍价" @click="goDetail(item)"></u-button>
					</view>
				</view>
			</view>
		</view>
		<view v-if="pingtuanList" class="miaoshaGoods">
			<view class="ttt">
				<view class="l"><u-line></u-line></view>
				<view class="content">
					<image src="/static/images/pingtuan.png"></image>
					<text>全民拼团</text>
				</view>
				<view class="l"><u-line></u-line></view>
			</view>
			<view v-for="(item, index) in pingtuanList" :key="index" class="miaosha-goods-list" @click="toDetailsTap">
				<image :src="item.pic" class="image" mode="aspectFill" lazy-load="true" @click="goDetail(item)" />
				<view class="r">
					<view class="goods-title" @click="goDetail(item)">{{item.name}}</view>
					<u-text v-if="item.characteristic" class="goods-title" :text="item.characteristic" size="28rpx"
						color="#c95060"></u-text>
					<view class="miaosha-price-btn">
						<view class="price">￥{{item.kanjiaPrice}} <text>￥{{item.minPrice}}</text></view>
						<u-button type="success" size="mini" text="我要拼团" @click="goDetail(item)"></u-button>
					</view>
				</view>
			</view>
		</view>
		<view v-if="goods" class="goodsRecommend">
			<view class="ttt">
				<view class="l"><u-line></u-line></view>
				<view class="content">
					<image src="/static/images/goodslist.png"></image>
					<text>商品列表</text>
				</view>
				<view class="l"><u-line></u-line></view>
			</view>
			<view class="goods-container">
				<view v-for="(item, index) in goods" :key="index" class="goods-box" bindtap="toDetailsTap">
					<view class="img-box">
						<image :src="item.pic" class="image" mode="aspectFill" lazy-load="true"
							@click="goDetail(item)" />
					</view>
					<view class="goods-title u-line-3 pt16" @click="goDetail(item)">
						<u-tag v-if="item.supplyType == 'vop_jd' || item.supplyType == 'jdJoycityPoints'" text="京东自营"
							bgColor="#e64340" borderColor="#e64340" size="mini" class="goods-title-tag"></u-tag>
						<text class="goods-title">{{ item.name }}</text>
					</view>
					<u-text v-if="item.characteristic" class="goods-title" :text="item.characteristic" size="28rpx"
						color="#c95060"></u-text>
					<view class="price-score">
						<view v-if="item.minPrice" class="item"><text>¥</text>{{item.minPrice}}</view>
						<view v-if="item.minScore" class="item"><text>
								<image class="score-icon" src="/static/images/score.png"></image>
							</text>{{item.minScore}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="blank"></view>
		<view class='coupons-float' @click="goCoupons">
			<image src="/static/images/gift.png"></image>
		</view>
		<u-overlay v-if="adPosition['indexPop']" :show="adPositionIndexPop" @click="goUrl(adPosition['indexPop'].url)">
			<view class="adPositionIndexPop">
				<image :src="adPosition['indexPop'].val" mode="widthFix"></image>
				<view class="close" @click="adPositionIndexPop = false">
					<u-icon name="close-circle-fill" color="#eee" size="80rpx"></u-icon>
				</view>
			</view>
		</u-overlay>
	</view>
</template>



<script>
	const TOOLS = require('@/common/tools')
	// #ifdef H5
	const ua = window.navigator.userAgent.toLowerCase()
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		const jweixin = require('jweixin-module')
		jweixin.ready(() => { // 需在用户可能点击分享按钮前就先调用
			jweixin.updateAppMessageShareData({
				title: '京栖无限企福平台', // 分享标题
				desc: '京栖无限企福平台', // 分享描述
				link: 'https://flpt.jxsupplier.com', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: 'https://dcdn.it120.cc/2022/01/26/02235d13-1ea8-4cd1-af00-1b219b5b07f9.jpeg', // 分享图标
				success: function() {
					// 设置成功
				}
			})
			jweixin.updateTimelineShareData({
				title: '京栖无限企福平台', // 分享标题
				desc: '京栖无限企福平台', // 分享描述
				link: 'https://flpt.jxsupplier.com', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: 'https://dcdn.it120.cc/2022/01/26/02235d13-1ea8-4cd1-af00-1b219b5b07f9.jpeg', // 分享图标
				success: function() {
					// 设置成功
				}
			})
		})
	}
	// #endif
	export default {
		data() {
			return {
				headerMarginTopStyle: 'margin-top:0',
				kw: '',
				menuButtonInfoStyle: '',
				shopInfo: undefined,
				banners: undefined,
				goodsDynamic: undefined,
				categories: undefined,
				notice: undefined,
				adPosition: {},
				miaoshaGoods: undefined,
				goodsRecommend: undefined,
				kanjiaList: undefined,
				pingtuanList: undefined,
				page: 1,
				goods: [],
				adPositionIndexPop: false
			}
		},
		onLoad(e) {
			// #ifdef  MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
			uni.showShareMenu({
				withShareTicket: true,
			})
			// #endif
			// #ifdef  MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
			const systemInfo = uni.getSystemInfoSync()
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.menuButtonInfoStyle =
				`width: ${systemInfo.screenWidth - menuButtonInfo.left}px;height: ${menuButtonInfo.height}px`
			this.headerMarginTopStyle = `margin-top:${menuButtonInfo.top}px`
			// #endif
			// 读取小程序码中的邀请人编号
			if (e && e.scene) {
				const scene = decodeURIComponent(e.scene)
				if (scene) {
					this.$u.vuex('referrer', scene.substring(11))
				}
			}
			uni.setNavigationBarTitle({
				title: this.sysconfigMap.mallName
			})
			this._banners()
			this._categories()
			this._notice()
			this._adPosition()
			this._miaoshaGoods()
			this._goodsRecommend()
			this._kanjiaList()
			this._pingtuanList()
			this._goods()
			// #ifdef H5
			const ua = window.navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				this.jssdkSign()
			}
			// #endif
		},
		onShow() {
			this.shopInfo = uni.getStorageSync('shopInfo')
			this._goodsDynamic()
			TOOLS.showTabBarBadge()
			const refreshIndex = uni.getStorageSync('refreshIndex')
			if (refreshIndex) {
				this.onPullDownRefresh()
				uni.removeStorageSync('refreshIndex')
			}
		},
		created() {},
		onShareAppMessage() {
			return {
				title: '"' + this.sysconfigMap.mallName + '" ' + this.sysconfigMap.share_profile,
				path: '/pages/index/index?inviter_id=' + this.uid
			}
		},
		onReachBottom() {
			this.page += 1
			this._goods()
		},
		onPullDownRefresh() {
			this.page = 1
			this._banners()
			this._categories()
			this._notice()
			this._adPosition()
			this._miaoshaGoods()
			this._goodsRecommend()
			this._kanjiaList()
			this._pingtuanList()
			this._goods()
			uni.stopPullDownRefresh()
		},
		methods: {
			async jssdkSign() {
				const res = await this.$wxapi.jssdkSign(window.location.href)
				if (res.code === 0) {
					jweixin.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: res.data.appid, // 必填，公众号的唯一标识
						timestamp: res.data.timestamp, // 必填，生成签名的时间戳
						nonceStr: res.data.noncestr, // 必填，生成签名的随机串
						signature: res.data.sign, // 必填，签名
						jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
					})
				}
			},
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
					uni.navigateTo({
						url: '/pages/goods/list-vop?cid1=' + (category.vopCid1 ? category.vopCid1 : '') +
							'&cid2=' + (category.vopCid2 ? category.vopCid2 : ''),
					})
				} else {
					uni.navigateTo({
						url: '/pages/goods/list?categoryId=' + category.id,
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
						if (ele.key == 'indexPop') {
							this.adPositionIndexPop = true
						}
					})
				}
			},
			goUrl(url) {
				this.adPositionIndexPop = false
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
			async _goodsRecommend() {
				// https://www.yuque.com/apifm/nu0f75/wg5t98
				const res = await this.$wxapi.goodsv2({
					recommendStatus: 1
				})
				if (res.code == 0) {
					this.goodsRecommend = res.data.result
				}
			},
			async _kanjiaList() {
				// https://www.yuque.com/apifm/nu0f75/wg5t98
				const res = await this.$wxapi.goodsv2({
					kanjia: true
				})
				if (res.code == 0) {
					const kanjiaGoodsIds = []
					res.data.result.forEach(ele => {
						kanjiaGoodsIds.push(ele.id)
					})
					// https://www.yuque.com/apifm/nu0f75/xs42ih
					const goodsKanjiaSetRes = await this.$wxapi.kanjiaSet(kanjiaGoodsIds.join())
					if (goodsKanjiaSetRes.code == 0) {
						res.data.result.forEach(ele => {
							const _process = goodsKanjiaSetRes.data.find(_set => {
								return _set.goodsId == ele.id
							})
							if (_process) {
								ele.process = 100 * _process.numberBuy / _process.number
								ele.process = ele.process.toFixed(0)
							}
						})
						this.kanjiaList = res.data.result
					}
				}
			},
			async _pingtuanList() {
				// https://www.yuque.com/apifm/nu0f75/wg5t98
				const res = await this.$wxapi.goodsv2({
					pingtuan: true
				})
				if (res.code == 0) {
					this.pingtuanList = res.data.result
				}
			},
			async _goods() {
				// https://www.yuque.com/apifm/nu0f75/wg5t98
				const res = await this.$wxapi.goodsv2({
					page: this.page,
					pageSize: 10
				})
				if (res.code == 0) {
					if (this.page == 1) {
						this.goods = res.data.result
					} else {
						this.goods = this.goods.concat(res.data.result)
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
			goDetail(item) {
				uni.navigateTo({
					url: '/pages/goods/detail?id=' + item.id
				})
			},
			goCoupons() {
				uni.switchTab({
					url: '/pages/coupons/index'
				})
			}
		}
	}
</script>
<style scoped lang="scss">
	.app-status-bar-height {
		width: 100%;
		height: var(--status-bar-height);
	}

	.index {
		.top-box {
			padding: 16rpx 8rpx;
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

				margin-left: 25rpx;
				margin-right: 25rpx;
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

		.ttt {
			display: flex;
			align-items: center;
			margin-top: 24rpx;

			.l {
				flex: 1;
				display: inline-block;
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
					margin-left: 16rpx;
					color: #333;
					font-size: 28rpx;
				}
			}
		}

		.miaoshaGoods {
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

			.miaosha-price-btn {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.miaosha-price-btn .msbtn {
				width: 170rpx;
				height: 60rpx;
				background: linear-gradient(156deg, #FF7863 0%, #FF211A 100%);
				border-radius: 34rpx;
				border: none !important;
				line-height: 60rpx !important;
				font-size: 13px !important;
			}

			.miaosha-price-btn .price {
				color: #e64340;
				font-size: 40rpx;
				margin-top: 12rpx;
				padding-right: 32rpx;
			}

			.miaosha-price-btn .price text {
				color: #666666;
				font-size: 26rpx;
				text-decoration: line-through;
			}
		}

		.goods-container {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			box-sizing: content-box;
			padding: 0 24rpx;
		}

		.goods-box {
			width: 339rpx;
			background-color: #fff;
			overflow: hidden;
			margin-top: 24rpx;
			border-radius: 5px;
			border: 1px solid #D1D1D1;
			padding-bottom: 10rpx;
		}

		.goods-box .img-box {
			width: 339rpx;
			height: 339rpx;
			overflow: hidden;
		}

		.goods-box .img-box image {
			width: 339rpx;
			height: 339rpx;
		}

		.goods-box .goods-title {
			padding: 0 4rpx;
		}

		.goods-box .goods-price-container {
			display: flex;
			align-items: baseline;
		}

		.goods-box .goods-price {
			overflow: hidden;
			font-size: 34rpx;
			color: #F20C32;
			margin-left: 24rpx;
		}

		.goods-box .goods-price2 {
			overflow: hidden;
			font-size: 26rpx;
			color: #aaa;
			text-decoration: line-through;
			margin-left: 20rpx;
		}

		.coupons-float {
			position: fixed;
			right: 15rpx;
			bottom: 180rpx;
			width: 80rpx;
			height: 80rpx;
			background-color: #fff;
			text-align: center;
			border-radius: 50%;
			border: 1rpx solid #ddd;
		}

		.coupons-float image {
			width: 60rpx;
			height: 60rpx;
			margin-top: 10rpx;
		}

		.adPositionIndexPop {
			width: 100vw;
			height: 100vh;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.adPositionIndexPop image {
			width: 420rpx;
		}

		.adPositionIndexPop .close {
			margin-top: 32rpx;
		}
	}

	.blank {
		height: 32rpx;
	}
</style>
