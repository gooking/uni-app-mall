<template>
	<view class="app-start">
		<u-swiper
			:list="banners"
			keyName="picUrl"
			:autoplay="false"
			height="100vh"
			@change="swiperchange"
			@click="imgClick"
		></u-swiper>
		<view class="btn">
			<u-button v-if="swiperCurrent + 1 == swiperMaxNumber" type="success" text="进入店铺" @click="goNextPage"></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				banners: [],
				swiperMaxNumber: 0,
				swiperCurrent: 0
			}
		},
		created() {

		},
		mounted() {

		},
		onReady() {

		},
		onLoad(e) {
			const app_show_pic_version = this.app_show_pic_version
			if (app_show_pic_version && app_show_pic_version == getApp().globalData.version) {
				this.goNextPage()
			} else {
				console.log(4);
				// 显示启动图轮播
				this.showBanners()
			}
		},
		onShow() {

		},
		methods: {
			goNextPage() {
				const shopMod = this.sysconfigMap.shopMod
				this.$u.vuex('app_show_pic_version', getApp().globalData.version)
				if (shopMod == 1) {
					uni.redirectTo({
						url: '/pages/shop/select',
					});
				} else {
					uni.switchTab({
						url: '/pages/index/index',
					});
				}
			},
			async showBanners() {
				// https://www.yuque.com/apifm/nu0f75/ms21ki
				const res = await this.$wxapi.banners({
					type: 'app'
				})
				if (res.code == 0) {
					this.banners = res.data
					this.swiperMaxNumber = res.data.length
				} else {
					this.goNextPage()
				}
			},
			swiperchange(e) {
				this.swiperCurrent = e.current
			},
			imgClick(index) {
				if (index + 1 != this.swiperMaxNumber) {
					uni.showToast({
						title: '左滑进入',
						icon: 'none',
					})
				}
			}
		}
	}
</script>
<style scoped lang="scss">
	.app-start {
		.btn {  
		  position: absolute;  
		  left: 0;
		  width: 100vw;
		  padding: 0 32rpx;
		  box-sizing: border-box;
		  bottom: 50rpx;  
		  display: flex;  
		  justify-content: center;
		}
	}
</style>
