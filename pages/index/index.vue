<template>
	<view class="login">
        <u-navbar
            :title="title"
            :safeAreaInsetTop="true"
            @rightClick="rightClick"
            @leftClick="leftClick"
        >

			<view
			    class="u-nav-slot"
			    slot="right"
			>
			    <u-icon
			        name="arrow-left"
			        size="19"
			    ></u-icon>
			    <u-line
			        direction="column"
			        :hairline="false"
			        length="16"
			        margin="0 8px"
			    ></u-line>
			    <u-icon
			        name="home"
			        size="20"
			    ></u-icon>
			</view>
        </u-navbar>

		
		<view class="category-container">
		  <view class="category-box">
			<view class="statstitle">{{ $t('index.statistics.today') }}</view>
		    <view class="asset">
		      <view class='item' @click="gopage('/pages/products/list')">
		        <view class="amount">{{goodsOnsale}}</view>
		        <view class="statisticstitle">{{ $t('index.statistics.zaishoushangpin') }}</view>
		      </view>
		      <view class='item right' @click="gopage('/pages/users/index')">
				<view class="amount"><u-count-to fontSize="16px" :bold="true" :start-val="0" :end-val="orderPayPersionNumberToday"></u-count-to></view>
		        <view class="statisticstitle">{{ $t('index.statistics.jinrikehu') }}</view>
		      </view>
		      <view class='item right' @click="gopage('/pages/orders/index')">
				<view class="amount"><u-count-to fontSize="16px" :bold="true" :start-val="0" :end-val="orderPayNumberToday"></u-count-to></view>
		        <view class="statisticstitle">{{ $t('index.statistics.jinridingdan') }}</view>
		      </view>
		      <view class='item right' @click="gopage('/pages/cash/index')">
				<view class="amount"><u-count-to fontSize="16px" :bold="true" :start-val="0" :end-val="rechargeToday"></u-count-to></view>
		        <view class="statisticstitle">{{ $t('index.statistics.jinrixiaoshou') }}</view>
		      </view>
		    </view>
			<view class="statstitle">{{ $t('index.statistics.all') }}</view>
		    <view class="asset">
		      <view class='item' @click="gopage('/pages/products/list')">
		        <view class="amount">{{goodsOnsaleall}}</view>
		        <view class="statisticstitle">{{ $t('index.statistics.quanbushangpin') }}</view>
		      </view>
		      <view class='item right' @click="gopage('/pages/users/index')">
				<view class="amount"><u-count-to fontSize="16px" :bold="true" :start-val="0" :end-val="users"></u-count-to></view>
		        <view class="statisticstitle">{{ $t('index.statistics.jinrikehu') }}</view>
		      </view>
		      <view class='item right' @click="gopage('/pages/orders/index')">
				<view class="amount"><u-count-to fontSize="16px" :bold="true" :start-val="0" :end-val="count_id"></u-count-to></view>
		        <view class="statisticstitle">{{ $t('index.statistics.jinridingdan') }}</view>
		      </view>
		      <view class='item right' @click="gopage('/pages/cash/index')">
		        <view class="amount"><u-count-to fontSize="16px" :bold="true" :start-val="0" :end-val="sum_amount_real"></u-count-to></view>
		        <view class="statisticstitle">{{ $t('index.statistics.jinrixiaoshou') }}</view>
		      </view>
		    </view>
		  </view>
		</view>
		<u-gap height="40" bgColor="#FFFFFF"></u-gap>
		<u-grid :col="3" :border="true">
			<u-grid-item v-if="myApiIds.includes(37) || myApiIds.includes(185) || myApiIds.includes(36) || myApiIds.includes(34) || myApiIds.includes(199) || myApiIds.includes(206)" @click="gopage('/pages/products/index')">
				<u-icon name="shopping-cart" :customStyle="{paddingTop:20+'rpx'}" color="#D99397" :size="23"></u-icon>
				<text class="grid-text">{{ $t('index.products') }}</text>
			</u-grid-item>
			<u-grid-item v-if="myApiIds.includes(25)" @click="gopage('/pages/users/index')">
				<u-icon name="man-add" :customStyle="{paddingTop:20+'rpx'}" color="#DEB974" :size="23"></u-icon>
				<text class="grid-text">{{ $t('index.users') }}</text>
			</u-grid-item>
			<u-grid-item v-if="myApiIds.includes(41)" @click="gopage('/pages/orders/list')">
				<u-badge type="error" max="99" :offset="[20, -15]" :value="fetchDatePageList.length"></u-badge>
				<u-icon name="order" :customStyle="{paddingTop:20+'rpx'}" color="#974BD9" :size="23"></u-icon>
				<text class="grid-text">{{ $t('index.orders') }}</text>
			</u-grid-item>
			<u-grid-item v-if="myApiIds.includes(37) || myApiIds.includes(170) || myApiIds.includes(70) || myApiIds.includes(88)" @click="gopage('/pages/marketing/index')">
				<u-icon name="red-packet" :customStyle="{paddingTop:20+'rpx'}" color="#DAA184" :size="23"></u-icon>
				<text class="grid-text">{{ $t('index.marketing') }}</text>
			</u-grid-item>
			<u-grid-item v-if="myApiIds.includes(190) || myApiIds.includes(28) || myApiIds.includes(101) || myApiIds.includes(6) || myApiIds.includes(60) || myApiIds.includes(9) || myApiIds.includes(15) || myApiIds.includes(132)" @click="gopage('/pages/media/index')">
				<u-badge type="error" max="99" :offset="[20, 20]" :value="commentList.length + Newslist.length"></u-badge>
				<u-icon name="photo" :customStyle="{paddingTop:20+'rpx'}" color="#169FE7" :size="23"></u-icon>
				<text class="grid-text">{{ $t('index.media') }}</text>
			</u-grid-item>
			<u-grid-item v-if="myApiIds.includes(30) || myApiIds.includes(41) || myApiIds.includes(94) || myApiIds.includes(172)" @click="gopage('/pages/finance/index')">
				<u-badge type="error" max="99" :offset="[20, 20]" :value="invoices + withdraws"></u-badge>
				<u-icon name="rmb" :customStyle="{paddingTop:20+'rpx'}" color="#008982" :size="23"></u-icon>
				<text class="grid-text">{{ $t('index.finance') }}</text>
			</u-grid-item>
			<!--
			<u-grid-item @click="gopage('/pages/restaurant/index')">
				<u-icon name="rmb" color="#008982" :size="23"></u-icon>
				<text class="grid-text">{{ $t('module.caiwuguanli') }}</text>
			</u-grid-item>
			-->
		</u-grid>
		<u-cell @click="langListShow = true" v-if="langDisplay == 'English'" icon="../../static/images/en.png" :title="$t('login.label.lang')" :value="langDisplay"></u-cell>
		<u-cell @click="langListShow = true" v-if="langDisplay == '简体中文'" icon="../../static/images/cn.png" :title="$t('login.label.lang')" :value="langDisplay"></u-cell>
		<u-action-sheet :cancelText="$t('common.cancel')" :actions="langList" @close="close" :show="langListShow" @select="langSelected"></u-action-sheet>
		<u-cell-group>
			<u-cell @click="gopage('/pages/settings/index')" icon="setting" :title="$t('title.Settings')"></u-cell>
			<u-cell @click="gopage('/pages/index/notifications')" icon="clock" :title="$t('dashboard.daibanshixian')">
				<u-badge type="error" max="99" :offset="[20, 20]" slot="right-icon" :value="todoList.length"></u-badge>
			</u-cell>
		</u-cell-group>		
		<ystk /><!-- 该页面需要弹出隐私条款 -->
	</view>
