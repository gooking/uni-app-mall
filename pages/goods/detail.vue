<template>
	<view v-if="goodsDetail" class="goods-detail">
		<u-swiper class="swiper" :list="goodsDetail.pics" name="pic" :title="true" height="600"></u-swiper>
		<view class="title">
			{{ goodsDetail.basicInfo.name }}
			<text></text>
		</view>
		<view class="title-sub">{{ goodsDetail.basicInfo.name }}</view>
		<view class="amount"><text>Ұ</text>{{ goodsDetail.basicInfo.minPrice }}</view>
		<u-section title="商品介绍" :right="false"></u-section>
		<view class="content">
			<u-parse :html="goodsDetail.content"></u-parse>
		</view>
		<view class="navigation safe-area-inset-bottom">
			<view class="left">
				<view class="item kf">
					<button open-type="contact" :send-message-title="goodsDetail.basicInfo.name" :send-message-img="goodsDetail.basicInfo.pic"
      :send-message-path="'/pages/goods/details?id=' + goodsDetail.basicInfo.id" :show-message-card="true"></button>
					<u-icon name="server-fill" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">客服</view>
				</view>
				<view class="item" @click="fav">
					<u-icon :name="faved ? 'heart-fill' : 'heart'" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">{{ faved ? '取消' : '收藏' }}</view>
				</view>
				<view class="item kf car">
					<button open-type="share"></button>
					<u-icon name="zhuanfa" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">分享</view>
				</view>
			</view>
			<view class="right">
				<view class="cart btn u-line-1" @click="addCart">加入购物车</view>
				<view class="buy btn u-line-1" @click="buy">立即购买</view>
			</view>
		</view>
		
		<u-popup v-model="goodsShow" mode="bottom" border-radius="14" safe-area-inset-bottom closeable>
			<view v-if="selectGoods" class="goodsShow">
				<view class="pic-amount">
					<u-image width="300rpx" height="300rpx" mode="widthFix" :src="selectGoodsPic"></u-image>
					<view class="amount"><text>Ұ</text>{{ selectGoodsPrice }}</view>
				</view>
				<div v-for="(item, index) in selectGoods.properties" :key="item.id">
					<u-section :title="item.name" :right="false"></u-section>
					<view class="tags">
						<u-tag v-for="(item2,index2) in item.childsCurGoods" :key="item2.id"
							:class="item2.hidden ? 'item hidden' : 'item'" :text="item2.name" mode="plain"
							:type="item2.active ? 'success' : 'info'" @click="skuclick(index, index2)" />
					</view>
				</div>
				<div v-for="(item, index) in selectGoodsAddition" :key="item.id">
					<u-section :title="item.name" :right="false"></u-section>
					<view class="tags">
						<u-tag v-for="(item2,index2) in item.items" :key="item2.id" class="item" :text="item2.name"
							mode="plain" :type="item2.active ? 'success' : 'info'"
							@click="additionclick(index, index2)" />
					</view>
				</div>
				<u-section title="购买数量">
					<u-number-box slot="right" class="bjq" v-model="buyNumber" :min="buyNumMin" :max="buyNumMax">
					</u-number-box>
				</u-section>
				<u-button v-if="action == 'cart'" class="submit" type="success" :disabled="buyNumber == 0 ? true : false" @click="addCart2">加入购物车</u-button>
				<u-button v-if="action == 'buy'" class="submit" type="error" :disabled="buyNumber == 0 ? true : false" @click="buy2">立即购买</u-button>
			</view>
		</u-popup>
	</view>
</template>



