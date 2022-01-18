<template>
	<view class="page-box">
		<view>
			<view class="centre">
				<image src="/static/images/no-order.png" mode=""></image>
				<view class="explain">
					{{ title }}
					<view v-if="subTitle" class="tips">{{ subTitle }}</view>
				</view>
				<view v-if="showBtn" class="btn" @click="goIndex">{{ btnName }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'page-box-empty',
		props: {
			title: {
				type: String,
				default: '暂无数据'
			},
			subTitle: {
				type: String,
				default: ''
			},
			btnName: {
				type: String,
				default: '随便逛逛'
			},
			url: {
				type: String,
				default: ''
			},
			showBtn: {
				type: Boolean,
				default: false
			},
		},
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
		methods: {
			goIndex() {
				if(!this.url) {
					uni.switchTab({
						url: "../../pages/index/index"
					})
				} else {
					uni.navigateTo({
						url: this.url
					})
				}
			},
		}
	}
</script>
<style scoped lang="scss">
.page-box {
	.centre {
		text-align: center;
		margin: 200rpx auto;
		font-size: 32rpx;
	
		image {
			width: 164rpx;
			height: 164rpx;
			border-radius: 50%;
			margin-bottom: 20rpx;
		}
	
		.tips {
			font-size: 24rpx;
			color: #999999;
			margin-top: 20rpx;
		}
	
		.btn {
			margin: 80rpx auto;
			width: 200rpx;
			border-radius: 32rpx;
			line-height: 64rpx;
			color: #ffffff;
			font-size: 26rpx;
			background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
		}
	}
}
</style>
