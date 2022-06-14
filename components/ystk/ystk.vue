<template>
	<view v-if="!agreeYxtk" class="agreement">
		<u-popup :show="popupShow" mode="center" :closeOnClickOverlay="false" round="16rpx">
			<view class="t">用户协议及隐私政策</view>
			<view class="content">
				您在使用我们的服务时，我们可能会收集和
				使用您的相关信息。我们希望通过本
				<text class="link" @click="goYstk('yhxy')">《用户协议》</text>
				及<text class="link" @click="goYstk('ysxy')">《隐私协议》</text>向您说明，在使用我
				们的服务时，我们如何收集、使用、储存和
				分享这些信息，以及我们为您提供的访问、
				更新、控制和保护这些信息的方式。本<text class="link" @click="goYstk('yhxy')">《用户协议》</text>及
				<text class="link" @click="goYstk('ysxy')">《隐私协议》</text>，希望您仔细闭读，
				充分理解协议中的内容后再点击同意。
			</view>
			<view class="btn-group">
				<u-button @click="notagree">不同意</u-button>
				<u-button type="primary" customStyle="margin-top: 32rpx;" @click="aggree">同意并继续</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				categoryList: undefined,
				categoryIdx: 0,
				
				page: 1,
				serverPics: undefined,
				popupShow: true,
				
				items: [],
			}
		},
		props: {
			a: Boolean,
		},
		mounted() {
		},
		methods: {
			notagree() {
				uni.navigateTo({
					url: '/pages/notagree'
				})
			},
			goYstk(key) {
				uni.navigateTo({
					url: '/pages/agreement?key=' + key
				})
			},
			aggree() {
				this.$u.vuex('agreeYxtk', true)
			}
		}
	}
</script>

<style lang="scss" scoped>
.t {
	text-align: center;
	padding: 32rpx;
	font-weight: bold;
}
.content {
	width: 600rpx;
	padding: 32rpx;
	font-size: 32rpx;
	line-height: 54rpx;
}
.link {
	color: #10AEFF;
}
.btn-group {
	padding: 32rpx;
}
.mt32 {
	margin-top: 32rpx;
}
</style>
