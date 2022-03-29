<template>
	<view>
		<view class="avatar">
			<image :src="userInfoMap.base.avatarUrl" mode="widthFix"></image>
		</view>

		<u-cell-group title="会员信息">
			<u-cell title="会员编号" :value="userInfoMap.base.id" ></u-cell>
			<u-cell title="手机号码" :value="userInfoMap.base.mobile" ></u-cell>
			<u-cell title="昵称" :value="userInfoMap.base.nick" ></u-cell>
			<u-cell v-if="userInfoMap.userLevel" title="等级" :value="userInfoMap.userLevel.name" ></u-cell>
			<u-cell title="分销商">
				<view>
					<view v-if="!userInfoMap.base.isSeller">否</view>
					<u-tag v-else text="是"type="success"></u-tag>
				</view>
			</u-cell>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfoMap: []
			}
		},
		methods: {
			onLoad: function (options) {
				// options.id = 1871848
				this.userDetailSpreadUser(options.id)
			},
			onShow: function () {
				uni.setNavigationBarTitle({
					title: '用户详情'
				})
			},
			async userDetailSpreadUser(uid) {
				const res = await this.$wxapi.userDetailSpreadUser(this.token, uid)
				if (res.code != 0) {
					uni.showModal({
						title: '错误',
						content: res.msg,
						showCancel: false
					})
					return
				}
				this.userInfoMap = res.data
			},
		}
	}
</script>

<style>
	.avatar {
		width: 100vw;
		text-align: center;
		margin-top: 32rpx;
	}
	.avatar image {
		width: 280rpx;
		border-radius: 50%;
	}
</style>
