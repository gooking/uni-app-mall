<template>
	<view class="wrap">
		<view class="top">
			<u-form ref="uForm" label-width="auto" :model="form">
				<u-form-item label="收货人" prop="linkMan" required>
					<u-input v-model="form.linkMan" clearable placeholder="请输入收货人" />
				</u-form-item>
				<u-form-item label="手机号码" prop="mobile" required>
					<u-input v-model="form.mobile" type="number" clearable placeholder="请输入手机号码" />
				</u-form-item>
				<u-form-item label="所在地区" prop="areaDisplay" required>
					<u-input v-model="form.areaDisplay" type="select" clearable placeholder="省市区县、乡镇等" @click="showRegion = true" />
					<city-select v-model="showRegion" :area-code="areaCode" @city-change="cityChange"></city-select>
				</u-form-item>
				<u-form-item label="详细地址" label-position="top" prop="address" required>
					<u-input v-model="form.address" type="textarea" :auto-height="true" clearable placeholder="请输入详细地址" />
				</u-form-item>
				<u-form-item label="设置默认地址">
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
		console.log(e);
		if(e.id) {
			this._addressDetail(e.id)
		}
	},
	mounted() {
			// this.$u.post('https://s3.amazonaws.com/hzhmbucket/cn-north-1', {
			// 	id: 2
			// }).then(res => {
			// 	console.log(res);
			// })
	},
	methods: {
		async _addressDetail(id) {
			const res = await this.$api.addressDetail(this.token, id)
			if(res.code == 0) {
				this.form = Object.assign(this.form, res.data.info)
				this.areaCode = [res.data.info.provinceId, res.data.info.cityId, res.data.info.districtId]
				this.form.areaDisplay = res.data.info.provinceStr + res.data.info.cityStr + res.data.info.areaStr
			}
		},
		a(e){
			console.log(e);
		},
		cityChange(e) {
			console.log(e);
			this.form.provinceId = e.province.value
			this.form.cityId = e.city.value
			this.form.districtId = e.area.value
			this.form.areaDisplay = e.province.label + e.city.label + e.area.label
		},
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					console.log(222);
					this._submit()
				}
			});
		},
		async _submit() {
			uni.showLoading({
				title: '',
			})
			this.form.token = this.token
			let res
			if(this.form.id) {
				// 修改
				res = await this.$api.updateAddress(this.form)
			} else {
				// 添加
				res = await this.$api.addAddress(this.form)
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