<script>
	export default {
		data() {
			return {
				goodsDetail: undefined,
				faved: false,
				goodsShow: false,
				selectGoods: undefined,
				selectGoodsPic: undefined,
				selectGoodsPrice: undefined,
				selectGoodsCanSubmit: false,
				selectGoodsPropertyChildIds: undefined,
				selectGoodsPropertyChildNames: undefined,
				selectGoodsAddition: undefined,
				buyNumber: 1,
				buyNumMin: 0,
				buyNumMax: 1,
				action: 'cart',
			}
		},
		onLoad(e) {
			this._goodsDetail(e.id)
		},
		onShow() {

		},
		onShareAppMessage(e) {
			return {
			  title: this.goodsDetail.basicInfo.name,
			  path: '/pages/goods/details?id=' + this.goodsDetail.basicInfo.id
			}
		},
		created() {

		},
		methods: {
			async _goodsDetail(goodsId) {
				// https://www.yuque.com/apifm/nu0f75/vuml8a
				const res = await this.$wxapi.goodsDetail(goodsId, this.token)
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					uni.navigateBack()
					return
				}
				this.goodsDetail = res.data
				// 检测是否收藏
				const res2 = await this.$api.goodsFavCheck(this.token, res.data.basicInfo.id)
				this.faved = res2.code == 0 ? true : false
			},
			async addCart() {
				if (this.goodsDetail.basicInfo.propertyIds || this.goodsDetail.basicInfo.hasAddition) {
					// 需要选择sku
					this.selectGoods = this.goodsDetail
					this.selectGoodsPic = this.goodsDetail.basicInfo.pic
					this.selectGoodsPrice = this.goodsDetail.basicInfo.minPrice
					if (this.goodsDetail.basicInfo.hasAddition) {
						// 获取可选配件
						this.goodsAddition()
					}
					this.action = 'cart'
					this.goodsShow = true
				} else {
					// 直接加入购物车
					const res = await this.$api.shippingCarInfoAddItem(this.token, this.goodsDetail.basicInfo.id, 1)
					if (res.code != 0) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						return
					}
					uni.showToast({
						title: '已加入购物车'
					})
				}
			},
			async addCart2() {
				const goodsAddition = []
				if (this.selectGoods.basicInfo.hasAddition) {
					let canSubmit = true
					this.selectGoodsAddition.forEach(ele => {
						if (ele.required) {
							const a = ele.items.find(item => {
								return item.active
							})
							if (!a) {
								canSubmit = false
							}
						}
						ele.items.forEach(item => {
							if (item.active) {
								goodsAddition.push({
									id: item.id,
									pid: item.pid
								})
							}
						})
					})
					if (!canSubmit) {
						uni.showToast({
							title: '请选择配件',
							icon: 'none'
						})
						return
					}
				}
				if (this.buyNumber < 1) {
					uni.showToast({
						title: '请选择购买数量',
						icon: 'none'
					})
					return
				}
				const sku = []
				if (this.selectGoods.properties) {
					this.selectGoods.properties.forEach(p => {
						sku.push({
							optionId: p.id,
							optionValueId: p.optionValueId
						})
					})
				}
				const res = await this.$api.shippingCarInfoAddItem(this.token, this.selectGoods.basicInfo.id, this.buyNumber, sku, goodsAddition)
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					return
				}
				this.goodsShow = false
				uni.showToast({
					title: '加入购物车',
					icon: 'success'
				})
			},
			async skuclick(index1, index2) {
				const property = this.selectGoods.properties[index1]
				const child = property.childsCurGoods[index2]
				// 当前位置往下的所有sku取消选中状态
				for (let index = index1; index < this.selectGoods.properties.length; index++) {
					const element = this.selectGoods.properties[index]
					element.optionValueId = null
					element.optionValueName = null
					element.childsCurGoods.forEach(child => {
						child.active = false
					})
				}
				// 设置当前选中状态，或者取消选中
				property.optionValueId = child.id
				property.optionValueName = child.name
				child.active = true
				// 获取所有的选中规格尺寸数据
				const needSelectNum = this.selectGoods.properties.length
				let curSelectNum = 0;
				let propertyChildIds = "";
				let propertyChildNames = "";
				let _skuList = this.selectGoods.skuList

				this.selectGoods.properties.forEach(p => {
					p.childsCurGoods.forEach(c => {
						// 处理当前选中的sku信息
						if (c.active) {
							_skuList = _skuList.filter(aaa => {
								return aaa.propertyChildIds.indexOf(p.id + ':' + c.id) != -1
							})
							curSelectNum++;
							propertyChildIds = propertyChildIds + p.id + ":" + c.id + ",";
							propertyChildNames = propertyChildNames + p.name + ":" + c.name + "  ";
						} else if (!p.optionValueId) {
							const nextO = _skuList.find(aaa => {
								return aaa.propertyChildIds.indexOf(p.id + ':' + c.id) != -1
							})
							c.hidden = nextO ? false : true
						}
					})
				})
				this.selectGoodsCanSubmit = false;
				if (needSelectNum == curSelectNum) {
					this.selectGoodsCanSubmit = true;
				}
				if (this.selectGoods.subPics && this.selectGoods.subPics.length > 0) {
					const _subPic = this.selectGoods.subPics.find(ele => {
						return ele.optionValueId == child.id
					})
					if (_subPic) {
						this.selectGoodsPic = _subPic.pic
					}
				}
				this.selectGoodsPropertyChildIds = propertyChildIds
				this.selectGoodsPropertyChildNames = propertyChildNames
				this.$forceUpdate()
				this.calculateGoodsPrice()
			},
			async additionclick(index1, index2) {
				const property = this.selectGoodsAddition[index1]
				const child = property.items[index2]
				if (child.active) {
					// 该操作为取消选择
					child.active = false
					this.selectGoodsAddition.splice(index1, 1, property)
					this.calculateGoodsPrice()
					return
				}
				// 单选配件取消所有子栏目选中状态
				if (property.type == 0) {
					property.items.forEach(child => {
						child.active = false
					})
				}
				// 设置当前选中状态
				child.active = true
				this.selectGoodsAddition.splice(index1, 1, property)
				this.calculateGoodsPrice()
			},
			async calculateGoodsPrice() {
				// 计算最终的商品价格
				let price = this.selectGoods.basicInfo.minPrice
				let originalPrice = this.selectGoods.basicInfo.originalPrice
				let totalScoreToPay = this.selectGoods.basicInfo.minScore
				let buyNumMax = this.selectGoods.basicInfo.stores
				let buyNumber = this.selectGoods.basicInfo.minBuyNumber
				// if (this.data.shopType == 'toPingtuan') {
				// 	price = this.selectGoods.basicInfo.pingtuanPrice
				// }
				// 计算 sku 价格
				if (this.selectGoodsCanSubmit) {
					const res = await this.$api.goodsPriceV2({
						token: this.token,
						goodsId: this.selectGoods.basicInfo.id,
						propertyChildIds: this.selectGoodsPropertyChildIds
					})
					if (res.code == 0) {
						price = res.data.price
						// if (this.data.shopType == 'toPingtuan') {
						// 	price = res.data.pingtuanPrice
						// }
						originalPrice = res.data.originalPrice
						totalScoreToPay = res.data.score
						buyNumMax = res.data.stores
					}
				}
				// 计算配件价格
				if (this.selectGoodsAddition) {
					this.selectGoodsAddition.forEach(big => {
						big.items.forEach(small => {
							if (small.active) {
								price = (price * 100 + small.price * 100) / 100
							}
						})
					})
				}
				this.selectGoodsPrice = price // originalPrice totalScoreToPay
				this.buyNumMax = buyNumMax
				this.buyNumber = (buyNumMax > buyNumber) ? buyNumber : 0
			},
			async goodsAddition() {
				const res = await this.$api.goodsAddition(this.selectGoods.basicInfo.id)
				if (res.code == 0) {
					this.selectGoodsAddition = res.data
				}
			},
			async fav() {
				if (this.faved) {
					// 取消收藏
					const res = await this.$api.goodsFavDelete(this.token, '', this.goodsDetail.basicInfo.id)
					if (res.code == 0) {
						uni.showToast({
							title: '取消成功'
						})
						this.faved = false
					}
				} else {
					// 加入收藏
					const res = await this.$api.goodsFavPut(this.token, this.goodsDetail.basicInfo.id)
					if (res.code == 0) {
						uni.showToast({
							title: '收藏成功'
						})
						this.faved = true
					}
				}
			},
			async buy() {
				if (this.goodsDetail.basicInfo.propertyIds || this.goodsDetail.basicInfo.hasAddition) {
					// 需要选择sku
					this.selectGoods = this.goodsDetail
					this.selectGoodsPic = this.goodsDetail.basicInfo.pic
					this.selectGoodsPrice = this.goodsDetail.basicInfo.minPrice
					if (this.goodsDetail.basicInfo.hasAddition) {
						// 获取可选配件
						this.goodsAddition()
					}
					this.action = 'buy'
					this.goodsShow = true
				} else {
					// 直接加入购物车
					const goodsList = [{
						goodsId: this.goodsDetail.basicInfo.id,
						goodsName: this.goodsDetail.basicInfo.name,
						number: 1,
						pic: this.goodsDetail.basicInfo.pic,
						price: this.goodsDetail.basicInfo.minPrice,
						sku: [], // optionId optionName optionValueId optionValueName
						additions: [], // id name pid pname price
					}]
					uni.setStorageSync('goodsList', goodsList)
					uni.navigateTo({
						url: '../to-pay-order/index?mod=buy'
					})
				}
			},
			async buy2() {
				const goodsAddition = []
				if (this.selectGoods.basicInfo.hasAddition) {
					let canSubmit = true
					this.selectGoodsAddition.forEach(ele => {
						if (ele.required) {
							const a = ele.items.find(item => {
								return item.active
							})
							if (!a) {
								canSubmit = false
							}
						}
						ele.items.forEach(item => {
							if (item.active) {
								goodsAddition.push({
									id: item.id,
									name: item.name,
									pid: item.pid,
									pname: ele.name
								})
							}
						})
					})
					if (!canSubmit) {
						uni.showToast({
							title: '请选择配件',
							icon: 'none'
						})
						return
					}
				}
				if (this.buyNumber < 1) {
					uni.showToast({
						title: '请选择购买数量',
						icon: 'none'
					})
					return
				}
				const sku = []
				if (this.selectGoods.properties) {
					this.selectGoods.properties.forEach(p => {
						sku.push({
							optionId: p.id,
							optionValueId: p.optionValueId,
							optionName: p.name,
							optionValueName: p.optionValueName,
						})
					})
				}
				const goodsList = [{
					goodsId: this.goodsDetail.basicInfo.id,
					goodsName: this.goodsDetail.basicInfo.name,
					number: this.buyNumber,
					pic: this.goodsDetail.basicInfo.pic,
					price: this.selectGoodsPrice,
					sku: sku, // optionId optionName optionValueId optionValueName
					additions: goodsAddition, // id name pid pname price
				}]
				console.log(goodsList);
				uni.setStorageSync('goodsList', goodsList)
				uni.navigateTo({
					url: '../to-pay-order/index?mod=buy'
				})
			},
		}
	}
