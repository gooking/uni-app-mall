<template>
	<view class="index">
		
	</view>
</template>



<script>
	export default {
		data() {
			return {
				headerMarginTopStyle: 'margin-top:0',
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

</style>
