<template>
	<view class="address-list">
		<page-box-empty v-if="!siteList" title="暂无收货记录" sub-title="赶快添加一个收货地址吧～" :show-btn="false" />
		<u-swipe-action
			v-for="(res, index) in siteList" :key="res.id"
			:show="res.show" :index="index"
			:options="options"
			@click="click"
			@open="open"
		>
			<view class="item">
				<view class="top">
					<view class="name">{{ res.linkMan }}</view>
					<view class="phone">{{ res.mobile }}</view>
					<view v-if="res.isDefault" class="tag">
						<text class="red">默认</text>
					</view>
				</view>
				<view class="bottom">
					{{ res.provinceStr }}{{ res.cityStr }}{{ res.areaStr }} {{ res.address }}
					<u-icon name="checkbox-mark" :size="40" color="#19be6b" @click="sel(index)"></u-icon>
				</view>
			</view>
		</u-swipe-action>
		<view class="addSite" @tap="toAddSite(-1)">
			<view class="add">
				<u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>新建收货地址
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			siteList: undefined,
			options: [
				{
					text: '编辑',
					style: {
						backgroundColor: '#19be6b'
					}
				},
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			]
		};
	},
	onLoad() {
		
	},
	onShow() {
		this.getData();
	},
	methods: {
		async getData() {
			const res = await this.$api.queryAddressV2({
				token: this.token
			})
			if(res.code == 0) {
				res.data.result.forEach(ele => {
					ele.show = false
				})
				this.siteList = res.data.result
			} else {
				this.siteList = null
			}
		},
		toAddSite(index){
			const item = index == -1 ? null : this.siteList[index]
			console.log(item);
			uni.navigateTo({
			    url: '/pages/address/addSite?id=' + (item ? item.id : '')
			});
		},
		open(index) {
			this.siteList.forEach(ele => {
				ele.show = false
			})
			this.siteList[index].show = true
		},
		async click(index1, index2) {
			const item = this.siteList[index1]
			if(index2 == 0) {
				// 编辑
				this.toAddSite(index1)
			}
			if(index2 == 1) {
				// 删除
				uni.showModal({
				    title: '请确认',
				    content: '确定要删除吗？',
				    success: res => {
				        if (res.confirm) {
				            this._deleteItem(item)
				        }
				    }
				});
			}
		},
		async _deleteItem(item) {
			const res = await this.$api.deleteAddress(this.token, item.id)
			if(res.code == 0) {
				uni.showToast({
					title: '删除成功'
				})
				this.getData();
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}
		},
		async sel(index) {
			const item = this.siteList[index]
			const res = await this.$api.updateAddress({
				token: this.token,
				id: item.id,
				isDefault: true
			})
			if(res.code == 0) {
				uni.navigateBack()
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}
		},
	}
};
</script>

<style lang="scss" scoped>
	.address-list {
		.empty {
			padding-top: 120rpx;
		}
	}
.item {
	padding: 40rpx 20rpx;
	.top {
		display: flex;
		font-weight: bold;
		font-size: 34rpx;
		.phone {
			margin-left: 60rpx;
		}
		.tag {
			display: flex;
			font-weight: normal;
			align-items: center;
			text {
				display: block;
				width: 60rpx;
				height: 34rpx;
				line-height: 34rpx;
				color: #ffffff;
				font-size: 20rpx;
				border-radius: 6rpx;
				text-align: center;
				margin-left: 30rpx;
				background-color:rgb(49, 145, 253);
			}
			.red{
				background-color:red
			}
		}
	}
	.bottom {
		display: flex;
		margin-top: 20rpx;
		font-size: 28rpx;
		justify-content: space-between;
		color: #999999;
	}
}
.addSite {
	display: flex;
	justify-content: space-around;
	width: 600rpx;
	line-height: 100rpx;
	position: absolute;
	bottom: 30rpx;
	left: 80rpx;
	background-color: red;
	border-radius: 60rpx;
	font-size: 30rpx;
	.add{
		display: flex;
		align-items: center;
		color: #ffffff;
		.icon{
			margin-right: 10rpx;
		}
	}
}
</style>
