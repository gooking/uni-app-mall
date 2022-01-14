<template>
	<view class="to-pay-order">
		<u-section class="shop-section" title="配送地址" :right="false"></u-section>
		<u-cell-item v-if="!defaultAddress" icon="map" title="新增收货地址" @click="addAddress"></u-cell-item>
		<u-cell-item v-else icon="map" :title="defaultAddress.info.linkMan + ' ' + defaultAddress.info.mobile" :label="defaultAddress.info.provinceStr + defaultAddress.info.cityStr + defaultAddress.info.areaStr + defaultAddress.info.address" @click="selAddress"></u-cell-item>
		<u-section class="shop-section" title="商品信息" :right="false"></u-section>
		<view class="order">
			<view class="item" v-for="(item, index) in goodsList" :key="'a' + index">
				<view class="left"><image :src="item.pic" mode="aspectFill"></image></view>
				<view class="content">
					<view class="title u-line-2">{{ item.goodsName }}</view>
					<view class="type">
						<text v-for="(item2, index2) in item.sku" :key="'b' + index2">{{ item2.optionName }}:{{ item2.optionValueName }}/</text>
						<text v-for="(item3, index3) in item.additions" :key="'c' + index3">{{ item3.pname }}:{{ item3.name }}/</text>
					</view>
				</view>
				<view class="right">
					<view class="price">
						￥{{ item.price }}
					</view>
					<view class="number">x{{ item.number }}</view>
				</view>
			</view>
			<view class="total">
				共 {{ goodsNumber }} 件商品 合计:
				<text class="total-price">
					￥{{ goodsPrice }}
				</text>
			</view>
		</view>
		<u-section class="shop-section" title="订单备注" :right="false"></u-section>
		<view class="remark">
			<u-input v-model="remark" type="textarea" :auto-height="true" clearable placeholder="订单备注(选填)" />
		</view>
		<template v-if="orderInfo">
			<u-section class="shop-section" title="合计" :right="false"></u-section>
			<u-cell-item title="商品金额" :value="'¥' + orderInfo.amountTotle" :arrow="false"></u-cell-item>
			<u-cell-item title="配送费" :value="'¥' + orderInfo.amountLogistics" :arrow="false"></u-cell-item>
			<u-cell-item title="总计" :value="'¥' + orderInfo.amountReal" :arrow="false"></u-cell-item>
		</template>
		<template v-if="userAmount">
			<u-section class="shop-section" title="当前余额" :right="false"></u-section>
			<u-cell-item title="可用余额" :value="'¥' + userAmount.balance" :arrow="false"></u-cell-item>
		</template>
		<view class="submit safe-area-inset-bottom">
			<u-button type="success" @click="submit" :disabled="!canSubmit">提交订单</u-button>
		</view>
	</view>
</template>

