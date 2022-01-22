<template>
	<view>
		<u-sticky bgColor="#ffffff">
			<u-tabs lineColor="#e64340" :list="tabs" :current="current" @change="tabchange"></u-tabs>
		</u-sticky>
		<page-box-empty v-if="!coupons || coupons.length == 0" title="暂无优惠券" sub-title="可以去看看可领取优惠券哦～"
			:show-btn="false" />
		<view v-if="current == 0" class="coupons" v-for="(item,index) in coupons" :key="index">
			<image class="icon" src="/static/images/coupons-active.svg"></image>
			<view class="profile">
				<view class="name">
					<view class="t">代金券</view>
					<view class="n">{{item.name}}</view>
				</view>
				<view class="price">
					<view class="tj">满{{item.moneyHreshold}}</view>
					<view v-if="item.moneyType == 0" class="amount"><text>￥</text>{{item.moneyMin}}</view>
					<view v-if="item.moneyType == 1" class="amount"><text></text>{{item.moneyMin}}<text>%</text></view>
				</view>
				<view class="btn" @click="getCounpon(item)">立即领取</view>
			</view>
		</view>
		<view v-if="current == 1" class="coupons" v-for="(item,index) in coupons" :key="index">
			<image class="icon" src="/static/images/coupons-active.svg"></image>
			<view class="profile">
				<view class="name">
					<view class="t">代金券</view>
					<view class="n">{{item.name}}</view>
				</view>
				<view class="price">
					<view class="tj">({{item.dateEnd}}到期) 满{{item.moneyHreshold}}</view>
					<view v-if="item.moneyType == 0" class="amount"><text>￥</text>{{item.money}}</view>
					<view v-if="item.moneyType == 1" class="amount"><text></text>{{item.money}}<text>%</text></view>
				</view>
				<view class="btn" @click="goIndex">立即使用</view>
			</view>
		</view>
		<view v-if="current == 2" class="coupons" v-for="(item,index) in coupons" :key="index">
			<image class="icon" src="/static/images/coupons-off.svg"></image>
			<view class="profile">
				<view class="name">
					<view class="t disabled1">代金券</view>
					<view class="n disabled2">{{item.name}}</view>
				</view>
				<view class="price">
					<view class="tj disabled2">满{{item.moneyHreshold}}</view>
					<view v-if="item.moneyType == 0" class="amount disabled2"><text
							class="disabled2">￥</text>{{item.money}}</view>
					<view v-if="item.moneyType == 1" class="amount disabled2"><text
							class="disabled2"></text>{{item.money}}<text class="disabled2">%</text></view>
				</view>
				<view class="btn">{{ item.statusStr }}</view>
			</view>
		</view>
		<u-modal :show="couponPwdShow" :closeOnClickOverlay="true" title="请输入口令" @confirm="getCounpon(curItem, couponPwd)" @close="couponPwdShow = false">
			<u--input placeholder="请输入优惠券口令" v-model="couponPwd"></u--input>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: [{
						name: '可领',
						status: '-1'
					},
					{
						name: '可用',
						status: '0'
					},
					{
						name: '失效',
						status: '2'
					},
				],
				current: 1,
				coupons: undefined,
				curItem: undefined,
				couponPwdShow: false,
				couponPwd: undefined
			}
		},
		created() {

		},
		mounted() {

		},
		onReady() {

		},
		onLoad(e) {
			this._myCoupons(0)
		},
		onShow() {

		},
		methods: {
			tabchange(e) {
				this.current = e.index
				if (this.current == 0) {
					this._coupons()
				}
				if (this.current == 1) {
					this._myCoupons(0)
				}
				if (this.current == 2) {
					this._myCoupons('1,2,3')
				}
			},
			async _coupons() {
				this.coupons = null
				const res = await this.$wxapi.coupons()
				if (res.code == 0) {
					this.coupons = res.data
				}
			},
			async _myCoupons(status) {
				this.coupons = null
				const res = await this.$wxapi.myCoupons({
					token: this.token,
					status
				})
				if (res.code == 0) {
					res.data.forEach(ele => {
						if (ele.dateEnd) {
							ele.dateEnd = ele.dateEnd.split(" ")[0]
						}
					})
					this.coupons = res.data
				}
			},
			async getCounpon(item, pwd) {
				this.curItem = item
				this.couponPwdShow = false
				if (item.pwd && !pwd) {
					this.couponPwdShow = true
					this.couponPwd = ''
					return
				}
				// https://www.yuque.com/apifm/nu0f75/dhxcpu
				const res = await this.$wxapi.fetchCoupons({
					id: item.id,
					token: this.token,
					pwd: this.couponPwd ? this.couponPwd : ''
				})
				if (res.code == 700) {
					if(pwd) {
						uni.showToast({
							title: '口令输入有误',
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: '优惠券不存在',
							icon: 'none'
						})
					}
					return;
				}
				if (res.code == 20001 || res.code == 20002) {
					uni.showModal({
						title: '错误',
						content: '来晚了',
						showCancel: false
					})
					return;
				}
				if (res.code == 20003) {
					uni.showModal({
						title: '错误',
						content: '你领过了，别贪心哦~',
						showCancel: false
					})
					return;
				}
				if (res.code == 30001) {
					uni.showModal({
						title: '错误',
						content: '您的积分不足',
						showCancel: false
					})
					return;
				}
				if (res.code == 20004) {
					uni.showModal({
						title: '错误',
						content: '已过期~',
						showCancel: false
					})
					return;
				}
				if (res.code == 0) {
					uni.showToast({
						title: '领取成功',
						icon: 'success'
					})
				} else {
					uni.showModal({
						title: '错误',
						content: res.msg,
						showCancel: false
					})
				}
			},
			goIndex() {
				uni.switchTab({
					url: '../index/index'
				})
			}
		}
	}
