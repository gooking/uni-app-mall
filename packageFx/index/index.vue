<template>
	<view>
		<view>
		  <image style="width:750rpx;height:486rpx" mode="aspectFit" src="../../static/images/index-top-bg.png" ></image>
		</view>
			
		<!-- 如果当前用户是分销商 -->
		<view v-if="apiUserInfoMap.base && apiUserInfoMap.base.isSeller">
			<view class="tabTop" style="margin-top:-420rpx">
				<view class="header-box">
					<image class="avatar" :src="apiUserInfoMap.base.avatarUrl" mode="aspectFill"></image>
					<view class="r">
						<view class="uid">用户编号: {{ apiUserInfoMap.base.id }}</view>
						<view style="display:flex">
							<view class="nick">{{ apiUserInfoMap.base.nick }}</view>
						</view>
					</view>
				</view>
				<view class="header-box2"> </view>
				<view class="line"></view>
				<view class="asset">
					<view class='item' @click='goAsset' style="width: 170rpx">
						<view class="Count">{{fxCommisionPaying}}</view>
						<view>未结算金额</view>
					</view>
					<view class='item' @click='goAsset' style="width: 170rpx">
						<view class="Count">{{freeze}}</view>
						<view>冻结金额</view>
					</view>
					<view class='item right' @click='goAsset' style="width: 170rpx">
						<view class="Count" style="color:#FF444A">{{balance}}</view>
						<view>可用金额</view>
					</view>
				</view>
				<view class="line"></view>
				<view class="titleXS">我的业绩</view>
				<view class="asset">
					<view class='item'>
						<view class="Count">{{commisionData.todayXiaoshou}}</view>
						<view>今日销售</view>
						<view class="yjP">{{commisionData.today ? commisionData.today : 0}}</view>
						<view class="yjT">（佣金）</view>
					</view>
					<view class='item right'>
						<view class="Count">{{commisionData.yesdayXiaoshou}}</view>
						<view>昨天销售</view>
						<view class="yjP">{{commisionData.yesday ? commisionData.yesday : 0}}</view>
						<view class="yjT">（佣金）</view>
					</view>
					<view class='item right'>
						<view class="Count">{{commisionData.thisMonthXiaoshou}}</view>
						<view>本月销售</view>
						<view class="yjP">{{commisionData.thisMonth ? commisionData.thisMonth : 0}}</view>
						<view class="yjT">（佣金）</view>
					</view>
					<view class='item right'>
						<view class="Count">{{commisionData.lastMonthXiaoshou}}</view>
						<view>上月销售</view>
						<view class="yjP">{{commisionData.lastMonth ? commisionData.lastMonth : 0}}</view>
						<view class="yjT">（佣金）</view>
					</view>
				</view>
			</view>

			<view v-if="apiUserInfoMap.referrer" class="tuan" style="padding: 40rpx 40rpx 20rpx 40rpx;">
				<view>我的邀请人</view>
				<view class="line2"></view>
				<view style="display:flex">
					<image style="width:80rpx;height:80rpx;margin:10px 20px 0px 0;border-radius:100%" :src="apiUserInfoMap.referrer.avatarUrl"></image>
					<view style="height:120rpx;line-height:120rpx;font-size:26rpx;">{{apiUserInfoMap.referrer.nick}}</view>
				</view>
			</view>
			<image v-if="fxIndexAdPos" :src="fxIndexAdPos.val" mode="widthFix" class="adpos" @click="goUrl(fxIndexAdPos.url)"></image>
			
			<u-cell-group title="分销信息" customStyle="padding: 0 24rpx;">
				<u-form-item label="我的邀请码" labelWidth="100">
					<u--input v-model="apiUserInfoMap.base.id" disabled clearable inputAlign="center" >
						<template >
							<u-button slot="suffix" @tap="copyContent(apiUserInfoMap.base.id)" text="复制" type="success" size="mini"></u-button>
						</template>
					</u--input>
				</u-form-item>
			
				<u-cell title="我的团队" value="查看" isLink url="../myusers/index"></u-cell>
				<u-cell title="推广订单" value="查看" isLink url="../commisionLog/index"></u-cell>
				<u-cell title="账单明细" value="查看" isLink url="../../pages/asset/cashlog"></u-cell>
			</u-cell-group>
			<!-- 团队长、副队长 -->
			<u-cell-group v-if="apiUserInfoMap.saleDistributionTeam && (apiUserInfoMap.saleDistributionTeam.leader == apiUserInfoMap.base.id || apiUserInfoMap.saleDistributionTeam.deputyLeader == apiUserInfoMap.base.id )" title="我的团队" customStyle="padding: 0 24rpx;">
				<u-cell icon="setting-fill" :title="apiUserInfoMap.saleDistributionTeam.name"></u-cell>
				<u-cell icon="integral-fill" title="身份" :value="apiUserInfoMap.saleDistributionTeam.leader == apiUserInfoMap.base.id ? '队长' : '副队长'"></u-cell>
				<u-cell icon="integral-fill" title="销售目标" :value="'¥' + apiUserInfoMap.saleDistributionTeam.standardSaleroom + '/月'"></u-cell>
				<u-cell icon="integral-fill" title="本月销售" :value="'¥' + apiUserInfoMap.saleDistributionTeam.curSaleroom"></u-cell>
				<u-cell icon="integral-fill" title="月度报表" isLink :url="'../report/team?teamId=' + apiUserInfoMap.base.teamId"></u-cell>
			</u-cell-group>

			<!-- 城市合伙人 -->
			<u-cell-group v-for="(item,index) in fxCities" :title="item.provinceName + item.cityName + '合伙人'" customStyle="padding: 0 24rpx;">
				<u-cell icon="setting-fill" title="销售目标" :value="'¥' + item.standardSaleroom + '/月'"></u-cell>
				<u-cell icon="integral-fill" title="本月销售" :value="'¥' + item.curSaleroom"></u-cell>
				<u-cell icon="integral-fill" title="月度报表" isLink :url="'../report/city?provinceId=' + item.provinceId + '& cityId=' + item.cityId"></u-cell>
			</u-cell-group>


			<view class='noApply' style="padding-top:10px;padding-bottom:20px">
				<view style="text-align:center;">
					<view class="canvas-box">
						<image class="canvas" style="width:200px;height:200px" :src="qrcode"></image>
					</view>
					<view class="tzBtn" @click="saveToMobile" style="margin-top:10px;background: #F5D795;padding: 0 16rpx;">保存到相册</view>
				</view>
			</view>

		</view>

		<!-- 还不是分销商 -->
		<view v-if="apiUserInfoMap.base && !apiUserInfoMap.base.isSeller" class="tabTop" style="margin-top:-450rpx">
			<view class="header-box">
				<image class="avatar" :src="apiUserInfoMap.base.avatarUrl" mode="aspectFill"></image>
				<view class="r">
					<view class="uid">用户ID: {{ apiUserInfoMap.base.id }}</view>
					<view class="nick">{{ apiUserInfoMap.base.nick }}</view>
				</view>
			</view>
			<view class="header-box2">您当前还不是分销商</view>
			<view class="line"></view>
			<view class="header-box2" @click="goApply">立即前往申请成为分销商 ></view>
		</view>
	</view>
