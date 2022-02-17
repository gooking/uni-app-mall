<template>
	<view>
		<view class="form-box">
			<u--form ref="uForm" label-width="130rpx" :model="form">
				<u-form-item v-if="orderType == 5" label="售后类型" prop="type" required>
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
				<u-cell v-if="orderSet && orderSet.afterSaleAddress && (form.type == 1 || form.type == 2)" title="寄回地址" required :label="orderSet.afterSaleAddress" value="复制" isLink clickable @click="cp(orderSet.afterSaleAddress)"></u-cell>
				<u-form-item v-if="orderType != 5" label="收货情况" prop="logisticsStatus" required>
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
					<u--textarea v-model="form.remark" placeholder="请输入备注信息" ></u--textarea>
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
			</u--form>
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
				},
				form: {
					type: 0,
					logisticsStatus: 0,
					orderId: undefined,
					reasonId: undefined,
					reason: undefined,
					remark: undefined,
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
				afsGoodsId: undefined
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
			this._orderSet()
			if(this.orderType == 5) {
				this.form.type = this.supportAfsTypeList[0]
				this._joycityPointsSearchAfsApplyReasonList()
			}
		},
		mounted() {},
		methods: {
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
