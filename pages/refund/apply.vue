<template>
	<view>
		<view class="form-box">
			<u--form ref="uForm" label-width="130rpx" :model="form">
				<u-form-item label="售后类型" prop="type" required>
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
				<u-form-item label="收货情况" prop="logisticsStatus" required>
					<u-radio-group v-model="form.logisticsStatus" placement="row">
						<u-radio :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" label="未收到货" :name="0">
						</u-radio>
						<u-radio :customStyle="{marginBottom: '8rpx', marginRight: '8rpx'}" label="已收到货" :name="1">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="售后原因" prop="reason" required>
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
				orderSet: undefined
			};
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(e) {
			this.form.orderId = e.orderId
			this.form.reason = this.reasons[0]
			this._orderSet()
		},
		mounted() {},
		methods: {
			async _orderSet() {
				const res = await this.$wxapi.orderSet()
				if(res.code == 0) {
					this.orderSet = res.data
				}
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
