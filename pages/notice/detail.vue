<template>
	<view class="notice-detail">
		<u-empty v-if="!noticeDetail" mode="list" text="暂无数据" marginTop="200rpx" />
		<view v-if="noticeDetail">
			<u-cell :title="noticeDetail.title" :label="noticeDetail.dateAdd"></u-cell>
			<u-line class="l"></u-line>
			<view class="content">
				<u-parse :content="noticeDetail.content"></u-parse>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				noticeDetail: undefined
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			this._noticeDetail(e.id)
		},
		onShow() {

		},
		onShareAppMessage(e) {
			return {
				title: '"' + this.sysconfigMap.mallName + '" ' + this.sysconfigMap.share_profile,
				path: '/pages/notice/detail?inviter_id=' + this.uid + '&id=' + this.noticeDetail.id
			}
		},
		methods: {
			async _noticeDetail(id) {
				// https://www.yuque.com/apifm/nu0f75/zanb9r
				const res = await this.$wxapi.noticeDetail(id)
				if(res.code == 0) {
					this.noticeDetail = res.data
				}
			}
		}
	}
</script>
<style scoped lang="scss">
.notice-detail {
	color: #333;
	padding: 32rpx;
	.content {
		padding-top: 16rpx;
		font-size: 28rpx;
		line-height: 64rpx;
	}
}
</style>
