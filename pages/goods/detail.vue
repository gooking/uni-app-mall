<template>
	<view>
		<view class="goods-detail" v-if="goodsDetail">
			<u-tabs :list="tabs" lineColor="#ed3f14" @click="tabclick"></u-tabs>
			<scroll-view class="main" scroll-y :scroll-into-view="curViewId" enable-back-to-top scroll-with-animation
				@scrolltolower="scrolltolower">
				<view id="basic">
					<video v-if="videoMp4Src" :src="videoMp4Src" autoplay="true" loop="true" object-fit="cover"
						style='width:750rpx;height:750rpx;'></video>
					<u-swiper v-else :list="goodsDetail.pics" keyName="pic" indicator circular height="750rpx">
					</u-swiper>
					<view class="price-share">
						<view v-if="curKanjiaprogress" class="price-score price-score2">
							<view class="item">
								<text>¥</text>{{ curKanjiaprogress.kanjiaInfo.curPrice }}
							</view>
							<view class="item original">
								<text>¥</text>{{ curGoodsKanjia.originalPrice }}
							</view>
						</view>
						<view v-else class="price-score price-score2">
							<view v-if="goodsDetail.basicInfo.minPrice" class="item">
								<text>¥</text>{{goodsDetail.basicInfo.minPrice}}
							</view>
							<view v-if="goodsDetail.basicInfo.minScore" class="item">
								<text>
									<image class="score-icon" src="/static/images/score.png"></image>
								</text>{{goodsDetail.basicInfo.minScore}}
							</view>
						</view>
						<!-- #ifdef MP -->
						<view class="btns">
							<view class="icon-btn">
								<u-icon name="share-square" size="48rpx"></u-icon>
								<text>分享</text>
								<button open-type='share'></button>
							</view>
							<view class="icon-btn" @click="drawSharePic">
								<u-icon name="moments" size="48rpx"></u-icon>
								<text>海报</text>
							</view>
						</view>
						<!-- #endif -->
					</view>
					<view class="goods-title u-line-3 pt16">
						<u-tag
							v-if="goodsDetail.basicInfo.supplyType == 'vop_jd' || goodsDetail.basicInfo.supplyType == 'jdJoycityPoints'"
							text="京东自营" bgColor="#e64340" borderColor="#e64340" size="mini" class="goods-title-tag">
						</u-tag>
						<text>{{ goodsDetail.basicInfo.name }}</text>
					</view>
					<view v-if="goodsDetail.basicInfo.characteristic" class="title-sub">
						{{ goodsDetail.basicInfo.characteristic }}
					</view>
					<view class="commission" v-if="goodsDetail.basicInfo.commissionType == 1">分享有赏，好友下单后可得
						{{goodsDetail.basicInfo.commission}} 积分奖励
					</view>
					<view class="commission" v-if="goodsDetail.basicInfo.commissionType == 2">分享有赏，好友下单后可得
						{{goodsDetail.basicInfo.commission}}元 现金奖励
					</view>
				</view>

				<block v-if="curGoodsKanjia">
					<u-gap height="20rpx" bgColor="#eee"></u-gap>
					<view class="label-title">
						<view class="icon"></view>商品砍价设置
					</view>
					<u-cell-group>
						<u-cell title="数量" :value="curGoodsKanjia.number + '份'"></u-cell>
						<u-cell title="已售" :value="curGoodsKanjia.numberBuy + '份'"></u-cell>
						<u-cell title="原价" :value="curGoodsKanjia.originalPrice"></u-cell>
						<u-cell title="底价" :value="curGoodsKanjia.minPrice"></u-cell>
						<u-cell title="截止" :value="curGoodsKanjia.dateEnd"></u-cell>
					</u-cell-group>
				</block>
				<block v-if="curKanjiaprogress">
					<u-gap height="20rpx" bgColor="#eee"></u-gap>
					<view class="label-title">
						<view class="icon"></view>当前砍价状态
					</view>
					<u-cell-group>
						<u-cell title="帮砍人数" :value="curKanjiaprogress.kanjiaInfo.helpNumber"></u-cell>
						<u-cell title="状态" :value="curKanjiaprogress.kanjiaInfo.statusStr"></u-cell>
						<u-cell title="参与时间" :value="curKanjiaprogress.kanjiaInfo.dateAdd"></u-cell>
					</u-cell-group>
				</block>
				<view v-if="curKanjiaprogress && curKanjiaprogress.kanjiaInfo.uid != uid" class="curKanjiaJoin">
					帮<text>{{curKanjiaprogress.joiner.nick}}</text> 砍价吧！
				</view>
				<view v-if="curGoodsKanjia && curKanjiaprogress" class="curKanjiaprogress">
					<u-line-progress
						:percentage="100 * (curGoodsKanjia.originalPrice - curKanjiaprogress.kanjiaInfo.curPrice) / (curGoodsKanjia.originalPrice - curGoodsKanjia.minPrice)"
						activeColor="#ff0000"></u-line-progress>
					<view class="curKanjiaprogress-bar">// 砍价完成进度 //</view>
				</view>

				<block v-if="curKanjiaprogress && curKanjiaprogress.helps && curKanjiaprogress.helps.length>0">
					<u-gap height="20rpx" bgColor="#eee"></u-gap>
					<view class="label-title">
						<view class="icon"></view>好友助力明细
					</view>
					<view class="kjlj" v-for="(item,index) in curKanjiaprogress.helps" :key="index">
						<image class="kjlj-l" :src="item.avatarUrl" mode="aspectFill" />
						<u-cell class="kjlj-r" :label="item.nick + ' ' + item.dateAdd + '帮砍'" size="large">
							<view slot="title" class="price-score">
								<view class="item"><text>¥</text>{{ item.cutPrice }}</view>
							</view>
						</u-cell>
					</view>
				</block>

				<u-gap height="20rpx" bgColor="#eee"></u-gap>
				<view class="label-title">
					<view class="icon"></view>详细介绍
				</view>
				<view id="content">
					<view class="content">
						<view v-if="wxintroduction">
							<u-image v-for="(item,index) in wxintroduction" :src="item" mode="widthFix" width="750rpx"
								height="auto"></u-image>
						</view>
						<u-parse v-else :content="goodsDetail.content"></u-parse>
					</view>
				</view>
				<view id="reputation">
					<u-divider v-if="reputationList" text="用户评价"></u-divider>
					<view v-if="reputationList" class="reputation-box">
						<view v-for="(item,index) in reputationList" :key="index" class="album">
							<view class="album__avatar">
								<u-image class="image" :src="item.user.avatarUrl" shape="circle" width="120rpx"
									height="120rpx"></u-image>
							</view>
							<view class="album__content">
								<u-text :text="item.user.nick" type="primary" bold size="17"></u-text>
								<u-rate v-model="item.goods.goodReputation"></u-rate>
								<u-text margin="8rpx 0 8rpx 0" size="26rpx" color="#666666"
									:text="item.goods.goodReputationRemark"></u-text>
								<u-text margin="0 0 8rpx 0" size="24rpx" color="#666666"
									:text="item.goods.dateReputation"></u-text>
								<!-- <u-album v-if="item.reputationPics" :urls="urls2"></u-album> -->
								<view style="height: 32rpx;"></view>
							</view>
						</view>
					</view>
					<view>
						<!-- 
							<van-rate value="{{ item.goods.goodReputation }}" color="#e64340" readonly />
						</van-cell>
						<van-cell wx:if="{{ item.goods.goodReputationRemark }}" title-class="reputation-cell-reamrk"
							title="{{item.goods.goodReputationRemark}}" />
						<view wx:if="{{ item.reputationPics }}" class="reputation-pics">
							<image wx:for="{{item.reputationPics}}" wx:for-item="picItem" src="{{ picItem.pic }}"
								mode="aspectFill" bindtap="previewImage" data-url="{{ picItem.pic }}"></image>
						</view>
						<van-cell wx:if="{{ item.goods.goodReputationReply }}" title-class="reputation-cell-reamrk"
							title="掌柜回复:{{item.goods.goodReputationReply}}" /> -->
					</view>
				</view>
			</scroll-view>
			<view v-if="curGoodsKanjia">
				<view v-if="curKanjiaprogress && curKanjiaprogress.kanjiaInfo.uid == uid" class="bottom-btns">
					<!--  #ifdef MP-WEIXIN	|| MP-BAIDU -->
					<view class="icon-btn">
						<u-icon name="chat" size="48rpx"></u-icon>
						<text>客服</text>
						<button open-type='contact' :send-message-title="goodsDetail.basicInfo.name"
							:send-message-img="goodsDetail.basicInfo.pic"
							:send-message-path="'/pages/goods/detail?id='+goodsDetail.basicInfo.id"
							show-message-card></button>
					</view>
					<!--  #endif -->
					<view class="icon-btn" @click="addFav">
						<u-icon :name="faved ? 'heart-fill' : 'heart'" size="48rpx"></u-icon>
						<text>收藏</text>
					</view>
					<view class="btn">
						<u-button class="half-l" text="邀请好友助力" shape="circle"
							color="linear-gradient(90deg,#ffd01e, #ff8917)" open-type='share'>
						</u-button>
					</view>
					<view class="btn">
						<u-button class="half-r" text="用现价购买" shape="circle"
							color="linear-gradient(90deg, #ff6034, #ee0a24)" @click="kanjiabuy">
						</u-button>
					</view>
				</view>
				<view v-else-if="curKanjiaprogress && curKanjiaprogress.kanjiaInfo.uid != uid" class="bottom-btns">
					<view class="icon-btn">
						<u-icon name="share" size="48rpx"></u-icon>
						<text>邀请</text>
						<button open-type='share'></button>
					</view>
					<view class="btn">
						<u-button class="half-l" :text="myHelpDetail ? '您已助力' : '帮忙砍一刀'" shape="circle"
							:disabled="myHelpDetail ? true : false" color="linear-gradient(90deg,#ffd01e, #ff8917)"
							@click="helpKanjia">
						</u-button>
					</view>
					<view class="btn">
						<u-button class="half-r" text="我也要参与" shape="circle"
							color="linear-gradient(90deg, #ff6034, #ee0a24)" @click="joinKanjia">
						</u-button>
					</view>
				</view>
				<view v-else class="bottom-btns">
					<!--  #ifdef MP-WEIXIN	|| MP-BAIDU -->
					<view class="icon-btn">
						<u-icon name="chat" size="48rpx"></u-icon>
						<text>客服</text>
						<button open-type='contact' :send-message-title="goodsDetail.basicInfo.name"
							:send-message-img="goodsDetail.basicInfo.pic"
							:send-message-path="'/pages/goods/detail?id='+goodsDetail.basicInfo.id"
							show-message-card></button>
					</view>
					<!--  #endif -->
					<view class="icon-btn" @click="addFav">
						<u-icon :name="faved ? 'heart-fill' : 'heart'" size="48rpx"></u-icon>
						<text>收藏</text>
					</view>
					<view class="btn">
						<u-button class="half-l" text="发起砍价" shape="circle"
							color="linear-gradient(90deg,#ffd01e, #ff8917)" @click="joinKanjia">
						</u-button>
					</view>
					<view class="btn">
						<u-button class="half-r" text="原价购买" shape="circle"
							color="linear-gradient(90deg, #ff6034, #ee0a24)" @click="_showGoodsPop">
						</u-button>
					</view>
				</view>
			</view>
			<view v-else class="bottom-btns">
				<!--  #ifdef MP-WEIXIN	|| MP-BAIDU -->
				<view class="icon-btn">
					<u-icon name="chat" size="48rpx"></u-icon>
					<text>客服</text>
					<button open-type='contact' :send-message-title="goodsDetail.basicInfo.name"
						:send-message-img="goodsDetail.basicInfo.pic"
						:send-message-path="'/pages/goods/detail?id='+goodsDetail.basicInfo.id"
						show-message-card></button>
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
						@click="_showGoodsPop">
					</u-button>
				</view>
				<view class="btn">
					<u-button class="half-r" text="立即购买" shape="circle" color="linear-gradient(90deg, #ff6034, #ee0a24)"
						@click="_showGoodsPop">
					</u-button>
				</view>
			</view>
		</view>
		<goods-pop :show="showGoodsPop" :goodsDetail="goodsDetail" :kjid="kjid" @close="showGoodsPop = false"></goods-pop>
		<!-- <u-modal :show="showhaibao"  :title="title" >
			<view class="slot-content">
				<hch-poster v-if="showhaibao" ref="hchPoster" @cancel="handleCancel" :posterData.sync="posterData" @previewImage='previewImage' />
			</view>
		</u-modal> -->
		<u-popup :show="showhaibao">
			<view class="haibaopop">
				<hch-poster v-if="showhaibao" ref="hchPoster" @cancel="haibaoCancel" :posterData.sync="posterData"
					@previewImage='haibaoPreview' />
			</view>
		</u-popup>
	</view>
