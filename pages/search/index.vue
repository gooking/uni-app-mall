<template>
	<view>
		<u-sticky bgColor="#ffffff">
			<view class="search-box">
				<u-search placeholder="输入关键词搜索" v-model="kw" :showAction="false" @search="search">
				</u-search>
			</view>
		</u-sticky>
		<page-box-empty v-if="!list || list.length == 0" title="暂无记录" sub-title="试着搜一搜你感兴趣的吧～" :show-btn="false" />
		<view class="tags">
			<u-tag v-for="(item,index) in list" :key="index" :text="item" type="success" closable :name="index" @click="tagclick" @close="tagclose"></u-tag>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				kw: '',
				list: undefined
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			this.list = uni.getStorageSync('searchHis')
		},
		onShow() {

		},
		methods: {
			search(v) {
				if (v) {
				  let searchHis = uni.getStorageSync('searchHis')
				  if (!searchHis) {
					searchHis = [v]
				  }
				  if (!searchHis.includes(v)) {
					searchHis.push(v)
				  }
				  uni.setStorageSync('searchHis', searchHis)
				  this.list = searchHis
				}
				uni.navigateTo({
					url: '/pages/goods/list?kw=' + v,
				})
			},
			tagclick(index) {
				uni.navigateTo({
					url: '/pages/goods/list?kw=' + this.list[index],
				})
			},
			tagclose(index) {
				this.list.splice(index, 1)
				uni.setStorageSync('searchHis', this.list)
			}
		}
	}
</script>
<style scoped lang="scss">
.search-box {
	padding: 0 32rpx;
}
.tags {
	display: flex;
	flex-wrap: wrap;
	padding: 32rpx;
}
</style>
