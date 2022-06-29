<template>
	<view>
		<u-cell v-if="userMobile" title="手机号码" :value="userMobile" />
		<u-cell wx:else title="绑定手机">
			<view slot="value" class="mobile-btn">
				<u-button type="success" size="mini" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">立即绑定
				</u-button>
			</view>
		</u-cell>
		<u-cell title="收货地址" is-link url="/pages/address/index" />
		<u-cell v-if="apiUserInfoMap && apiUserInfoMap.base.pwdPay" title="交易密码" value="修改交易密码" is-link url="/pages/pay/pwd" />
		<u-cell wx:else title="交易密码" value="设置交易密码" is-link url="/pages/pay/pwd-set" />
		<u-cell title="我的收藏" is-link url="/pages/goods/fav" />
		<u-cell title="修改资料" is-link url="/pages/my/info" />

	</view>
</template>

<script>
	export default {
		data() {
			return {
				userMobile: undefined,
				apiUserInfoMap: undefined
			}
		},
		created() {

		},
		mounted() {

		},
		onReady() {

		},
		onLoad(e) {
			this.userDetail()
		},
		onShow() {

		},
		methods: {
			async userDetail() {
				const res = await this.$wxapi.userDetail(this.token)
				if (res.code == 0 && (res.data.base.nick || res.data.base.nickavatarUrl)) {
					this.userMobile = res.data.base.mobile
					this.apiUserInfoMap = res.data
				}
			},
			getPhoneNumber(e) {
				if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
					// wx.showModal({
					// 	title: '提示',
					// 	content: e.detail.errMsg,
					// 	showCancel: false
					// })
					console.error(e)
					return;
				}
				this._getPhoneNumber(e)
			},
			async _getPhoneNumber(e) {
				const res = await this.$wxapi.bindMobileWxappV2(this.token, e.detail.code)
				if (res.code == 0) {
					uni.showToast({
						title: '绑定成功',
						icon: 'success',
						duration: 2000
					})
					this.$u.vuex('mobile', res.data)
					this.userDetail()
				} else {
					uni.showModal({
						title: '提示',
						content: res.msg,
						showCancel: false
					})
				}
			}
		}
	}
</script>
<style scoped lang="scss">

</style>
