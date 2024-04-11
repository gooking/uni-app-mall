<template>
	<view class="demo">
		<l-dialer size="568rpx" ref="dialer" :prizeList="prizeList" @click="onClick" @done="onDone">
			<template #prize="{item}">
			    <image style="width: 72rpx; height: 72rpx;" :src="item.img" />
			</template>
		</l-dialer>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 奖品列表，
				prizeList: [{
						id: 'coupon88',
						name: '8.8折',
						img: 'https://img11.360buyimg.com/pop/jfs/t1/175718/35/12595/5477/60b660c6Eb850717b/a1cfe750dcdb5b78.png',
					},
					{
						id: 'coupon900',
						Color: 'rgb(251, 219, 216)',
						name: '900',
						img: 'https://img11.360buyimg.com/pop/jfs/t1/190845/9/6092/4489/60b65fe8Ebb8f8284/955da889f6d1c13e.png',
					},
					{
						id: 'coupon1',
						name: '1元',
						img: 'https://img11.360buyimg.com/pop/jfs/t1/189927/14/6092/4174/60b66173E23c472ea/44af15a151defca1.png',
					},
					{
						id: 'apple',
						Color: 'rgba(246, 142, 46, 0.5)',
						name: '苹果手机',
						img: 'https://img11.360buyimg.com/pop/jfs/t1/177670/26/4591/2514/60a25874Ee0e5332a/99c7bdfede732ae4.png'
					},
					{
						id: 'coupon210',
						name: '210元',
						img: 'https://img11.360buyimg.com/pop/jfs/t1/124578/12/20170/4429/60b635d8E7089ebb0/7a47d76a2a260cc0.png'
					},
					{
						id: 'jd100',
						name: '100京豆',
						img: 'https://img11.360buyimg.com/pop/jfs/t1/162790/37/15087/28046/6062a49aE8f2c10f2/5591ff0ff38a45e2.png',
					},
					{
						id: 'coupon400',
						name: '400元',
						img: 'https://img11.360buyimg.com/pop/jfs/t1/177090/2/7001/4535/60b6607aEe9c1db2a/76c67675f547db3f.png'
					},
					{
						id: 'thanks',
						name: '谢谢参与',
						img: 'https://storage.jd.com/cdn-upload/dialTemplateHeart.png',
					}
				]
			};
		},
		methods: {
			onDone(index) {
				const prize = this.prizeList[index]
				uni.showModal({
					title: prize.id == 'thanks' ? '很遗憾' : '恭喜您',
					content: (prize.id !== 'thanks' ? `获得` : '') + prize.name
				})
			},
			onClick() {
				// 奖品的索引
				this.$refs.dialer.run(5)
			}
		}
	}
</script>

<style lang="scss">
	.demo {
		// #ifdef H5
		min-height: calc(100vh - 44px);
		// #endif
		// #ifndef H5
		min-height: 100vh;
		 // #endif
		background-color: #6339b5;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>