</template>

<script>
	import HchPoster from "../../components/hch-poster/hch-poster.vue"
	export default {
		components: {
			HchPoster
		},
		data() {
			return {
				tabs: [{
						viewId: 'basic',
						name: '商品信息',
					},
					{
						viewId: 'content',
						name: '详细介绍',
					},
					{
						viewId: 'reputation',
						name: '用户评价',
					},
				],
				curViewId: 'basic',
				goodsDetail: undefined,
				jdGoodsDetail: undefined,
				wxintroduction: undefined,
				faved: false,
				showGoodsPop: false,
				page: 1,
				reputationList: null,
				videoMp4Src: undefined,
				showhaibao: false,
				// 海报模板数据
				posterData: {},
				curGoodsKanjia: undefined,
				curKanjiaprogress: undefined,
				myHelpDetail: undefined,
				kjid: undefined
			}
		},
		onLoad(e) {
			if (e && e.inviter_id) {
				this.$u.vuex('referrer', e.inviter_id)
			}
			// 读取小程序码中的邀请人编号
			if (e && e.scene) {
				const scene = decodeURIComponent(e.scene) // 处理扫码进商品详情页面的逻辑
				if (scene && scene.split(',').length >= 2) {
					e.id = scene.split(',')[0]
					this.$u.vuex('referrer', scene.split(',')[1])
				}
			}
			this._goodsDetail(e.id, e.supplyType, e.yyId)
		},
		onShow() {

		},
		onShareAppMessage(e) {
			const d = {
				title: this.goodsDetail.basicInfo.name,
				path: '/pages/goods/details?id=' + this.goodsDetail.basicInfo.id + '&inviter_id=' + this.uid
			}
			if (this.kjJoinUid) {
				_data.title = this.curKanjiaprogress.joiner.nick + '邀请您帮TA砍价'
				_data.path += '&kjJoinUid=' + this.kjJoinUid
			}
			return d
		},
		created() {

		},
		methods: {
			async _goodsDetail(goodsId, supplyType, yyId) {
				if (goodsId) {
					// https://www.yuque.com/apifm/nu0f75/vuml8a
					const res = await this.$wxapi.goodsDetail(goodsId, this.token)
					if (res.code != 0) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 3000)
						return
					}
					this.goodsDetail = res.data
					if (res.data.basicInfo.videoId) {
						this.getVideoSrc(res.data.basicInfo.videoId)
					}
					if (res.data.basicInfo.kanjia) {
						this.kanjiaSet()
					}
				} else {
					// 不是api工厂商品
					this.goodsDetail = {
						basicInfo: {
							yyId: yyId,
							yyIdStr: yyId,
							supplyType: supplyType,
							pic: '',
							name: '',
							stores: 999999
						},
						pics: []
					}
				}
				// 检测是否收藏
				this.goodsFavCheck()
				this._reputationList()
				if (this.goodsDetail.basicInfo.supplyType == 'vop_jd') {
					this.jdvopGoodsDetail(this.goodsDetail.basicInfo.yyId)
				}
				if (this.goodsDetail.basicInfo.supplyType == 'jdJoycityPoints') {
					this.joycityPointsGoodsDetail(this.goodsDetail.basicInfo.yyIdStr)
				}
			},
			async jdvopGoodsDetail(skuId) {
				// https://www.yuque.com/apifm/nu0f75/ar77dc
				const res = await this.$wxapi.jdvopGoodsDetail(skuId)
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 3000)
					return
				}
				this.jdGoodsDetail = res.data
				this.goodsDetail.basicInfo.minPrice = this.jdGoodsDetail.price.priceSale
				this.goodsDetail.basicInfo.originalPrice = this.jdGoodsDetail.price.priceJd
				this.goodsDetail.basicInfo.name = this.jdGoodsDetail.price.skuName
				this.goodsDetail.basicInfo.pic = this.jdGoodsDetail.imageDomain + this.jdGoodsDetail.price.pic
				if (this.jdGoodsDetail.info.wxintroduction) {
					this.wxintroduction = JSON.parse(this.jdGoodsDetail.info.wxintroduction)
				}
				this.jdvopGoodsSkuImages(skuId)
			},
			async jdvopGoodsSkuImages(skuId) {
				// https://www.yuque.com/apifm/nu0f75/pvcu30
				const res = await this.$wxapi.jdvopGoodsSkuImages(skuId)
				if (res.code == 0) {
					const pics = res.data
					pics.forEach(ele => {
						ele.pic = this.jdGoodsDetail.imageDomain + ele.path
					})
					this.goodsDetail.pics = pics
				}
			},
			async joycityPointsGoodsDetail(skuId) {
				const res = await this.$wxapi.joycityPointsGoodsDetail(skuId)
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 3000)
					return
				}
				const pics = []
				res.data.providerImgUrls.split(',').forEach(ele => {
					pics.push({
						pic: ele
					})
				})
				this.goodsDetail.pics = pics
				this.goodsDetail.basicInfo.name = res.data.goodsName
				this.goodsDetail.basicInfo.minPrice = 0
				this.goodsDetail.basicInfo.minScore = res.data.goodsPrice
				this.goodsDetail.basicInfo.originalPrice = res.data.suggestedPrice
				if (res.data.pics && res.data.pics.length > 0) {
					this.wxintroduction = res.data.pics
				} else {
					this.goodsDetail.content = res.data.usageGuide
				}
			},
			goCart() {
				if (this.goodsDetail.basicInfo.supplyType == 'vop_jd') {
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
				if (this.goodsDetail.basicInfo.supplyType == 'vop_jd') {
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
				if (!await getApp().checkHasLoginedH5()) {
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
				if (this.goodsDetail.basicInfo.supplyType == 'vop_jd') {
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
			tabclick(e) {
				this.curViewId = this.tabs[e.index].viewId
			},
			// 弹出商品购买弹窗
			async _showGoodsPop() {
				this.showGoodsPop = true
				this.kjid = null
			},
			kanjiabuy() {
				// 砍价用现在的价格购买
				this.goodsDetail.basicInfo.minPrice = this.curKanjiaprogress.kanjiaInfo.curPrice
				this.kjid = this.curGoodsKanjia.id
				this.showGoodsPop = true
			},
			scrolltolower() {
				this.page += 1
				this._reputationList()
			},
			async _reputationList() {
				// https://www.yuque.com/apifm/nu0f75/cusiow
				const res = await this.$wxapi.goodsReputationV2({
					goodsId: this.goodsDetail.basicInfo.id,
					page: this.page,
					pageSize: 10
				})
				if (res.code == 0) {
					res.data.result.forEach(ele => {
						if (ele.user && !ele.user.avatarUrl) {
							ele.user.avatarUrl = '/static/images/empty.jpg'
						}
						if (ele.user && !ele.user.nick) {
							ele.user.nick = '匿名用户'
						}
						if (ele.goods.goodReputation == 0) {
							ele.goods.goodReputation = 1
						} else if (ele.goods.goodReputation == 1) {
							ele.goods.goodReputation = 3
						} else if (ele.goods.goodReputation == 2) {
							ele.goods.goodReputation = 5
						}
					})
					if (this.page == 1) {
						this.reputationList = res.data.result
					} else {
						this.reputationList = this.reputationList.concat(res.data.result)
					}
				}
			},
			async getVideoSrc(videoId) {
				const res = await this.$wxapi.videoDetail(videoId)
				if (res.code == 0) {
					this.videoMp4Src = res.data.fdMp4
				}
			},
			async drawSharePic() {
				uni.showLoading({
					title: ''
				})
				const res = wx.getSystemInfoSync()
				console.log(__wxConfig.envVersion); // develop trial release // 判断当前版本为什么版本
				const qrcodeRes = await this.$wxapi.wxaQrcode({
					scene: this.goodsDetail.basicInfo.id + ',' + uni.getStorageSync('uid'),
					page: 'pages/goods/detail',
					is_hyaline: true,
					autoColor: true,
					expireHours: 1,
					check_path: __wxConfig.envVersion == 'release' ? true : false
				})
				if (qrcodeRes.code != 0) {
					uni.hideLoading()
					uni.showToast({
						title: qrcodeRes.msg,
						icon: 'none'
					})
					return
				}
				const qrcode = qrcodeRes.data
				const pic = this.goodsDetail.basicInfo.pic
				uni.getImageInfo({
					src: pic,
					success: res => {
						const height = 490 * res.height / res.width
						this.drawSharePicDone(height, qrcode)
					},
					fail: err => {
						uni.hideLoading()
						console.error(err)
					}
				})
			},
			async drawSharePicDone(height, qrcode) {
				this.posterData = {
					poster: {
						//根据屏幕大小自动生成海报背景大小
						url: 'https://dcdn.it120.cc/static/poster_bg.png', //背景图片地址
						r: 10, //圆角半径
						w: 300, //海报宽度
						h: 610, //海报高度
						p: 20 //海报内边距padding
					},
					mainImg: {
						//海报主商品图
						url: this.goodsDetail.basicInfo.pic, //图片地址
						r: 10, //圆角半径
						w: 250, //宽度
						h: 250 //高度
					},
					title: {
						//商品标题
						text: this.goodsDetail.basicInfo.name, //文本
						fontSize: 16, //字体大小
						color: "#000", //颜色
						lineHeight: 25, //行高
						mt: 20 //margin-top
					},
					codeImg: {
						//小程序码
						url: qrcode, //图片地址
						w: 180, //宽度
						h: 180, //高度
						mt: 20, //margin-top
						r: 50 //圆角半径
					},
					tips: [
						//提示信息
						{
							text: this.sysconfigMap.mallName, //文本
							fontSize: 14, //字体大小
							color: "#2f1709", //字体颜色
							align: "center", //对齐方式
							lineHeight: 25, //行高
							mt: 20 //margin-top
						},
						{
							text: "长按/扫描打开小程序", //文本
							fontSize: 12, //字体大小
							color: "#2f1709", //字体颜色
							align: "center", //对齐方式
							lineHeight: 25, //行高
							mt: 20 //margin-top
						}
					]
				}
				this.showhaibao = true
				setTimeout(() => {
					uni.hideLoading()
					this.$refs.hchPoster.posterShow()
				}, 1000)
			},
			haibaoCancel() {
				this.showhaibao = false
			},
			async kanjiaSet() {
				const res = await this.$wxapi.kanjiaSet(this.goodsDetail.basicInfo.id)
				if (res.code == 0) {
					this.curGoodsKanjia = res.data[0]
					this.curGoodsKanjia.dateEnd = this.curGoodsKanjia.dateEnd.replace(/00:00:00/g, '')
					this.curGoodsKanjia.dateEnd = this.curGoodsKanjia.dateEnd.replace(/ /g, '')
					this.kanjiaprogress()
				}
			},
			async kanjiaprogress() {
				let kjJoinUid = this.kjJoinUid
				if (!kjJoinUid) {
					kjJoinUid = this.uid
				}
				const res = await this.$wxapi.kanjiaDetail(this.curGoodsKanjia.id, kjJoinUid)
				if (res.code == 0) {
					this.curKanjiaprogress = res.data
					this.kanjiaHelpDetail()
				}
			},
			async joinKanjia() {
				// 报名参加砍价活动
				if (!this.curGoodsKanjia) {
					return
				}
				uni.showLoading({
					title: '加载中'
				})
				const res = await this.$wxapi.kanjiaJoin(this.token, this.curGoodsKanjia.id)
				uni.hideLoading()
				if (res.code == 2000) {
					getApp().autoLogin(true)
					return
				}
				if (res.code == 0) {
					this.$u.vuex('kjJoinUid', this.uid)
					this.myHelpDetail = null
					this.kanjiaSet()
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			},
			async helpKanjia() {
				console.log(this.curGoodsKanjia);
				console.log(this.token);
				const res = await this.$wxapi.kanjiaHelp(this.token, this.curGoodsKanjia.id, this.curKanjiaprogress
					.kanjiaInfo.uid, '')
				if (res.code != 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					return;
				}
				this.myHelpDetail = res.data
				uni.showModal({
					title: '成功',
					content: '成功帮TA砍掉 ' + res.data.cutPrice + ' 元',
					showCancel: false,
					confirmText: '知道了'
				})
				this.kanjiaSet()
			},
			async kanjiaHelpDetail() {
				console.log(this.curGoodsKanjia);
				console.log(this.token);
				const res = await this.$wxapi.kanjiaHelpDetail(this.token, this.curGoodsKanjia.id, this
					.curKanjiaprogress.kanjiaInfo.uid)
				if (res.code == 0) {
					this.myHelpDetail = res.data
				}
			},
		}
	}
</script>
<style scoped lang="scss">
	.goods-detail {
		width: 100vw;
		height: calc(100vh - var(--window-bottom) - var(--status-bar-height) - var(--window-top));
		overflow: hidden;
		display: flex;
		flex-direction: column;

		.main {
			flex: 1;
			overflow: hidden;
		}
	}

	.price-share {
		display: flex;
		justify-content: space-between;
		padding: 8rpx 32rpx;
		align-items: center;

		.price {
			color: #e64340;
			font-size: 64rpx;
			margin-top: 12rpx;
			padding-right: 32rpx;

			text {
				margin-left: 16rpx;
				color: #666666;
				font-size: 26rpx;
				text-decoration: line-through;
			}
		}

		.btns {
			display: flex;

			.icon-btn {
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 24rpx;
				color: #333;
				margin-left: 48rpx;
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
	}

	.title {
		padding: 0rpx 32rpx;
		color: #293539;
		position: relative;
	}

	.title-sub {
		padding: 16rpx 32rpx;
		color: #666666;
		font-size: 26rpx;
	}

	.commission {
		padding: 16rpx 32rpx;
		color: #e64340;
		font-size: 24rpx;
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

		image {
			height: auto;
		}

		div {
			height: auto;
		}
	}

	.bottom-btns {
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

			button {
				position: absolute;
				height: 100%;
				width: 100%;
				opacity: 0;
				z-index: 99;
			}
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

	.reputation-box {
		padding: 32rpx;
	}

	.album {
		@include flex;
		align-items: flex-start;

		&__avatar {
			padding: 5px;
			border-radius: 3px;
		}

		&__content {
			margin-left: 10px;
			flex: 1;
		}
	}

	.haibaopop {
		width: 100vw;
		height: 100vh;
	}

	.goods-title {
		padding: 0 32rpx;

		text {
			font-weight: bold;
			font-size: 34rpx;
		}
	}

	.curKanjiaJoin {
		padding: 32rpx;
		font-size: 28rpx;

		text {
			color: #e64340;
			font-weight: bold;
			padding: 0 8rpx;
			font-size: 32rpx;
		}
	}

	.curKanjiaprogress {
		padding: 32rpx;
	}

	.price-score2 {
		.item {
			font-size: 64rpx;
		}
	}

	.curKanjiaprogress-bar {
		text-align: center;
		font-size: 20rpx;
		color: #999;
		margin-top: 20rpx;
	}
	.kjlj {
	  display: flex;
	  background-color: #ffffff;
	  padding: 0 32rpx;
	  align-items: center;
	  .kjlj-l {
	    width: 88rpx;
	    height: 88rpx;
	    border-radius: 50%;
	    flex-shrink: 0;
	  }
	  .kjlj-r {
		  flex: 1;
	  }
	}
</style>
