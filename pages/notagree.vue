<template>
	<view class="notagree">
		<view class="title">Oops!</view>
		<view class="profile">
			很遗憾，若您不同意《用户协议》和《隐私协议》，将无法继续使用我们的服务。
		</view>
		<image class="img" width="100%" mode="widthFix" src="https://dcdn.it120.cc/2023/01/03/b68c3363-a598-4e8e-b51a-014dd824c687.png"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			uni.setNavigationBarTitle({
				title: '很抱歉～'
			})
		},
		onShow() {

		},
		methods: {

		}
	}
</script>
<style scoped lang="scss">
.notagree {
	padding: 64rpx;
	.title {
		font-size: 100rpx;
		font-weight: bold;
	}
	.profile {
		margin-top: 64rpx;
		color: #666;
		line-height: 48rpx;
	}
	.img {
		margin-top: 64rpx;
	}
}
</style>
