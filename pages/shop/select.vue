<template>
	<view>
		<view class="search-box">
			<u-search placeholder="搜索门店" v-model="kw" :showAction="false" @search="search"></u-search>
		</view>
		<u-cell-group v-for="(item,index) in shops" :key="index" class="shop-box">
			<u-cell icon="bag" size="large" :border="false" :clickable="true" :isLink="true" :title="item.name" :value="item.distance + 'km'" @click="goShop(index)"></u-cell>
			<u-cell icon="map" :border="false" :title="item.address"></u-cell>
			<u-cell v-if="item.openingHours" icon="clock" :border="false" :title="item.openingHours"></u-cell>
			<u-cell icon="phone" :border="false" :title="item.linkPhone"></u-cell>
		</u-cell-group>
	</view>
</template>

<script>
	const WXAUTH = require('@/common/wxauth.js')
	export default {
		data() {
			return {
				kw: '',
				latitude: '',
				longitude: '',
				shops: undefined
			}
		},
		created() {

		},
		mounted() {

		},
		onReady() {

		},
		onLoad(e) {
			uni.showLoading({
				
			})
			uni.getLocation({
				type: 'wgs84', //wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
				success: (res) => {
					console.log(res);
					this.latitude = res.latitude
					this.longitude = res.longitude
					this.fetchShops(res.latitude, res.longitude, '')
				},
				fail(e) {
					console.error(e)
					WXAUTH.checkAndAuthorize('scope.userLocation')
				},
				complete: () => {
					uni.hideLoading()
				}
			})
		},
		onShow() {

		},
		onShareAppMessage(e) {
			return {
				title: '',
				path: ''
			}
		},
		methods: {
			async fetchShops(latitude, longitude, kw) {
				uni.showLoading({
					
				})
				// https://www.yuque.com/apifm/nu0f75/vvgeq9
				const res = await this.$wxapi.fetchShops({
					curlatitude: latitude,
					curlongitude: longitude,
					nameLike: kw
				})
				wx.hideLoading()
				if (res.code == 0) {
					res.data.forEach(ele => {
						ele.distance = ele.distance.toFixed(3) // 距离保留3位小数
					})
					this.shops = res.data
				} else {
					this.shops = null
				}
			},
			search(kw) {
				this.fetchShops(this.latitude, this.longitude, kw)
			},
			goShop(idx) {
				uni.setStorageSync('shopInfo', this.shops[idx])
				uni.setStorageSync('shopIds', this.shops[idx].id)
				uni.setStorageSync('refreshIndex', 1)
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>
<style scoped lang="scss">
.search-box {
	padding: 16rpx;
}
.shop-box {
	margin-top: 32rpx;
}
</style>