</template>

<script>
	Date.prototype.format = function(format) {
		var date = {
			"M+": this.getMonth() + 1,
			"d+": this.getDate(),
			"h+": this.getHours(),
			"m+": this.getMinutes(),
			"s+": this.getSeconds(),
			"q+": Math.floor((this.getMonth() + 3) / 3),
			"S+": this.getMilliseconds()
		};
		if (/(y+)/i.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		for (var k in date) {
			if (new RegExp("(" + k + ")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1
						  ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
			}
		}
	  return format;
	}
	export default {
		data() {
			return {
				qrcode: '',
				apiUserInfoMap: [],
				balance: 0,
				freeze: 0,
				fxCommisionPaying: 0,
				score: 0,
				commisionData: {
					today: 0,
					yesday: 0,
					thisMonth: 0,
					lastMonth: 0,
					todayXiaoshou: 0,
					yesdayXiaoshou: 0,
					thisMonthXiaoshou: 0,
					lastMonthXiaoshou: 0,
				},
			}
		},
		methods: {
			onLoad: function (options) {
				// uni.setStorageSync('token', '4f02de6e-914f-4439-a128-a62a6bbdc3e4')
				this.adPosition()
			},
			onShow: function () {
				this.$wxapi.checkToken(this.token).then(res => {
					if (res.code === 0) {
						this.doneShow();
						this.doneShow2();
						this.getUserApiInfo();
					}
				})
			},

			async commision() {
				const uid = this.apiUserInfoMap.base.id
				var commisionData = this.commisionData
				const nowDate = new Date()
				console.log('今天', nowDate.format('yyyyMMdd'))
				console.log('本月', nowDate.format('yyyyMM'))
				const yestoday = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000)
				console.log('昨天', yestoday.format('yyyyMMdd'))
				// 上个月
				let year = nowDate.getFullYear()
				let month = nowDate.getMonth() + 1
				if (month == 1) {
					month = 12
					year--
				} else {
					month--
				}
				const lastMonth = year + "" + (month < 10 ? ('0' + month) : month)
				console.log('上个月', lastMonth)
				let res = await this.$wxapi.siteStatisticsSaleroom({
					dateBegin: nowDate.format('yyyyMMdd'),
					dateEnd: nowDate.format('yyyyMMdd'),
					uid: uid
				})
				if (res.code === 0) {
					commisionData.today = res.data[0].estimateCommission
					commisionData.todayXiaoshou = res.data[0].saleroom
					if (uni.getStorageSync('exchangerate')) {
						commisionData.aaaaatoday = (res.data[0].estimateCommission * uni.getStorageSync('exchangerate')).toFixed(2)
						commisionData.aaaaatodayXiaoshou = (res.data[0].saleroom * uni.getStorageSync('exchangerate')).toFixed(2)
					}
				}
				res = await this.$wxapi.siteStatisticsSaleroom({
					dateBegin: yestoday.format('yyyyMMdd'),
					dateEnd: yestoday.format('yyyyMMdd'),
					uid: uid
				})
				if (res.code === 0) {
					commisionData.yesday = res.data[0].estimateCommission
					commisionData.yesdayXiaoshou = res.data[0].saleroom
					if (uni.getStorageSync('exchangerate')) {
						commisionData.aaaaayesday = (res.data[0].estimateCommission * uni.getStorageSync('exchangerate')).toFixed(2)
						commisionData.aaaaayesdayXiaoshou = (res.data[0].saleroom * uni.getStorageSync('exchangerate')).toFixed(2)
					}
				}
				res = await this.$wxapi.siteStatisticsSaleroom({
					dateBegin: nowDate.format('yyyyMM'),
					dateEnd: nowDate.format('yyyyMM'),
					uid: uid
				})
				if (res.code === 0) {
					commisionData.thisMonth = res.data[0].estimateCommission
					commisionData.thisMonthXiaoshou = res.data[0].saleroom
					if (uni.getStorageSync('exchangerate')) {
						commisionData.aaaaathisMonth = (res.data[0].estimateCommission * uni.getStorageSync('exchangerate')).toFixed(2)
						commisionData.aaaaathisMonthXiaoshou = (res.data[0].saleroom * uni.getStorageSync('exchangerate')).toFixed(2)
					}
				}
				res = await this.$wxapi.siteStatisticsSaleroom({
					dateBegin: lastMonth,
					dateEnd: lastMonth,
					uid: uid
				})
				if (res.code === 0) {
					commisionData.lastMonth = res.data[0].estimateCommission
					commisionData.lastMonthXiaoshou = res.data[0].saleroom
					if (uni.getStorageSync('exchangerate')) {
						commisionData.aaaaalastMonth = (res.data[0].estimateCommission * uni.getStorageSync('exchangerate')).toFixed(2)
						commisionData.aaaaalastMonthXiaoshou = (res.data[0].saleroom * uni.getStorageSync('exchangerate')).toFixed(2)
					}
				}
				this.commisionData = commisionData
			},
			getUserApiInfo: function () {
				var that = this;
				this.$wxapi.userDetail(this.token).then(function (res) {
					if (res.code == 0) {
						that.apiUserInfoMap = res.data
						that.commision();
						if (res.data.base.isSeller) {
							// 判断是否是市区合伙人
							that.fxCities()
						}
					}
				})
			},
			doneShow: function () {
				const _this = this
				const token = this.token
				if (!token) {
					return
				}
				this.$wxapi.userAmount(token).then(function (res) {
					if (res.code == 700) {
						uni.showToast({
							title: '当前账户存在异常',
							icon: 'none'
						})
						return
					}
					if (res.code == 2000) {
						return
					}
					if (res.code == 0) {
						_this.balance = res.data.balance.toFixed(2)
						_this.freeze = res.data.freeze.toFixed(2)
						_this.fxCommisionPaying = res.data.fxCommisionPaying.toFixed(2)
						_this.totleConsumed = res.data.totleConsumed.toFixed(2)
						_this.score = res.data.score
					}
				})
			},
			copyContent(e) {
				uni.setClipboardData({
					data: e
				})
			},
			async doneShow2() {
				const _this = this
				const userDetail = await this.$wxapi.userDetail(this.token)
				this.$wxapi.fxApplyProgress(this.token).then(res => {
					let applyStatus = userDetail.data.base.isSeller ? 2 : -1
					if (res.code == 2000) {
						return
					}
					if (res.code === 700) {
						_this.applyStatus = applyStatus
					}
					if (res.code === 0) {
						if (userDetail.data.base.isSeller) {
							applyStatus = 2
						} else {
							applyStatus = res.data.status
						}
						_this.applyStatus = applyStatus
						_this.applyInfo = res.data
					}
					if (applyStatus == 2) {
						_this.fetchQrcode()
					}
				})
			},
			fetchQrcode(){
				const _this = this
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.$wxapi.wxaQrcode({
					scene: 'inviter_id=' + uni.getStorageSync('uid'),
					page: 'pages/index/index',
					is_hyaline: true,
					autoColor: false,
					expireHours: 1
				}).then(res => {
					uni.hideLoading()
					if (res.code ==  41030) {
						uni.showToast({
							title: '上线以后才可以获取二维码',
							icon: 'none'
						})
						return
					}
					if (res.code == 0) {
						this.qrcode = res.data
						//_this.showCanvas(res.data)
					}
				})
			},

			saveToMobile() {
				var that = this
						uni.saveImageToPhotosAlbum({
							filePath: this.qrcode,
							success: (res) => {
								uni.showModal({
									content: that.i18n['packagefx.index.erweima'],
									showCancel: false,
									confirmText: that.i18n['packagefx.index.okle'],
									confirmColor: '#333'
								})
							},
							fail: (res) => {
								uni.showToast({
									title: res.errMsg,
									icon: 'none'
								})
							}
						})
			},
			// 读取市区合伙人
			async fxCities() {
				const res = await this.$wxapi.fxCities(this.token)
				if (res.code == 0) {
					this.fxCities = res.data
				}
			},
			// 读取广告位
			async adPosition() {
				const res = await this.$wxapi.adPosition('fx_index')
				if (res.code == 0) {
					this.fxIndexAdPos = res.data
				}
			},
			goUrl(e) {
				const url = e.currentTarget.dataset.url
				if (url) {
					uni.navigateTo({
						url: url,
					})
				}
			},
			onShareAppMessage() {    
				return {
					title: '"' + uni.getStorageSync('mallName') + '" ' + uni.getStorageSync('share_profile'),
					path: '/pages/index/index?inviter_id=' + uni.getStorageSync('uid'),
					imageUrl: uni.getStorageSync('share_pic'),
					success: function (res) {
						// 转发成功
					},
					fail: function (res) {
						// 转发失败
					}
				}
			},
			goApply() {
				uni.redirectTo({
					url: '/packageFx/apply/index',
				})
			}
		}
	}
</script>

<style>
	page {
	  background:#FDF3E7
	}

	.asset {
	  display: flex;
	  padding: 20rpx 32rpx;
	  justify-content: space-between;
	}

	.asset .item {
	  display: flex;
	  flex-direction: column;
	  text-align: center;
	  font-size: 26rpx;
	  color: #3F240A;
	}

	.btn-view {
	  height: 88rpx;
	  /* background-color: #e85654; */
	  padding-right: 40rpx;
	  padding-bottom: 30rpx;
	  width: 100vw;
	  display: flex;
	  flex-direction: row-reverse;
	}

	.btn-view .btn {
	  border-color: #fff !important;
	  color: #fff !important;
	  margin-right: 20rpx;
	}

	.btn-hover {
	  border-color: #fff;
	  color: #fff;
	}

	.no-data {
	  margin-top: 100rpx;
	  text-align: center;
	  font-size: 13px;
	  color: #ccc;
	}

	.cashlogs {
	  display: flex;
	  font-size: 12px;
	  margin-top: 20rpx;
	  padding-bottom: 20rpx;
	  border-bottom: 1px solid #eee;
	  line-height: 20px;
	}

	.cashlogs .profile {
	  width: 600rpx;
	  padding-left: 30rpx;
	}

	.cashlogs .amount {
	  width: 150rpx;
	}

	.tabTop {
	  width: 710rpx;
	  /* height: 500rpx; */
	  background: linear-gradient(270deg, #F6C173 0%, #FFECC0 100%);
	  border-radius: 20rpx;
	  margin-left: 20rpx;
	  /* margin-top: -380rpx; */
	  position: relative;
	  padding-bottom: 20rpx;
	  margin-bottom: 10px;
	}

	.tabTop2 {
	  margin-top:10px ;
	  width: 710rpx;
	  /* height: 500rpx; */
	  background: linear-gradient(270deg, #F6C173 0%, #FFECC0 100%);
	  border-radius: 20rpx;
	  margin-left: 20rpx;
	  /* margin-top: -380rpx; */
	  position: relative;
	  padding-bottom: 20rpx;
	  margin-bottom: 10px;
	}

	.ava {
	  width: 100rpx;
	  height: 100rpx;
	}

	.header-box {
	  padding: 32rpx 32rpx 0 32rpx;
	  display: flex;
	  align-items: center;
	}

	.header-box2 {
	  padding: 16rpx 32rpx;
	  display: flex;
	  align-items: center;
	  margin-left:10rpx ;
	  font-size: 26rpx;
	  font-family: PingFangSC-Regular, PingFang SC;
	  font-weight: 400;
	  color: #3E240D;
	}

	.header-box .avatar {
	  width: 128rpx;
	  height: 128rpx;
	  border-radius: 50%;
	  border: 2px solid white;
	  flex-shrink: 0;
	}

	.header-box .avatar2 {
	  width: 130rpx;
	  height: 130rpx;
	  position: absolute;
	}

	.header-box .btn {
	  margin-left: 32rpx;
	}

	.header-box .r {
	  margin-left: 32rpx;
	  color: #333;
	  font-size: 28rpx;
	}

	.line {
	  width: 558rpx;
	  height: 2px;
	  background: linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);
	  border-radius: 1px;
	  margin-left: 20px;
	}

	.txBtn {
	  width: 160rpx;
	height: 56rpx;

	border-radius: 28px;
	border: 2rpx solid #3F240A;
	  line-height: 56rpx;
	  position: absolute;
	  right: 16px;
	  text-align:center;
	  font-size: 14px;
	  padding-top:2px ;
	}

	.tzBtn {
	  width: 160rpx;
	height: 56rpx;
	margin:auto;
	border-radius: 28px;
	border: 2rpx solid #3F240A;
	  line-height: 56rpx;
	  right: 16px;
	  text-align:center;
	  font-size: 14px;
	  padding-top:2px ;
	}

	.Count{
	height: 38px;
	font-size: 40rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #3F240A;
	line-height: 38px;

	}

	.tuan{
	  margin-left:20rpx ;
	  width: 630rpx;
	  background: #FFFFFF;
	  border-radius: 8rpx;
	  padding: 40rpx;
	}

	.tuan2{
	  margin-left:20rpx ;
	  width: 630rpx;
	  background: #FFFFFF;
	  border-radius: 8rpx;
	  padding: 26rpx 40rpx;
	}

	.line2{
	  width: 630rpx;
	height: 1px;
	background: #E6E6E6;
	border-radius: 1px;
	margin-top:20rpx ;
	}
	.tuanItem{
	  width: 315rpx;
	  text-align: center;
	  padding-top:42rpx
	}

	.tI1{
	font-size: 38rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #333333;
	margin: 0 0 8rpx 0;
	}
	.tI2{
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #666666;
	}

	.yqCode{
	background: #F2F5FF;
	height: 37rpx;
	font-size: 26rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #182442;
	line-height: 37rpx;
	padding: 2rpx 20rpx;
	margin-left:20rpx ;
	}

	.cybtn{
	  width: 140rpx;
	  height: 50rpx;
	  background: #FFD43E;
	  border-radius: 28px;
	  line-height: 50rpx;
	  text-align: center;
	  font-size: 14px;
	}

	.yjP{
	height: 37rpx;
	font-size: 26rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #FF444A;
	line-height: 37rpx;
	}

	.yjT{
	height: 30rpx;
	font-size: 22rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #666666;
	line-height: 30rpx;
	}

	.titleXS{
	  /* width: 140px; */
	height: 40rpx;
	font-size: 28rpx;
	/* font-family: PingFangSC-Medium, PingFang SC; */
	/* font-weight: 400; */
	color: #3F240A;
	line-height: 40rpx;
	margin-left: 22px;
	margin-top:10px
	}

	.textsjtz{
	height: 40rpx;
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #999999;
	line-height: 40rpx;
	margin-top:10px ;
	}

	.next {
	  width: 40rpx;
	  height: 40rpx;
	  position: absolute;
	  right: 20px;
	}


	/* -----------商品列表------------- */
	.goods-container {
	  display: flex;
	  justify-content: space-between;
	  flex-wrap: wrap;
	  box-sizing: content-box;
	  padding: 22rpx;
	  margin-bottom: 100rpx;
	}

	.goods-box {
	  width: 339rpx;
	  height: 472rpx;
	  background-color: #fff;
	  overflow: hidden;
	  margin-bottom: 24rpx;
	  border-radius: 5px;
	}

	.goods-box .img-box {
	  width: 339rpx;
	  height: 339rpx;
	  overflow: hidden;
	}

	.goods-box .img-box image {
	  width: 339rpx;
	  height: 339rpx;
	}

	.goods-box .goods-title {
	  width: 280rpx;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	  overflow: hidden;
	  font-size: 26rpx;
	  padding: 20rpx 0 0rpx 0;
	  color: #000;
	  margin-left: 24rpx;
	}

	.goods-box .goods-price {
	  /* width: 280rpx; */
	  overflow: hidden;
	  font-size: 36rpx;
	  padding: 8rpx 0;
	  color: #e64340;
	  margin-left: 24rpx;
	}
	/* -------商品列表------------- */

	.cell-class {
	  padding: 0 24rpx;
	}
	.canvas-box {
	  width: 100vw;
	  display: flex;
	  justify-content: center;
	}
	.adpos {
	  padding: 0 24rpx;
	  width: 100vw;
	  box-sizing: border-box;
	  border-radius: 16rpx;
	}
</style>
