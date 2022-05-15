<template>
	<view>
		<view class="form-box">
			<u-formref="uForm" label-width="130rpx" :model="form">
				<u-form-item v-if="orderType == 3" label="售后商品" prop="skuId" required @click="goodsPickerShow = true">
					<u-input
						v-model="form.skuName"
						readonly
						placeholder="请选择售后商品"
						border="none"
					></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
					<u-picker v-if="orderDetail && orderDetail.goods" :show="goodsPickerShow" :columns="[orderDetail.goods]" keyName="goodsName" @cancel="goodsPickerShow=false" @confirm="goodsPickerSelect"></u-picker>
				</u-form-item>
				<u-form-item v-if="orderType == 3 && curGoods" label="售后数量" required>
					<u-number-box v-model="form.skuNum" :min="1" :max="curGoodsMaxNumber" integer></u-number-box>
				</u-form-item>
				<u-form-item v-if="orderType == 3" label="外包装" prop="packageDesc" required>
					<u-radio-group v-model="form.packageDesc" placement="row">
						<u-radio :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" label="无包装" name="0">
						</u-radio>
						<u-radio :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" label="包装完整" name="10">
						</u-radio>
						<u-radio :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" label="包装破损" name="20">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item v-if="orderType == 3" v-show="supportAfsTypeList" label="售后类型" prop="type" required>
					<u-radio-group v-model="form.type" placement="row">
						<u-radio v-for="item in supportAfsTypeList" :key="item.code" :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" :label="item.name" :name="item.code">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item v-else-if="orderType == 5" label="售后类型" prop="type" required>
					<u-radio-group v-model="form.type" placement="row" @change="typeChange">
						<u-radio v-for="item in supportAfsTypeList" :key="item" :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" :label="item == 10 ? '退货' : '换货'" :name="item">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item v-else label="售后类型" prop="type" required>
					<u-radio-group v-model="form.type" placement="row">
						<u-radio :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" label="仅退款" :name="0">
						</u-radio>
						<u-radio :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" label="退款退货" :name="1">
						</u-radio>
						<u-radio :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" label="换货" :name="2">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item v-if="orderType == 3 && goodsBackTypes" label="寄回方式" prop="goodsBackType" required>
					<u-radio-group v-model="form.goodsBackType" placement="row">
						<u-radio v-for="item in goodsBackTypes" :key="item.code" :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" :label="item.name" :name="item.code">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-cell v-if="orderSet && orderSet.afterSaleAddress && (form.type == 1 || form.type == 2)" title="寄回地址" required :label="orderSet.afterSaleAddress" value="复制" isLink clickable @click="cp(orderSet.afterSaleAddress)"></u-cell>
				<u-form-item v-if="orderType != 5 && orderType != 3" label="收货情况" prop="logisticsStatus" required>
					<u-radio-group v-model="form.logisticsStatus" placement="row">
						<u-radio :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" label="未收到货" :name="0">
						</u-radio>
						<u-radio :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" label="已收到货" :name="1">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item v-if="orderType == 5" label="售后原因" prop="reason" required>
					<u-radio-group v-model="form.reason" placement="column">
						<u-radio v-for="(item,index) in joycityPointsSearchAfsApplyReasonList" :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" :label="item.applyReasonName" :name="item.applyReasonName"></u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item v-else label="售后原因" prop="reason" required>
					<u-radio-group v-model="form.reason" placement="column">
						<u-radio v-for="(item,index) in reasons" :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" :label="item" :name="item"></u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="备注" prop="remark">
					<u-textarea v-model="form.remark" placeholder="请输入备注信息" ></u-textarea>
				</u-form-item>
				<u-form-item label="拍照上传">
					<u-upload
						uploadText="添加照片"
						:fileList="pics"
						@afterRead="afterReadPic"
						@delete="deletePic"
						multiple
					></u-upload>
				</u-form-item>
			</u-form
		</view>
		<view class="submit">
			<u-button type="success" @click="submit">保存</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderDetail: undefined,
				goodsPickerShow: false, // 商品选择器
				curGoods: undefined, // 申请售后的商品信息
				curGoodsMaxNumber: 0, // 可申请售后的最大商品数量
				rules: {
					type: [{
						type: 'number',
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					logisticsStatus: [{
						type: 'number',
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					reason: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					address: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					skuName: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					goodsBackType: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					packageDesc: [{
						required: true,
						message: '不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				form: {
					type: 0,
					logisticsStatus: 0,
					orderId: undefined,
					reasonId: '',
					reason: undefined,
					remark: '',
					skuId: undefined,
					skuName: undefined,
					skuNum: undefined,
					goodsBackType: undefined,
					packageDesc: '10',
					queryType: '10'
				},
				reasons: [
					"不喜欢/不想要",
					"空包裹",
					"未按约定时间发货",
					"快递/物流一直未送达",
					"货物破损已拒签",
					"退运费",
					"规格尺寸与商品页面描述不符",
					"功能/效果不符",
					"质量问题",
					"少件/漏发",
					"包装/商品破损",
					"发票问题",
				],
				pics: [],
				orderSet: undefined,
				orderType: 0, // 0 普通订单 1 周期订单 2 扫码点餐订单 3 京东vop订单 4 从区管进货 5 京东权益订单
				supportAfsTypeList: undefined,
				joycityPointsSearchAfsApplyReasonList: undefined,
				afsGoodsId: undefined,
				goodsBackTypes: undefined
			};
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(e) {
			this.orderType = uni.getStorageSync('orderType')
			this.supportAfsTypeList = uni.getStorageSync('supportAfsTypeList') // 京东权益订单，支持的售后类型列表 10-退货 20-换货
			this.afsGoodsId = uni.getStorageSync('afsGoodsId') // 京东权益订单，售后的商品编号
			this.form.orderId = e.orderId
			this._orderDetail(e.orderId)
			this._orderSet()
			if(this.orderType == 5) {
				this.form.type = this.supportAfsTypeList[0]
				this._joycityPointsSearchAfsApplyReasonList()
			}
		},
		mounted() {},
		methods: {
			async _orderDetail(orderId) {
				// https://www.yuque.com/apifm/nu0f75/oamel8
				const res = await this.$wxapi.orderDetail(this.token, orderId)
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					uni.navigateBack()
					return
				}
				this.orderDetail = res.data
			},
			async _orderSet() {
				const res = await this.$wxapi.orderSet()
				if(res.code == 0) {
					this.orderSet = res.data
				}
			},
			typeChange(e) {
				this._joycityPointsSearchAfsApplyReasonList()
				this.form.reason = null
			},
			async _joycityPointsSearchAfsApplyReasonList(afsType) {
				const res = await this.$wxapi.joycityPointsSearchAfsApplyReasonList({
					token: this.token,
					afsType: this.form.type,
					orderId: this.form.orderId,
					goodsId: this.afsGoodsId
				})
				if(res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					this.joycityPointsSearchAfsApplyReasonList = null
					return
				}
				this.joycityPointsSearchAfsApplyReasonList = res.data
			},
			// 删除图片
			deletePic(event) {
				this.pics.splice(event.index, 1)
			},
			// 新增图片
			async afterReadPic(event) {
				this.pics = this.pics.concat(event.file)
			},
			submit() {
				if(this.orderType == 5) {
					// 京东权益订单
					const reasonItem = this.joycityPointsSearchAfsApplyReasonList.find(ele => {
						return ele.applyReasonName == this.form.reason
					})
					if(!reasonItem) {
						uni.showToast({
							title: '请选择售后原因',
							icon: 'none'
						})
						return
					}
					this.form.reasonId = reasonItem.applyReasonId
					if(!this.form.remark) {
						uni.showToast({
							title: '备注信息不能为空',
							icon: 'none'
						})
						return
					}
					if(!this.pics || this.pics.length == 0) {
						uni.showToast({
							title: '请拍照并上传照片',
							icon: 'none'
						})
						return
					}
				}
				if(this.orderType == 3) {
					if(!this.curGoods) {
						uni.showToast({
							title: '请选择售后商品',
							icon: 'none'
						})
						return
					}
				}
				this.$refs.uForm.validate().then(res => {
					this._submit()
				}).catch(errors => {
					uni.showToast({
						title: '表单请填写完整',
						icon: 'none'
					})
				})
			},
			async _submit() {
				uni.showLoading({
					title: '',
				})
				// 上传图片
				const pics = []
				if(this.pics && this.pics.length > 0) {
					for (let i = 0; i < this.pics.length; i++) {
						const file = this.pics[i]
						// https://www.yuque.com/apifm/nu0f75/ygvqh6
						const res = await this.$wxapi.uploadFile(this.token, file.url)
						if(res.code != 0) {
							uni.hideLoading()
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
							return
						}
						pics.push(res.data.url)
					}
				}
				// https://www.yuque.com/apifm/nu0f75/dg4ggt
				const res = await this.$wxapi.refundApply({
					token: this.token,
					amount: 0,
					...this.form,
					pic: pics.join()
				})
				uni.hideLoading()
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				} else {
					uni.showToast({
						title: '提交成功，请耐心等待客服处理',
					})
					// 将已售后的订单id保存到storage，订单列表页面特殊处理
					let refundApplyedOrderIds = uni.getStorageSync('refundApplyedOrderIds')
					if(!refundApplyedOrderIds) {
						refundApplyedOrderIds = []
					}
					refundApplyedOrderIds.push(this.form.orderId)
					uni.setStorageSync('refundApplyedOrderIds', refundApplyedOrderIds)
					uni.navigateBack()
				}
			},
			cp(v) {
				uni.setClipboardData({
				    data: v,
				    success: function () {
				        uni.showToast({
				        	title: '已复制'
				        })
				    }
				});
			},
			async goodsPickerSelect(e) {
				const curGoods = e.value[0]
				// 判断该商品可售后的数量
				if(this.orderType == 3) {
					let res = await this.$wxapi.jdvopQueryCanRefundNumber({
						token: this.token,
						jdOrderId: this.orderDetail.orderInfo.orderNumberOuter,
						skuId: curGoods.supplyGoodsId,
						queryType: 10
					})
					if(res.code != 0) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						return
					}
					if(res.data * 1 < 1) {
						uni.showToast({
							title: '当前商品无法申请售后',
							icon: 'none'
						})
						return
					}
					this.form.skuNum = res.data * 1
					this.curGoodsMaxNumber = res.data * 1
					// 查询支持的售后类型
					res = await this.$wxapi.jdvopQueryRefundType({
						token: this.token,
						jdOrderId: this.orderDetail.orderInfo.orderNumberOuter,
						skuId: curGoods.supplyGoodsId,
						queryType: 10
					})
					if(res.code != 0) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						return
					}
					this.supportAfsTypeList = res.data // 退货(10)、换货(20)、维修(30), code : name
					this.form.type = res.data[0].code
					// 查询商品退还方式
					res = await this.$wxapi.jdvopQueryGoodsBackType({
						token: this.token,
						jdOrderId: this.orderDetail.orderInfo.orderNumberOuter,
						skuId: curGoods.supplyGoodsId,
						queryType: 10
					})
					if(res.code != 0) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						return
					}
					this.goodsBackTypes = res.data
					this.form.goodsBackType = res.data[0].code
				}
				this.curGoods = e.value[0]
				this.goodsPickerShow = false
				this.form.skuId = this.curGoods.goodsId
				this.form.skuName = this.curGoods.goodsName
			}
		}
	};
</script>

<style lang="scss" scoped>
	.form-box {
		padding: 0 32rpx;
	}
	.submit {
		padding: 32rpx;
	}
</style>
