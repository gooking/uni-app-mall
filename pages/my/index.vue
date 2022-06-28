<template>
	<view v-if="apiUserInfoMap">
		<view class="header-box">
			<image class="avatar" :src="apiUserInfoMap.base.avatarUrl" mode="aspectFill"></image>
			<view class="r">
				<view class="uid">用户ID: {{ apiUserInfoMap.base.id }}</view>
				<view class="nick">{{ apiUserInfoMap.base.nick }}</view>
			</view>
		</view>
		<view class="asset">
			<view class='item' @click="go('/pages/asset/balance')">
				<view class="amount">{{balance}}</view>
				<view>余额</view>
			</view>
			<view class='item right' @click="go('/pages/asset/balance')">
				<view class="amount">{{freeze}}</view>
				<view>冻结</view>
			</view>
			<view class='item right' @click="go('/pages/score/index')">
				<view class="amount">{{score}}</view>
				<view>积分</view>
			</view>
			<view v-if="sysconfigMap.open_growth == '1'" class='item right' @click="go('/pages/growth/index')">
				<view class="amount">{{growth}}</view>
				<view>成长值</view>
			</view>
		</view>
		<u-line></u-line>
		<u-cell icon="rmb-circle" title="优惠买单" isLink clickable url="/pages/pay/maidan"></u-cell>
		<u-cell icon="order" title="我的订单" value="更多" isLink clickable url="/pages/order/index"></u-cell>
		<u-grid col="5" :border="false" @click="orderGridClick">
			<u-grid-item name="0">
				<view class="grid_item">
					<u-icon name="rmb-circle" size="52rpx"></u-icon>
					<text class="txt">待付款</text>
				</view>
			</u-grid-item>
			<u-grid-item name="1">
				<view class="grid_item">
					<u-icon name="car" size="52rpx"></u-icon>
					<text class="txt">待发货</text>
				</view>
			</u-grid-item>
			<u-grid-item name="2">
				<view class="grid_item">
					<u-icon name="gift" size="52rpx"></u-icon>
					<text class="txt">待收货</text>
				</view>
			</u-grid-item>
			<u-grid-item name="3">
				<view class="grid_item">
					<u-icon name="thumb-up" size="52rpx"></u-icon>
					<text class="txt">待评价</text>
				</view>
			</u-grid-item>
			<u-grid-item name="99">
				<view class="grid_item">
					<u-icon name="server-man" size="52rpx"></u-icon>
					<text class="txt">售后</text>
				</view>
			</u-grid-item>
		</u-grid>
		<u-cell icon="grid" title="常用功能"></u-cell>
		<u-grid col="4" :border="false" @click="go">
			<u-grid-item name="/pages/asset/cashlog">
				<view class="grid_item">
					<u-icon name="red-packet" size="52rpx"></u-icon>
					<text class="txt">资金明细</text>
				</view>
			</u-grid-item>
			<u-grid-item name="switchTab:/pages/coupons/index">
				<view class="grid_item">
					<u-icon name="red-packet-fill" size="52rpx"></u-icon>
					<text class="txt">优惠券</text>
				</view>
			</u-grid-item>
			<u-grid-item name="/pages/goods/fav">
				<view class="grid_item">
					<u-icon name="heart" size="52rpx"></u-icon>
					<text class="txt">我的收藏</text>
				</view>
			</u-grid-item>
			<u-grid-item name="/pages/address/index">
				<view class="grid_item">
					<u-icon name="map" size="52rpx"></u-icon>
					<text class="txt">收货地址</text>
				</view>
			</u-grid-item>
			<u-grid-item name="/pages/invoice/list">
				<view class="grid_item">
					<u-icon name="red-packet" size="52rpx"></u-icon>
					<text class="txt">发票管理</text>
				</view>
			</u-grid-item>
			<u-grid-item name="/pages/invoice/apply">
				<view class="grid_item">
					<u-icon name="red-packet" size="52rpx"></u-icon>
					<text class="txt">申请发票</text>
				</view>
			</u-grid-item>
		</u-grid>
		<u-line></u-line>
		<u-gap height="5" bgColor="#EAEBEC"></u-gap>
		<u-cell-group title="三级分销">
			<u-cell v-if="!apiUserInfoMap.base.isSeller" title="成为分销商" isLink url="/packageFx/apply/index"></u-cell>
			<u-cell v-else title="分销中心" isLink url="/packageFx/index/index"></u-cell>
			<u-cell v-if="apiUserInfoMap.base.isSeller" title="我的团队" isLink url="/packageFx/myusers/index"></u-cell>
			<u-cell v-if="apiUserInfoMap.base.isSeller" title="推广订单" isLink url="/packageFx/commisionLog/index"></u-cell>
		</u-cell-group>
		<u-gap height="5" bgColor="#EAEBEC"></u-gap>
  
		<u-cell title="关于我们" isLink clickable url="/pages/about/about?key=aboutus"></u-cell>
		<u-cell title="帮助中心" isLink clickable url="/pages/help/list"></u-cell>
		<u-cell title="意见反馈" isLink clickable url="/pages/my/feedback"></u-cell>
		<u-cell title="清除缓存" isLink clickable @click="clearStorage"></u-cell>
		<u-cell title="当前版本" :value="version"></u-cell>
		<view class="btn-block">
			<u-button type="error" text="退出" @click="loginout"></u-button>
		</view>
	</view>
	<view v-else-if="needLogin">
		<u-empty mode="permission" text="请先登陆" marginTop="88rpx"></u-empty>
		<view class="submit">
			<u-button type="success" @click="goLogin">立即登陆</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				needLogin: false,
				apiUserInfoMap: undefined,
				balance: 0,
				freeze: 0,
				score: 0,
				growth: 0,
				pic: 'https://uviewui.com/common/logo.png',
				show: true,
				version: getApp().globalData.version,
				version: undefined
			}
		},
		onLoad() {
			this.version = getApp().globalData.version
		},
		onShow() {
			this._userDetail()
			this._getUserAmount()
		},
		methods: {
			async _userDetail() {
				// https://www.yuque.com/apifm/nu0f75/zgf8pu
				const res = await this.$wxapi.userDetail(this.token)
				if (res.code == 2000) {
					this.needLogin = true
				}
				if (res.code == 0) {
					if (!res.data.base.avatarUrl) {
						res.data.base.avatarUrl = '/static/images/empty.jpg'
					}
					this.apiUserInfoMap = res.data
				}
			},
			async _getUserAmount() {
				// https://www.yuque.com/apifm/nu0f75/wrqkcb
				const res = await this.$wxapi.userAmount(this.token)
				if (res.code == 2000) {
					this.needLogin = true
				}
				if (res.code == 0) {
					this.balance = res.data.balance.toFixed(2),
						this.freeze = res.data.freeze.toFixed(2),
						this.score = res.data.score,
						this.growth = res.data.growth
				}
			},
			orderGridClick(status) {
				if (status == 99) {
					uni.navigateTo({
						url: '/pages/order/index?status=' + status
					})
				} else {
					uni.navigateTo({
						url: '/pages/order/index?status=' + status
					})
				}
			},
			go(url) {
				if(url.indexOf('switchTab:') != -1) {
					uni.switchTab({
						url: url.substring(10)
					})
				} else {
					uni.navigateTo({
						url: url
					})
				}
			},
			clearStorage() {
				uni.clearStorageSync()
				uni.showToast({
					title: '已清除'
				})
				uni.reLaunch({
				    url: '../index/index'
				})
			},
			async loginout() {
				// https://www.yuque.com/apifm/nu0f75/mg77aq
				await this.$wxapi.loginout(this.token)
				this.$u.vuex('token', '')
				this.$u.vuex('uid', '')
				uni.reLaunch({
				    url: '../index/index'
				})
			},
			goLogin() {
				// #ifdef MP
				getApp().autoLogin()
				// #endif
				// #ifdef H5
				const ua = window.navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == 'micromessenger') {
					getApp().autoLogin()
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
				// #endif
				// #ifndef MP || H5
				uni.navigateTo({
					url: '/pages/login/login'
				})
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header-box {
		padding: 32rpx;
		padding-bottom: 64rpx;
		display: flex;
		align-items: center;
		color: #333;
	}

	.header-box .avatar {
		width: 128rpx;
		height: 128rpx;
		border-radius: 50%;
	}

	.header-box .btn {
		margin-left: 32rpx;
	}

	.header-box .r {
		margin-left: 32rpx;
		font-size: 28rpx;
	}
	.container {
		min-height: 100%;
		overflow: hidden;
		overflow-y: hidden;
	}

	.asset {
		width: 100vw;
		display: flex;
		border-top: 1px solid #eee;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}

	.asset .item {
		flex: 1;
		display: flex;
		flex-direction: column;
		text-align: center;
		font-size: 24rpx;
		line-height: 20px;
		color: #666;
	}

	.asset .item .amount {
		color: #333;
		font-size: 32rpx;
		padding-bottom: 12rpx;
	}

	.asset .right {
		border-left: 1px solid #eee;
	}

	.version {
		width: 100vw;
		font-size: 24rpx;
		text-align: center;
		padding: 32rpx;
	}

	.to-authorize {
		padding: 0rpx;
		margin: 0rpx;
		background: none;
		border: none;
		height: auto;
		line-height: auto;
	}

	/* 绑定手机号 */
	.bind-phone-number {
		margin: 20rpx;
		width: 100%;
	}

	/* flex重新构建菜单 */
	.menu-item {
		width: 100vw;
		height: 104rpx;
		padding: 0 32rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.menu-item .l {
		font-size: 34rpx;
		color: #333;
		line-height: 104rpx;
	}

	.menu-item .r {
		font-size: 32rpx;
		color: #999;
		line-height: 104rpx;
	}

	.menu-item .next {
		width: 40rpx;
		height: 40rpx;
	}

	.menu-item button {
		margin: 0;
	}

	.space {
		width: 100vw;
		height: 2rpx;
		background: #F4F5F9;
	}

	.line {
		width: 718px;
		height: 1px;
		background: #EEEEEE;
		margin-left: 32rpx;
	}


	.login-box .logo {
		width: 200rpx;
		margin: 64rpx 275rpx;
	}

	.login-box .line {
		height: 2rpx;
		width: 686rpx;
		background-color: #ebedf0;
		margin: 0 32rpx;
	}

	.login-box .title {
		margin: 64rpx 0 0 32rpx;
		color: #333;
		font-size: 36rpx;
	}

	.login-box .profile {
		margin: 32rpx 0 0 32rpx;
		color: #999;
		font-size: 28rpx;
	}

	.login-box .btn {
		margin: 88rpx 32rpx;
	}

	.grid_item {
		padding: 24rpx 0;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;

		.txt {
			margin-top: 16rpx;
			font-size: 26rpx;
			color: #333;
		}
	}
	.btn-block {
		padding: 32rpx;
	}
	.submit {
		padding: 32rpx;
	}
</style>