</template>



<script>
	export default {
		data() {
			return {
				langList: [
					{
						code: 'zh',
						name: this.$t('lang.zh')
					},
					{
						code: 'en',
						name: this.$t('lang.en')
					}
				],
				langListShow: false,
				title: 'Home',
				backText: '返回',
				backIconName: 'nav-back',
				right: false,
				showAction: false,
				rightSlot: false,
				useSlot: false,
				background: {
					'background-image': 'linear-gradient(45deg, rgb(0, 0, 0), rgb(0, 0, 0))'
				},
				isBack: false,
				search: false,
				custom: false,
				isFixed: true,
				keyword: '',
				// #ifdef MP
				slotRight: false,
				// #endif
				// #ifndef MP
				slotRight: true,
				// #endif
				
				goodsOnsale: '',
				orderPayPersionNumberToday: '',
				orderPayNumberToday: '',
				rechargeToday: '',
				users: '',
				goodsOnsaleall: '',
				count_id: '',
				sum_amount_real: '',
				todoList: [],
				fetchDatePageList: [],
				commentList: [],
				Newslist: [],
				invoices: '',
				withdraws: '',
			}
		},
		onLoad() {
			this.lang = this.$i18n.locale
			this.langDisplay = this.$t('lang.' + this.lang)
			uni.setNavigationBarTitle({
				title: this.$t('index.title')
			});
		},
		onShow() {
			this.statistics();
			this.orderslist();
			this.getcomments();
			this.getNewslist();
			this.getinvoices();
			
			this.todoList = []
			this.fetchTodoNeedDeliver()
			this.orderRefundApplyList()
			this.goodsStoresAlarm()
			this.withdrawslistdownload();
		},
		created() {},
		methods: {
			rightClick() {
				console.log('rightClick');
			},
			leftClick() {
				console.log('leftClick');
			},
			close() {
				this.langListShow = false
				// console.log('close');
			},
			langSelected(index) {
				console.log(index)
				this.lang = index.code;
				this.$i18n.locale = this.lang
				uni.setStorageSync('lang', this.lang)
				this.langDisplay = this.$t('lang.' + this.lang)
				this.langListShow = false
				uni.setNavigationBarTitle({
					title: this.$t('login.title')
				});
			},
			async getcomments(append) {
				const res = await this.$api.apiExtCommentlist({
					page: 1,
					pageSize: 100,
					status: 0
				})
			
				if (res.code != 0) {
					this.commentList = []
					return
				} else {
					this.commentList = res.data.result
				}
			},
			async getNewslist(append) {
				const res = await this.$api.apiExtNewslist({
					page: 1,
					pageSize: 100,
					status: 0
				})
				if (res.code != 0) {
					this.Newslist = null
					return
				} else {
					this.Newslist = res.data.result
				}
			},
			gopage(url) {
				uni.navigateTo({
					url: url
				})
			},
			async statistics() {
				const res = await this.$api.backendstatistics()
				this.goodsOnsale = res.data.goodsOnsale
				this.orderPayPersionNumberToday = res.data.orderPayPersionNumberToday
				this.orderPayNumberToday = res.data.orderPayNumberToday
				this.rechargeToday = res.data.rechargeToday.toFixed(0)
				this.users = res.data.users
				this.goodsOnsaleall = res.data.goodsOnsale + res.data.goodsUnsale
			},
			async orderslist() {
				const res2 = await this.$api.orderslist()
				this.count_id = res2.data.aggregate.count_id
				this.sum_amount_real = res2.data.aggregate.sum_amount_real.toFixed(0)
			},
			async fetchTodoNeedDeliver() {
			  // 待发货订单 todoList
			  const res = await this.$api.orderslist({
				  page: 1,
				  pageSize: 50,
				  status: 1
			  })
			  if (res.code === 0) {
				this.fetchDatePageList = res.data.result
			    res.data.result.forEach(ele => {
			      const user = res.data.apiExtUserMap[ele.uid]
			      const entity = {
			        type: 'order',
			        status: 1,
			        title: this.$t('dashboard.daifahuonazo'),
			        entity: ele,
			        url: '/pages/orders/detail?id=' + ele.id
			      }
			      if (user) {
			        entity.message = this.$t('dashboard.dingdanid') + ele.id + this.$t('dashboard.yonghunazo') + user.nick + this.$t('dashboard.rmbnazo') + ele.amountReal
			      }
			      this.todoList.push(entity)
			    })
			  }
			},
			async orderRefundApplyList() {
			  // 售后未处理的订单
			  const res = await this.$api.refundslist({
				  unResolved: true,
				  pageSize: 50
			  })
			  if (res.code === 0) {
			    res.data.result.forEach(ele => {
			      const entity = {
			        type: 'order',
			        status: 1,
			        title: this.$t('dashboard.tuihuanhuo'),
			        message: this.$t('dashboard.dingdanid') + ele.id + ele.typeStr + ele.logisticsStatusStr + ele.reason,
			        entity: ele,
			        url: '/pages/orders/detail?id=' + ele.orderId
			      }
			      this.todoList.push(entity)
			    })
			  }
			},
			async goodsStoresAlarm() {
			  // 库存预警
				const res = await this.$api.storesAlarm()
			  if (res.code === 0) {
			    res.data.forEach(ele => {
			      const entity = {
			        type: 'goods',
			        title: this.$t('dashboard.kucunyujing'),
			        message: this.$t('dashboard.shangpinazo') + ele.name + this.$t('dashboard.kucunjinchen') + ele.stores,
			        entity: ele,
			        url: '/pages/products/edit?id=' + ele.id
			      }
			      this.todoList.push(entity)
			    })
			  }
			},
			async getinvoices(append) {
				this.showfilterpopup = false
				const res = await this.$api.invoiceApplylist({
					page: 1,
					pageSize: 1000,
					status: 0,
				})
				if (res.code != 0) {
					this.invoices = 0
					return
				} else {
					this.invoices = res.data.result.length
				}
				
			},
			async withdrawslistdownload(append) {
				const _data = {
					page: 1,
					pageSize: 100,
					status: 0,
				}
				const res = await this.$api.extUserWithdrawlist(_data)
				if (res.code != 0) {
					this.withdraws = 0
					return
				} else {
					this.withdraws = res.data.result.length
				}
			},
		}
	}
