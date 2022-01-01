<template>
	<view class="notice-list">
		<u-empty v-if="!noticeList" mode="list" text="暂无公告" marginTop="200rpx" />
		<u-cell v-for="(item,index) in noticeList" :key="index" :title="item.title" :label="item.dateAdd" :url="'/pages/notice/detail?id=' + item.id" clickable isLink></u-cell>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				noticeList: undefined
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			this._noticeList()
		},
		onShow() {

		},
		onShareAppMessage(e) {
			return {
				title: '"' + this.sysconfigMap.mallName + '" ' + this.sysconfigMap.share_profile,
				path: '/pages/notice/list?inviter_id=' + this.uid
			}
		},
		methods: {
			async _noticeList() {
				// https://www.yuque.com/apifm/nu0f75/zanb9r
				const res = await this.$wxapi.noticeList()
				if(res.code == 0) {
					this.noticeList = res.data.dataList
				}
			}
		}
	}
</script>
<style scoped lang="scss">
.notice-list {
	
}
</style>