</script>
<style scoped lang="scss">
	.coupons {
		display: flex;
		justify-content: space-between;
		margin-top: 24rpx;
		margin-left: 24rpx;
		width: 702rpx;
		height: 258rpx;
		background-color: #FFFFFF;
		box-shadow: 0 0 16rpx 0 rgba(36, 44, 69, 0.20);
		border-radius: 8rpx;
	}

	.coupons .icon {
		margin-left: 64rpx;
		margin-top: 44rpx;
		width: 160rpx;
		height: 144rpx;
	}

	.coupons .profile {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.coupons .profile .name {
		display: flex;
		margin-top: 32rpx;
	}

	.coupons .profile .name .t {
		width: 80rpx;
		height: 30rpx;
		background: #FEB21C;
		border-radius: 4rpx;

		font-family: PingFangSC-Medium;
		font-size: 20rpx;
		color: #FFFFFF;
		letter-spacing: 0;
		line-height: 30rpx;
		text-align: center;
	}

	.coupons .profile .name .n {
		margin-left: 16rpx;
		margin-right: 24rpx;
		font-family: PingFangSC-Medium;
		font-size: 30rpx;
		color: #333333;
		letter-spacing: 0;
		line-height: 30rpx;
	}

	.coupons .profile .price {
		display: flex;
		align-items: baseline;
		margin-top: 24rpx;
	}

	.coupons .profile .price .tj {
		font-family: PingFangSC-Regular;
		font-size: 20rpx;
		color: #999999;
		letter-spacing: 0;
		line-height: 20rpx;
	}

	.coupons .profile .price .amount {
		font-family: PingFangSC-Medium;
		font-size: 56rpx;
		color: #FEB21C;
		letter-spacing: 0;
		line-height: 56rpx;
		margin-right: 24rpx;
	}

	.coupons .profile .price .amount text {
		margin-left: 16rpx;
		font-family: PingFangSC-Regular;
		font-size: 20rpx;
		color: #FEB21C;
		letter-spacing: 0;
		line-height: 20rpx;
	}

	.disabled1 {
		background: #999999 !important;
		color: #FFFFFF !important;
	}

	.disabled2 {
		color: #999999 !important;
	}

	.coupons .profile .btn {
		margin-top: 24rpx;
		width: 182rpx;
		height: 60rpx;
		text-align: center;

		background: #FFFFFF;
		border: 2rpx solid #979797;
		border-right: none;
		border-radius: 200rpx 2rpx 2rpx 200rpx;

		font-family: PingFangSC-Regular;
		font-size: 24rpx;
		color: #999999;
		letter-spacing: 0;
		line-height: 60rpx;
	}



	.bottom {
		width: 100vw;
		height: 24rpx;
	}


	.pwd-coupons-mask {
		position: fixed;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		top: 0;
		left: 0;
	}

	.pwd-coupons {
		position: fixed;
		top: 300rpx;
		left: 100rpx;
		width: 550rpx;
		background: #fff;
		border-radius: 12rpx;
	}

	.pwd-coupons .t {
		margin-top: 32rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
	}

	.pwd-coupons .input {
		margin: 32rpx;
		border: 1rpx solid #666;
		border-radius: 8rpx;
		height: 88rpx;
		line-height: 88rpx;
	}

	.pwd-coupons button {
		margin: 32rpx;
	}

	.koulingcoupon {
		margin-top: 32rpx;
	}

	.block-btn {
		margin: 32rpx 0;
	}

	.hecheng {
		margin-top: 16rpx;
	}
</style>