</script>
<style scoped lang="scss">


	.u-page {
		padding: 0;

		&__item {

			&__title {
				color: $u-tips-color;
				background-color: $u-bg-color;
				padding: 15px;
				font-size: 15px;

				&__slot-title {
					color: $u-primary;
					font-size: 14px;
				}
			}
		}
	}

	.u-nav-slot {
		@include flex;
		align-items: center;
		justify-content: space-between;
		border-width: 0.5px;
		border-radius: 100px;
		border-color: $u-border-color;
		padding: 3px 7px;
		opacity: 0.8;
	}
	
	
	.grid-text {
        font-size: 14px;
        color: #909399;
        padding: 10rpx 0 20rpx 0rpx;
        /* #ifndef APP-PLUS */
        box-sizing: border-box;
        /* #endif */
	}
	.category-container {
	  margin-top: 20px;
	  margin-bottom: 10px;
	  margin-right: 10px;
	  margin-left: 12.5px;
	  position: relative;
	  background-color: white;
	}
	.category-box {
	  box-shadow: 0px 0px 18px 0px rgba(5, 5, 5, 0.15);
	  border-radius: 10px;
	  padding: 20rpx 0;
	}
	.asset {
	  width: 100%;
	  display: flex;
	  padding-top:20rpx;
	  padding-bottom:20rpx;
	}
	.asset .item {
	  flex: 1;
	  display: flex;
	  flex-direction: column;
	  text-align: center;
	  font-size: 24rpx;
	  line-height: 20px;
	  color:#666;
	}
	.asset .item .amount {
	  color:#333;
	  font-weight: bold;
	  font-size: 16px;
	  padding-bottom: 12rpx;
	}
	.asset .item .statisticstitle {
		font-size: 14px;
	}
	.statstitle{
		width: 100%;
		text-align: center;
		color: #969799;
		font-size: 14px;
	}
	
	
	
	.u-demo {
		//height: 200vh;
		height: calc(100% - 44px);
		height: calc(100% - 44px - constant(safe-area-inset-top));
		height: calc(100% - 44px - env(safe-area-inset-top));
	}
	
	.wrap {
		padding: 24rpx;
	}
	
	.navbar-right {
		margin-right: 24rpx;
		display: flex;
	}
	
	.search-wrap {
		margin: 0 20rpx;
		flex: 1;
	}
	
	.right-item {
		margin: 0 12rpx;
		position: relative;
		color: #ffffff;
		display: flex;
	}
	
	.message-box {
		
	}
	
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
	}
	
	.map-wrap {
		display: flex;
		align-items: center;
		padding: 4px 6px;
		background-color: rgba(240,240, 240, 0.35);
		color: #fff;
		font-size: 22rpx;
		border-radius: 100rpx;
		margin-left: 30rpx;
	}
	
	.map-wrap-text {
		padding: 0 6rpx;
	}
	.loginn {
		padding: 32rpx;
	}
</style>