<script>
const wxpay = require('@/common/wxpay.js')
export default {
	data() {
		return {
			mod: undefined,
			defaultAddress: undefined,
			goodsList: undefined,
			goodsNumber: 0,
			goodsPrice: 0,
			remark: '',
			canSubmit: false,
			orderInfo: undefined,
			userAmount: undefined,
		};
	},
	onLoad(e) {
		this.mod = e.mod
		if(e.mod == 'cart') {
			this.readCart()
		}
		if(e.mod == 'buy') {
			this.goodsList = uni.getStorageSync('goodsList')
			this.goodsList.forEach(ele => {
				this.goodsNumber += ele.number
				this.goodsPrice += ele.price
			})
			this.calculatePrice()
		}
		this._userAmount()
	},
	onShow() {
		this._defaultAddress()
	},
	methods: {
		addAddress() {
			uni.navigateTo({
				url: '../address/addSite'
			})
		},
		selAddress() {
			uni.navigateTo({
				url: '../address/index'
			})
		},
		async _defaultAddress() {
			const res = await this.$api.defaultAddress(this.token)
			if(res.code == 0) {
				this.defaultAddress = res.data
				this.calculatePrice()
			}
		},
		async _userAmount() {
			const res = await this.$api.userAmount(this.token)
			if(res.code == 0) {
				this.userAmount = res.data
			}
		},
		async readCart() {
			const res = await this.$api.shippingCarInfo(this.token)
			if(res.code == 0) {
				this.goodsList = []
				// .filter(ele => { return ele.selected })
				res.data.items.forEach(ele => {
					this.goodsList.push({
						key: ele.key,
						goodsId: ele.goodsId,
						goodsName: ele.name,
						number: ele.number,
						pic: ele.pic,
						price: ele.price,
						sku: ele.sku, // optionId optionName optionValueId optionValueName
						additions: ele.additions, // id name pid pname price
					})
				})
				this.goodsNumber = res.data.number
				this.goodsPrice = res.data.price
				this.calculatePrice()
			}
		},
		buildOrderParams(calculate) {
			const goodsJsonStr = []
			this.goodsList.forEach(g => {
				let propertyChildIds = ''
				if(g.sku && g.sku.length > 0) {
					g.sku.forEach(option => {
					  propertyChildIds = propertyChildIds + ',' + option.optionId + ':' + option.optionValueId
					})
				}
				let goodsAdditionList = []
				if (g.additions && g.additions.length > 0) {
					g.additions.forEach(option => {
					  goodsAdditionList.push({
						pid: option.pid,
						id: option.id
					  })
					})
				  }
				goodsJsonStr.push({
					goodsId: g.goodsId,
					number: g.number,
					number: g.number,
					propertyChildIds,
					goodsAdditionList
				})
			})
			const data = {
				token: this.token,
				goodsJsonStr: JSON.stringify(goodsJsonStr),
				remark: this.remark,
				calculate,
				goodsType: 0,
			}
			if(this.defaultAddress) {
				data.provinceId = this.defaultAddress.info.provinceId
				data.cityId = this.defaultAddress.info.cityId
				data.districtId = this.defaultAddress.info.districtId
				data.address = this.defaultAddress.info.address
				data.linkMan = this.defaultAddress.info.linkMan
				data.mobile = this.defaultAddress.info.mobile				
			}
			return data
		},
		async calculatePrice() {
			this.canSubmit = false
			if(!this.goodsList || this.goodsList.length == 0) {
				return
			}
			const res = await this.$api.orderCreate(this.buildOrderParams(true))
			if(res.code == 0) {
				this.canSubmit = true
				this.orderInfo = res.data
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}
		},
		async submit() {
			this.canSubmit = false
			if(!this.goodsList || this.goodsList.length == 0) {
				return
			}
			const res = await this.$api.orderCreate(this.buildOrderParams(false))
			if(res.code == 0) {
				uni.showToast({
					title: '下单成功'
				})
				if(this.mod == 'cart') {
					const keys = []
					this.goodsList.forEach(ele => {
						keys.push(ele.key)
					})
					await this.$api.shippingCarInfoRemoveItem(this.token, keys.join())
				}
				this.pay(res.data)
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}
		},
		async pay(orderInfo) {
			const needPay = (orderInfo.amountReal - this.userAmount.balance).toFixed(2)
			if(needPay <= 0) {
				// 直接调用支付接口
				const res = await this.$api.orderPay(this.token, orderInfo.id)
				if(res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					uni.redirectTo({
						url: "../order/index?status=0"
					})
				} else {
					uni.showToast({
						title: '支付成功'
					})
					uni.redirectTo({
						url: "../order/index?status=1"
					})
				}
			} else {
				// 发起在线支付
				// #ifdef MP-WEIXIN
				wxpay.wxpay('order', needPay, orderInfo.id, '订单列表页面路径')
				// #endif
				// #ifndef MP-WEIXIN
				console.log('跳转到订单列表');
				uni.redirectTo({
					url: "../order/index?status=0"
				})
				// #endif
			}
		},
	}
};
</script>

<style lang="scss" scoped>
.to-pay-order {
	padding-bottom: 100rpx;
	.shop-section {
		margin-top: 32rpx;
	}
}
.order {
	width: 710rpx;
	background-color: #ffffff;
	margin: 20rpx auto;
	border-radius: 20rpx;
	box-sizing: border-box;
	padding: 20rpx;
	font-size: 28rpx;
	.top {
		display: flex;
		justify-content: space-between;
		.left {
			display: flex;
			align-items: center;
			.store {
				margin: 0 10rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
		.right {
			color: $u-warning-dark;
		}
	}
	.item {
		display: flex;
		margin: 20rpx 0 0;
		.left {
			margin-right: 20rpx;
			image {
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
			}
		}
		.content {
			.title {
				font-size: 28rpx;
				line-height: 50rpx;
			}
			.type {
				margin: 10rpx 0;
				font-size: 24rpx;
				color: $u-tips-color;
			}
			.delivery-time {
				color: #e5d001;
				font-size: 24rpx;
			}
		}
		.right {
			margin-left: 10rpx;
			padding-top: 20rpx;
			text-align: right;
			.decimal {
				font-size: 24rpx;
				margin-top: 4rpx;
			}
			.number {
				color: $u-tips-color;
				font-size: 24rpx;
			}
		}
	}
	.total {
		margin-top: 20rpx;
		text-align: right;
		font-size: 24rpx;
		.total-price {
			font-size: 32rpx;
		}
	}
	.bottom {
		display: flex;
		margin-top: 40rpx;
		padding: 0 10rpx;
		justify-content: space-between;
		align-items: center;
		.btn {
			line-height: 52rpx;
			width: 160rpx;
			border-radius: 26rpx;
			border: 2rpx solid $u-border-color;
			font-size: 26rpx;
			text-align: center;
			color: $u-info-dark;
		}
		.evaluate {
			color: $u-warning-dark;
			border-color: $u-warning-dark;
		}
	}
}
.remark {
	padding: 32rpx;
}
.submit {
	position: fixed;
	width: 100vw;
	left: 0;
	bottom: 0;
	z-index: 9;
}
</style>
