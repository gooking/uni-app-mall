<template>
	<u-popup v-if="show" :show="show" mode="bottom" round="32rpx" :customStyle="{maxHeight: '80vh', overflow: 'scroll'}"
		@close="close">
		<view class="goodsList-pop">
			<u--image showLoading lazyLoad :src="pic" radius="16rpx" width="240rpx" height="240rpx"></u--image>
			<view class="goods-info">
				<u--text class="t" :lines="3" :text="goodsDetail.basicInfo.name"></u--text>
				<view v-if="goodsDetail.basicInfo.numberSells" class="t2">已售:{{ goodsDetail.basicInfo.numberSells }}
				</view>
				<view class="price">
					<view v-if="price"><text>¥</text>{{ price }}</view>
					<view v-if="score">
						<text>￠</text>{{ score }}
					</view>
				</view>
			</view>
		</view>
		<u-line></u-line>
		<view v-for="(item,index) in goodsDetail.properties" :key="item.id" v-if="!item.hidden" class="skuList">
			<view class="t">{{ item.name }}</view>
			<view class="items">
				<view v-for="(item2,index2) in item.childsCurGoods" :key="item2.id" class="item">
					<u-tag :show="!item2.hidden"
						:type="item2.selected ? 'error' : 'info'" :plain="item2.selected ? false : true" :text="item2.name"
						@click="skuSelect(index, index2)"></u-tag>
				</view>
			</view>
		</view>
		<view v-for="(item,index) in goodsAddition" :key="item.id" class="skuList">
			<view class="t">{{ item.name }}</view>
			<view class="items">
				<view v-for="(item2,index2) in item.items" :key="item2.id" class="item">
					<u-tag :type="item2.selected ? 'error' : 'info'" :plain="item2.selected ? false : true" :text="item2.name"
						@click="additionSelect(index, index2)"></u-tag>
				</view>
			</view>
		</view>
		<u-line v-if="goodsAddition || goodsDetail.properties" class="sku-space"></u-line>
		<view class="buy-number">
			<text>购买数量</text>
			<u-number-box v-model="buyNumber" :min="min" :max="max" integer></u-number-box>
		</view>
		<u-line></u-line>
		<view class="btns">
			<!--  #ifdef MP-WEIXIN	|| MP-BAIDU -->
			<view class="icon-btn">
				<u-icon name="chat" size="48rpx"></u-icon>
				<text>客服</text>
			</view>
			<!--  #endif -->
			<view class="icon-btn" @click="goCart">
				<u-icon name="shopping-cart" size="48rpx"></u-icon>
				<text>购物车</text>
				<u-badge type="error" :value="cartNumber" absolute :offset="[-10, -10]"></u-badge>
			</view>
			<view class="icon-btn" @click="addFav">
				<u-icon :name="faved ? 'heart-fill' : 'heart'" size="48rpx"></u-icon>
				<text>收藏</text>
			</view>
			<!-- <view class="btn">
				<u-button text="加入购物车" shape="circle" color="linear-gradient(90deg,#ffd01e, #ff8917, #ffd01e)"></u-button>
			</view> -->
			<!-- <view class="btn">
				<u-button text="立即购买" shape="circle" color="linear-gradient(90deg, #ff6034, #ee0a24, #ff6034)"></u-button>
			</view> -->
			<view class="btn">
				<u-button class="half-l" text="加入购物车" shape="circle" color="linear-gradient(90deg,#ffd01e, #ff8917)"
					@click="addCart">
				</u-button>
			</view>
			<view class="btn">
				<u-button class="half-r" text="立即购买" shape="circle" color="linear-gradient(90deg, #ff6034, #ee0a24)" @click="tobuy">
				</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	const TOOLS = require('@/common/tools')
	export default {
		name: 'goods-pop',
		props: {
			show: {
				type: Boolean,
				default: false
			},
			goodsDetail: {
				type: Object,
				default: null
			},
			skuList: {
				type: Array,
				default: null
			},
		},
		data() {
			return {
				pic: undefined,
				price: undefined,
				score: undefined,
				buyNumber: 1,
				min: 1,
				max: 0,
				propertyChildIds: undefined, // 用户已经选的sku信息数组
				propertyChildNames: undefined,
				goodsAddition: undefined,
				faved: false
			}
		},
		watch: {
			// word(newVal, oldVal) {
			// 	console.log('最新值是：'+newVal,"原来的值是："+ oldVal);
			// },
			goodsDetail: {
				deep: true,
				immediate: true,
				handler(newVal, oldName) {
					this._initData()
				}
			}
		},
		mounted() {

		},
		methods: {
			_initData() {
				if (!this.goodsDetail) {
					return
				}
				this.pic = this.goodsDetail.basicInfo.pic
				this.price = this.goodsDetail.basicInfo.minPrice
				this.score = this.goodsDetail.basicInfo.minScore
				if (!this.goodsDetail.basicInfo.stores) {
					this.min = 0
				} else {
					this.min = 1
				}
				this.max = this.goodsDetail.basicInfo.stores
				if (this.goodsDetail.basicInfo.hasAddition) {
					this._goodsAddition()
				}
				this.goodsAddition = null
				TOOLS.showTabBarBadge()
				this.goodsFavCheck()
			},
			close() {
				this.$emit('close')
			},
			// sku 选择事件
			async skuSelect(index, index2) {
				this.buyNumber = 1
				const p = this.goodsDetail.properties[index]
				const c = p.childsCurGoods[index2]
				// 当前sku往下的所有sku取消选中
				for (let i = index; i < this.goodsDetail.properties.length; i++) {
					const _p = this.goodsDetail.properties[i]
					_p.childsCurGoods.forEach(ele => {
						ele.selected = false
					})
					_p.selectedChild = null
					this.goodsDetail.properties.splice(i, 1, _p)
				}
				// 当前选中
				c.selected = true
				p.selectedChild = c
				p.childsCurGoods.splice(index2, 1, c)
				this.goodsDetail.properties.splice(index, 1, p)
				// 计算已经选中的sku信息
				const propertyChildIds = []
				const propertyChildNames = []
				this.goodsDetail.properties.forEach(ele => {
					if (ele.selectedChild) {
						propertyChildIds.push(ele.id + ':' + ele.selectedChild.id)
						propertyChildNames.push(ele.name + ':' + ele.selectedChild.name)
					}
				})
				this.propertyChildIds = propertyChildIds
				this.propertyChildNames = propertyChildNames
				// 目前条件下可继续匹配的sku
				const skuList = this.goodsDetail.skuList.filter(ele => {
					let ok = true
					propertyChildIds.forEach(a => {
						if (ele.propertyChildIds.indexOf(a) == -1) {
							ok = false
						}
					})
					return ok
				})
				// 设置下面的可选性
				for (let i = index + 1; i < this.goodsDetail.properties.length; i++) {
					const _p = this.goodsDetail.properties[i]
					let a = skuList.findIndex(ele => {
						return ele.propertyChildIds.indexOf(_p.id + ':') != -1
					})
					if (a == -1) {
						_p.hidden = true
					} else {
						_p.hidden = false
					}
					_p.childsCurGoods.forEach(c => {
						a = skuList.findIndex(ele => {
							return ele.propertyChildIds.indexOf(_p.id + ':' + c.id) != -1
						})
						if (a == -1) {
							c.hidden = true
						} else {
							c.hidden = false
						}
					})
					this.goodsDetail.properties.splice(i, 1, _p)
				}
				// 切换sku商品图片
				if (this.goodsDetail.subPics && this.goodsDetail.subPics.length > 0) {
					const _subPic = this.goodsDetail.subPics.find(ele => {
						return ele.optionValueId == c.id
					})
					if (_subPic) {
						this.pic = _subPic.pic
					}
				}
				this.calculateGoodsPrice()
			},
			// 可选配件选择事件
			async additionSelect(index, index2) {
				const p = this.goodsAddition[index]
				const c = p.items[index2]
				if (c.selected) {
					// 该操作为取消选择
					c.selected = false
					p.items.splice(index2, 1, c)
					this.calculateGoodsPrice()
					return
				}
				// 如果是单选，先取消现有选中的
				if (p.type == 0) {
					p.items.forEach(child => {
						child.selected = false
					})
				}
				c.selected = true
				p.items.splice(index2, 1, c)
				this.goodsAddition.splice(index, 1, p)
				this.calculateGoodsPrice()
			},
			async _goodsAddition() {
				// https://www.yuque.com/apifm/nu0f75/lveknt
				const res = await this.$wxapi.goodsAddition(this.goodsDetail.basicInfo.id)
				if (res.code == 0) {
					this.goodsAddition = res.data
				}
			},
			async calculateGoodsPrice() {
				// 计算最终的商品价格
				if (!this.propertyChildIds || !this.goodsDetail.properties || this.propertyChildIds.length != this
					.goodsDetail.properties.length) {
					this.price = this.goodsDetail.basicInfo.minPrice
					this.score = this.goodsDetail.basicInfo.minScore
					if (!this.goodsDetail.basicInfo.stores) {
						this.min = 0
					} else {
						this.min = 1
					}
					this.max = this.goodsDetail.basicInfo.stores
					return
				}
				// 获取价格
				// https://www.yuque.com/apifm/nu0f75/dxvqq2
				const res = await this.$wxapi.goodsPriceV2({
					token: this.token,
					goodsId: this.goodsDetail.basicInfo.id,
					propertyChildIds: this.propertyChildIds.join()
				})
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					return
				}
				this.price = res.data.price
				this.score = res.data.score
				if (!res.data.stores) {
					this.min = 0
				} else {
					this.min = 1
				}
				this.max = res.data.stores
				if (this.goodsAddition) {
					this.goodsAddition.forEach(big => {
						big.items.forEach(small => {
							if (small.selected) {
								this.price = (this.price * 100 + small.price * 100) / 100
							}
						})
					})
				}
			},
			goCart() {
				this.close()
				if(this.goodsDetail.basicInfo.supplyType == 'vop_jd') {
					uni.setStorageSync('cart_tabIndex', 1)
				}
				uni.switchTab({
					url: "/pages/cart/index"
				})
			},
			async goodsFavCheck() {
				const data = {
					token: this.token,
					type: 0,
					goodsId: this.goodsDetail.basicInfo.id
				}
				if(this.goodsDetail.basicInfo.supplyType == 'vop_jd') {
					data.type = 1
					data.goodsId = this.goodsDetail.basicInfo.yyId
				}
				// https://www.yuque.com/apifm/nu0f75/ugf7y9
				const res = await this.$wxapi.goodsFavCheckV2(data)
				if (res.code == 0) {
					this.faved = true
				} else {
					this.faved = false
				}
			},
			async addFav() {
				if(!await getApp().checkHasLoginedH5()) {
					uni.navigateTo({
						url: "/pages/login/login"
					})
					return
				}
				const data = {
					token: this.token,
					type: 0,
					goodsId: this.goodsDetail.basicInfo.id
				}
				if(this.goodsDetail.basicInfo.supplyType == 'vop_jd') {
					data.type = 1
					data.goodsId = this.goodsDetail.basicInfo.yyId
				}
				if (this.faved) {
					// 取消收藏 https://www.yuque.com/apifm/nu0f75/zy4sil
					const res = await this.$wxapi.goodsFavDeleteV2(data)
					if (res.code == 0) {
						this.faved = false
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				} else {
					const extJsonStr = {
						pic: this.goodsDetail.basicInfo.pic,
						goodsName: this.goodsDetail.basicInfo.name,
						supplyType: this.goodsDetail.basicInfo.supplyType
					}
					data.extJsonStr = JSON.stringify(extJsonStr)
					// 加入收藏 https://www.yuque.com/apifm/nu0f75/mr1471
					const res = await this.$wxapi.goodsFavAdd(data)
					if (res.code == 0) {
						this.faved = true
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}
			},
			checkOk() {
				if (this.goodsDetail.properties && (!this.propertyChildIds || this.propertyChildIds.length != this
						.goodsDetail.properties.length)) {
					uni.showToast({
						title: '请选择规格',
						icon: 'none'
					})
					return false
				}
				let additionAllSelect = true
				if (this.goodsAddition && this.goodsAddition.length > 0) {
					this.goodsAddition.forEach(p => {
						if (p.required) {
							const find = p.items.find(c => {
								return c.selected
							})
							if (!find) {
								additionAllSelect = false
							}
						}
					})
				}
				if (!additionAllSelect) {
					uni.showToast({
						title: '请选择规格',
						icon: 'none'
					})
					return false
				}
				return true
			},
			async addCart() {
				if(!await getApp().checkHasLoginedH5()) {
					uni.navigateTo({
						url: "/pages/login/login"
					})
					return
				}
				if (!this.checkOk()) {
					return
				}
				if (this.buyNumber < 1) {
					uni.showToast({
						title: '请选择购买数量',
						icon: 'none'
					})
					return
				}
				const sku = []
				if(this.goodsDetail.properties && this.goodsDetail.properties.length > 0) {
					this.goodsDetail.properties.forEach(ele => {
						sku.push({
							optionId: ele.id,
							optionValueId: ele.selectedChild.id
						})
					})
				}
				const goodsAddition = []
				if(this.goodsAddition && this.goodsAddition.length > 0) {
					this.goodsAddition.forEach(ele => {
						ele.items.forEach(item => {
							if (item.selected) {
								goodsAddition.push({
									id: item.id,
									pid: item.pid
								})
							}
						})
					})
				}
				let res
				if(this.goodsDetail.basicInfo.supplyType == 'vop_jd') {
					// https://www.yuque.com/apifm/nu0f75/yum741
					res = await this.$wxapi.jdvopCartAdd({
						token: this.token,
						goodsId: this.goodsDetail.basicInfo.yyId,
						number: this.buyNumber
					})
				} else {
					// https://www.yuque.com/apifm/nu0f75/et6m6m
					res = await this.$wxapi.shippingCarInfoAddItem(this.token, this.goodsDetail.basicInfo.id, this.buyNumber, sku, goodsAddition)
				}
				if (res.code != 0) {
				  uni.showToast({
					title: res.msg,
					icon: 'none'
				  })
				  return
				}
				this.close()
				uni.showToast({
				  title: '加入购物车'
				})
				TOOLS.showTabBarBadge()
			},
			async tobuy() {
				if(!await getApp().checkHasLoginedH5()) {
					uni.navigateTo({
						url: "/pages/login/login"
					})
					return
				}
				if (!this.checkOk()) {
					return
				}
				if (this.buyNumber < 1) {
					uni.showToast({
						title: '请选择购买数量',
						icon: 'none'
					})
					return
				}
				const sku = []
				if(this.goodsDetail.properties && this.goodsDetail.properties.length > 0) {
					this.goodsDetail.properties.forEach(ele => {
						sku.push({
							optionId: ele.id,
							optionValueId: ele.selectedChild.id,
							optionName: ele.name,
							optionValueName: ele.selectedChild.name,
						})
					})
				}
				const goodsAddition = []
				if(this.goodsAddition && this.goodsAddition.length > 0) {
					this.goodsAddition.forEach(ele => {
						ele.items.forEach(item => {
							if (item.selected) {
								goodsAddition.push({
									id: item.id,
									pid: item.pid,
									name: ele.name,
									pname: item.name,
								})
							}
						})
					})
				}
				let goodsType = 0
				let goodsId = this.goodsDetail.basicInfo.id
				if(this.goodsDetail.basicInfo.supplyType == 'vop_jd') {
					goodsType = 1
					goodsId = this.goodsDetail.basicInfo.yyId
				}
				if(this.goodsDetail.basicInfo.supplyType == 'jdJoycityPoints') {
					goodsType = 2
					goodsId = this.goodsDetail.basicInfo.yyIdStr
				}
				const goodsList = [{
					goodsId,
					goodsName: this.goodsDetail.basicInfo.name,
					number: this.buyNumber,
					pic: this.goodsDetail.basicInfo.pic,
					price: this.goodsDetail.basicInfo.minPrice,
					score: this.goodsDetail.basicInfo.minScore,
					sku, // optionId optionName optionValueId optionValueName
					additions: goodsAddition, // id name pid pname price
					goodsType
				}]
				uni.setStorageSync('goodsList', goodsList)
				uni.navigateTo({
					url: '../pay/order?mod=buy'
				})
			},
		}

	}
</script>
<style scoped lang="scss">
	.goodsList-pop {
		margin-top: 32rpx;
		padding: 0 8rpx;
		display: flex;

		.goods-info {
			flex: 1;
			margin-left: 24rpx;
			position: relative;

			.t {
				font-weight: bold;
				font-size: 28rpx;
			}

			.t2 {
				color: #666;
				font-size: 26rpx;
			}

			.price {
				color: #e64340;
				font-size: 40rpx;
				display: flex;
				align-items: center;

				font {
					font-size: 22rpx;
				}
			}

			.addCar {
				position: absolute;
				right: 24rpx;
				bottom: 16rpx;
			}
		}
	}

	.skuList {
		.t {
			margin: 32rpx 0 0 32rpx;
			color: #333;
			font-size: 28rpx;
			// font-weight: bold;
		}

		.items {
			display: flex;
			flex-wrap: wrap;

			.item {
				margin: 16rpx 0 0 32rpx;
			}
		}
	}

	.sku-space {
		padding-top: 32rpx;
	}

	.buy-number {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx;
		color: #333;
		font-size: 30rpx;
	}

	.btns {
		display: flex;
		padding: 32rpx;

		.icon-btn {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 24rpx;
			color: #333;
			margin-right: 32rpx;
		}

		.btn {
			flex: 1;

			.half-l {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}

			.half-r {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}
		}
	}
</style>
