<template>
	<view class="wrap">
		<view class="top">
			<!-- #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO -->
			<u-cell title="一键读取小程序收获地址" :isLink="true" @click="chooseAddress"></u-cell>
			<!-- #endif -->
			<u-form ref="uForm" label-width="130rpx" :model="form">
				<u-form-item label="收货人" prop="linkMan" required>
					<u-input v-model="form.linkMan" clearable placeholder="请输入收货人" />
				</u-form-item>
				<u-form-item label="手机号码" prop="mobile" required>
					<u-input v-model="form.mobile" type="number" clearable placeholder="请输入手机号码" />
				</u-form-item>
				<u-form-item label="所在地区" prop="areaDisplay" required>
					<u-cell style="width: 100%;" :title="form.areaDisplay ? form.areaDisplay : '省市区县、乡镇信息'" required clickable isLink :border="false" @click="showRegion = true"></u-cell>
					<city-select v-model="showRegion" :area-code="areaCode" :level="4" @city-change="cityChange"></city-select>
				</u-form-item>
				<u-form-item label="详细地址" label-position="top" prop="address" required>
					<u-input v-model="form.address" type="textarea" :auto-height="true" clearable placeholder="请输入详细地址" />
				</u-form-item>
				<u-form-item label="默认地址">
					<u-switch v-model="form.isDefault" active-color="#19be6b" slot="right"></u-switch>
				</u-form-item>
			</u-form>
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
			showRegion: false,
			rules: {
				linkMan: [{
					required: true,
					message: '不能为空',
					// 可以单个或者同时写两个触发验证方式 
					trigger: ['change', 'blur'],
				}],
				mobile: [{
					required: true,
					message: '不能为空',
					// 可以单个或者同时写两个触发验证方式 
					trigger: ['change', 'blur'],
				}],
				areaDisplay: [{
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
				id: '',
				linkMan: '',
				mobile: '',
				areaDisplay: '',
				provinceId: '',
				cityId: '',
				districtId: '',
				streetId: '',
				address: '',
				isDefault: true,
			},
			areaCode: [], // 省市区的初始化，例如 ['123', '456', '789']
		};
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	onLoad(e) {
		if(e.id) {
			this._addressDetail(e.id)
		}
	},
	mounted() {
	},
	methods: {
		async _addressDetail(id) {
			// https://www.yuque.com/apifm/nu0f75/gszs9g
			const res = await this.$wxapi.addressDetail(this.token, id)
			if(res.code == 0) {
				this.form = Object.assign(this.form, res.data.info)
				this.areaCode = [res.data.info.provinceId, res.data.info.cityId, res.data.info.districtId, res.data.info.streetId]
				this.form.areaDisplay = res.data.info.provinceStr + res.data.info.cityStr + res.data.info.areaStr + res.data.info.streetStr
			}
		},
		cityChange(e) {
			this.form.provinceId = e.province.value
			this.form.cityId = e.city.value
			this.form.districtId = e.area.value
			this.form.streetId = e.street.value
			this.form.areaDisplay = e.province.label + e.city.label + e.area.label + e.street.label
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
			this.form.token = this.token
			let res
			if(this.form.id) {
				// 修改
				// https://www.yuque.com/apifm/nu0f75/cv6gh7
				res = await this.$wxapi.updateAddress(this.form)
			} else {
				// 添加
				// https://www.yuque.com/apifm/nu0f75/fcx2mf
				res = await this.$wxapi.addAddress(this.form)
			}
			uni.hideLoading({
				success: (res) => {},
			})
			if (res.code != 0) {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			} else {
				uni.showToast({
					title: '保存成功',
				})
				uni.navigateBack()
			}
		},
		chooseAddress() {
			uni.chooseAddress({
			  success: res => {
			    this._chooseAddress(res)
			  }
			})
		},
		async _chooseAddress(chooseAddressRes) {
			this.form.address = chooseAddressRes.detailInfo
			this.form.linkMan = chooseAddressRes.userName
			this.form.mobile = chooseAddressRes.telNumber
			this.form.areaDisplay = chooseAddressRes.provinceName + chooseAddressRes.cityName + chooseAddressRes.countyName
			// 读取省份
			let res = await this.$wxapi.province()
			if(res.code != 0) {
				return
			}
			let item = res.data.find(ele => { return ele.name == chooseAddressRes.provinceName })
			if(item) {
				this.form.provinceId = item.id
			}
			// 读取城市
			res = await this.$wxapi.nextRegion(item.id)
			if(res.code != 0) {
				return
			}
			item = res.data.find(ele => { return ele.name == chooseAddressRes.cityName })
			if(item) {
				this.form.cityId = item.id
			}
			// 读取区县
			res = await this.$wxapi.nextRegion(item.id)
			if(res.code != 0) {
				return
			}
			item = res.data.find(ele => { return ele.name == chooseAddressRes.countyName })
			if(item) {
				this.form.districtId = item.id
			}
		}
	}
};
</script>

<style lang="scss" scoped>
/deep/ .line {
	color: $u-light-color;
	font-size: 28rpx;
}
.wrap {
	background-color: #f2f2f2;
	.top {
		background-color: #ffffff;
		border-top: solid 2rpx $u-border-color;
		padding: 22rpx;
		.item {
			display: flex;
			font-size: 32rpx;
			line-height: 100rpx;
			align-items: center;
			border-bottom: solid 2rpx $u-border-color;
			.left {
				width: 180rpx;
			}
			input {
				text-align: left;
			}
		}
		
		.address {
			padding: 20rpx 0;
			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
		}
		.site-clipboard {
			padding-right: 40rpx;
			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
			.clipboard {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26rpx;
				color: $u-tips-color;
				height: 80rpx;
				.icon {
					margin-top: 6rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
	.bottom {
		margin-top: 20rpx;
		padding: 40rpx;
		padding-right: 0;
		background-color: #ffffff;
		font-size: 28rpx;
		.tag {
			display: flex;
			.left {
				width: 160rpx;
			}
			.right {
				display: flex;
				flex-wrap: wrap;
				.tags {
					width: 140rpx;
					padding: 16rpx 8rpx;
					border: solid 2rpx $u-border-color;
					text-align: center;
					border-radius: 50rpx;
					margin: 0 10rpx 20rpx;
					display: flex;
					font-size: 28rpx;
					align-items: center;
					justify-content: center;
					color: $u-content-color;
					line-height: 1;
				}
				.plus {
					//padding: 10rpx 0;
				}
			}
		}
		.default {
			margin-top: 50rpx;
			display: flex;
			justify-content: space-between;
			border-bottom: solid 2rpx $u-border-color;
			line-height: 64rpx;
			.tips {
				font-size: 24rpx;
			}
			.right {
			}
		}
	}
	.submit {
		padding: 32rpx;
		background-color: #ffffff;
	}
}
</style>
