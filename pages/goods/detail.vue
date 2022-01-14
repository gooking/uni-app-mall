<template>
	<view class="goods-fav">
		{{ id }}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: undefined
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			this.id = e.id
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

		}
	}
</script>
<style scoped lang="scss">
.goods-fav {
	
}
</style>
