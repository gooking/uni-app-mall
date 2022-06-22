<template>
	<view>
		<page-box-empty v-if="!invoiceList" title="暂无数据" sub-title="前往申请发票～" :show-btn="true" btn-name="申请发票" url="/pages/invoice/apply" />
		<u-cell-group v-for="(item,index) in invoiceList" :key="item.id" :title="item.comName">
			<u-cell title="金额" :value="item.amount"></u-cell>
			<u-cell title="内容" :value="item.consumption"></u-cell>
			<u-cell title="状态">
				<view slot="value">
				  <u-tag v-if="item.status == 0" text="待处理"></u-tag>
				  <u-tag v-if="item.status == 1" type="error" text="不通过"></u-tag>
				  <u-tag v-if="item.status == 2" type="warning" text="开票中"></u-tag>
				  <u-tag v-if="item.status == 3" type="success" text="已开票"></u-tag>
				</view>
			</u-cell>
			<u-cell v-if="item.email" title="邮箱" :value="item.email"></u-cell>
			<u-cell title="申请日期" :value="item.dateAdd"></u-cell>
			<u-cell v-if="item.file" title="查看" value="打开电子发票" isLink @click="download(item.file)"></u-cell>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				invoiceList: undefined
				
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		onReady() {
			
		},
		onLoad(e) {
			this._invoiceList()
		},
		onShow() {

		},
		methods: {
			async _invoiceList() {
				const res = await this.$wxapi.invoiceList({
					token: this.token
				})
				if (res.code == 0) {
					this.invoiceList = res.data.result
				}
			},
			download(file) {
			    const _this = this
			    uni.downloadFile({
			      url: file,
			      success (res) {
			        const tempFilePath = res.tempFilePath
			        console.log(tempFilePath);
			        uni.openDocument({
			          filePath: tempFilePath,
			          showMenu: true,
			          success: function (res) {
			            console.log('打开文档成功')
			          }
			        })
			      }
			    })
			  },
		}
	}
</script>
<style scoped lang="scss">

</style>