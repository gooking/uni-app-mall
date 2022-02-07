<script>
	const WXAUTH = require('@/common/wxauth.js')
	const TTAUTH = require('@/common/ttauth.js')
	export default {
		globalData: {
			h5Domain: 'https://flpt.jxsupplier.com',
			goLogin: false,
			subDomain: 'tz', // jdjf0115
			merchantId: '951', // 42151
			version: '0.0.2',
			sysconfigkeys: 'mallName,shopMod,share_profile,recharge_amount_min'
		},
		onLaunch: function() {
			// https://www.yuque.com/apifm/nu0f75/cdqz1n
			this.$wxapi.setMerchantId(this.globalData.merchantId)
			this.$wxapi.init(this.globalData.subDomain)
			const _this = this
			// 1.1.0版本之前关于http拦截器代码，已平滑移动到/common/http.interceptor.js中
			// 注意，需要在/main.js中实例化Vue之后引入如下(详见文档说明)：
			// import httpInterceptor from '@/common/http.interceptor.js'
			// Vue.use(httpInterceptor, app)
			// process.env.VUE_APP_PLATFORM 为通过js判断平台名称的方法，结果分别如下：
			/**
			 * h5，app-plus(nvue下也为app-plus)，mp-weixin，mp-alipay......
			 */
			this.checkForUpdate(); // 检查新版本
			this.queryConfigBatch();
		},
		onShow(e) {
			if (e && e.query && e.query.inviter_id) {
				this.$u.vuex('referrer', e.query.inviter_id)
			}
			if (e && e.query && e.query.code) {
				// 微信登陆
				this.wxmpLogin(e.query.code)
				return
			} else {
				this.autoLogin()
			}
		},
		onHide: function() {
			// console.log('App Hide，app不再展现在前台')
		},
		onPageNotFound(e) {
			// 页面不存在 {path: '/1212', query: {a: '123'}, isEntryPage: true}
			console.error(e)
		},
		methods: {
			async queryConfigBatch() {
				const sysconfigkeys = this.globalData.sysconfigkeys
				if (!sysconfigkeys) {
					return
				}
				// https://www.yuque.com/apifm/nu0f75/dis5tl
				const res = await this.$wxapi.queryConfigBatch(sysconfigkeys)
				if (res.code == 0) {
					const sysconfigMap = {}
					res.data.forEach(config => {
						sysconfigMap[config.key] = config.value
					})
					this.$u.vuex('sysconfigMap', sysconfigMap)
				}
			},
			checkForUpdate() {
				// #ifdef MP
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					console.log(res.hasUpdate);
				});
				updateManager.onUpdateReady(function(res) {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，是否重启应用？',
						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}
					});

				});
				updateManager.onUpdateFailed(function(res) {
					// 新的版本下载失败
				});
				// #endif
				// #ifdef APP-PLUS
				// APP 自动更新
				// #endif
			},
			async autoLogin() {
				// 自动登陆
				// #ifdef MP-WEIXIN
				const isLogined = await WXAUTH.checkHasLogined()
				if (!isLogined) {
					await WXAUTH.authorize()
					await WXAUTH.bindSeller()
				}
				setTimeout(() => {
					uni.$emit('loginOK', {})
				}, 500)
				// #endif
				// #ifdef MP-TOUTIAO
				const isLogined = await TTAUTH.checkHasLogined()
				if (!isLogined) {
					await TTAUTH.authorize()
					await TTAUTH.bindSeller()
				}
				setTimeout(() => {
					uni.$emit('loginOK', {})
				}, 500)
				// #endif
				// #ifdef H5
				const isLogined = await this.checkHasLoginedH5()
				if (!isLogined) {
					// 判断是普通浏览器还是微信浏览器
					const ua = window.navigator.userAgent.toLowerCase();
					console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
					if (ua.match(/MicroMessenger/i) == 'micromessenger') {
						// https://www.yuque.com/apifm/nu0f75/fpvc3m
						const res = await this.$wxapi.siteStatistics()
						const wxMpAppid = res.data.wxMpAppid
						let _domian = this.globalData.h5Domain + '/pages/index/index'
						_domian = encodeURIComponent(_domian)
						console.log(_domian);
						if (!this.globalData.goLogin) {
							this.globalData.goLogin = true
							window.parent.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
								wxMpAppid + '&redirect_uri=' + _domian +
								'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
						}
					} else {
						uni.navigateTo({
							url: "/pages/login/login"
						})
					}
				}
				// #endif
			},
			async checkHasLoginedH5() {
				if (!this.token) {
					return false
				}
				// https://www.yuque.com/apifm/nu0f75/mp9f59
				const res = await this.$wxapi.checkToken(this.token)
				if (res.code != 0) {
					this.$u.vuex('token', '')
					return false
				}
				return true
			},
			async wxmpLogin(code) {
				// https://www.yuque.com/apifm/nu0f75/lh6cd3
				const res = await this.$wxapi.wxmpAuth({
					code
				})
				if (res.code == 0) {
					this.$u.vuex('token', res.data.token)
					this.$u.vuex('uid', res.data.uid)
					this.$u.vuex('openid', res.data.openid)
					setTimeout(() => {
						uni.$emit('loginOK', {})
					}, 500)
				}
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";

	.price-score {
		display: flex;
		color: #e64340;
		font-size: 38rpx;

		text {
			padding: 0 4rpx;
			font-size: 28rpx;
		}

		.item {
			padding: 0 8rpx;
		}

		.original {
			margin-left: 32rpx;
			color: #aaa;
			text-decoration: line-through
		}

		.score-icon {
			width: 28rpx;
			height: 28rpx;
		}
	}

	.goods-title-tag {
		display: inline-flex !important;
		margin-right: 24rpx;
	}

	.goods-title {
		color: #333;
		font-size: 28rpx;
	}

	.pt16 {
		padding-top: 16rpx !important;
	}
	.submit-btn {
		padding: 32rpx;
	}
</style>