</script>
<style scoped lang="scss">
	.goods-detail {
		padding-bottom: 120rpx;
		.title {
			font-size: 64rpx;
			margin-top: 32rpx;
			margin-left: 20px;
			color: #293539;
			font-weight: 300;
			position: relative;
		
			text {
				width: 7px;
				height: 7px;
				position: absolute;
				border: 2px solid #a78845;
				border-radius: 50%;
			}
		}
		.title-sub {
			margin-left: 25px;
			color: #293539;
			font-size: 36rpx;
			margin-top: 16px;
			font-weight: 300;
		}
		.amount {
			text-align: center;
			font-size: 68rpx;
			color: #a78845;
			margin: 64rpx 0;
			text {
				font-size: 48rpx;
				padding-right: 3px;
			}
		}
		.content {
			margin-top: 32rpx;
		}
		.navigation {
			position: fixed;
			width: 100vw;
			left: 0;
			bottom: 0;
			display: flex;
			margin-top: 100rpx;
			border: solid 2rpx #f2f2f2;
			background-color: #ffffff;
			padding: 16rpx 0;
			.left {
				display: flex;
				font-size: 20rpx;
				.item {
					margin: 0 30rpx;
					&.car {
						text-align: center;
						position: relative;
						.car-num {
							position: absolute;
							top: -10rpx;
							right: -10rpx;
						}
					}
				}
				.kf {
					position: relative;
					button {
					  position: absolute;
					  height: 100%;
					  width: 100%;
					  opacity: 0;
					  z-index: 99;
					}
				}
			}
			.right {
				display: flex;
				font-size: 28rpx;
				align-items: center;
				.btn {
					line-height: 66rpx;
					padding: 0 30rpx;
					border-radius: 36rpx;
					color: #ffffff;
				}
				.cart {
					background-color: #ed3f14;
					margin-right: 30rpx;
				}
				.buy {
					background-color: #ff7900;
				}
			}
		}
		.goodsShow {
			.pic-amount {
				display: flex;
				align-items: center;
		
				.amount {
					margin-left: 64rpx;
					font-size: 68rpx;
					color: #a78845;
		
					text {
						font-size: 48rpx;
						padding-right: 3px;
					}
				}
			}
		
			padding: 32rpx;
		
			.tags {
				margin-top: 32rpx;
				padding-bottom: 48rpx;
		
				.item {
					margin: 8rpx 4rpx;
				}
		
				.hidden {
					display: none;
				}
			}
		
			.submit {
				margin-top: 32rpx;
			}
		}
	}
</style>
