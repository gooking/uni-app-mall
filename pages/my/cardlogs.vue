<template>
	<view>
		<u-cell v-for="(item,index) in cardMyLogs" :title="item.typeStr" :label="item.dateAdd" :value="item.amount + '(余额:' + item.balance + ')'"></u-cell>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cardMyLogs: undefined,
				cardid: undefined
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			this.cardid = e.cardid
			this._cardMyLogs()
		},
		onShow() {

		},
		methods: {
			async _cardMyLogs() {
				const res = await this.$wxapi.cardMyLogs({
				  token: this.token,
				  cardId: this.cardid
				})
				if (res.code == 0) {
					this.cardMyLogs = res.data.result
				}
			}
		}
	}
</script>
<style scoped lang="scss">

</style>