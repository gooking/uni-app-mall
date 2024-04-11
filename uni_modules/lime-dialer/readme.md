# Dialer 转盘抽奖 
> 营销活动类组件  
> [查看更多 站点1](https://limeui.qcoon.cn/#/dialer) <br>
> [查看更多 站点2](http://liangei.gitee.io/limeui/#/dialer) <br>
> Q群：806744170



### 平台兼容
|	H5 | 微信小程序 | 支付宝小程序 | 百度小程序 | 头条小程序 | QQ小程序 | App |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| √	| √ |	√	| √ |	√	| √ |	√ |


### 代码演示
#### 基础用法

```html
<l-dialer :prizeList="prizeList" @click="onClick" @done="onDone" ref="dialer" />
```
```js
export default {
    data() {
        return {
			// 奖品列表，
            prizeList: [
            	{
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
				title: prize.id == 'thanks' ? '很遗憾': '恭喜您',
				content: (prize.id !== 'thanks' ? `获得`:'') + prize.name
			})
		},
		onClick() {
			// 奖品的索引
			this.$refs.dialer.run(5)
		}
	}
}
```

#### 表框
- 1、通过设置`dial-style`设置背景的方式设置，必须是网络图片
- 2、通过插槽`border`设置

```html
// 方式1
<l-dialer dial-style="color: rgba(60,48,158,0.7); padding: 32rpx;background-image: url(http://a.cn/static/dialer/lottery-bg.png)"/>

// 方式2
<l-dialer>
	<image slot="border" src="static/dialer/lottery-bg.png"/>
</l-dialer>
```

#### 指针
- 1、可通过`pointer-style`设置背景的方式设置，但必须为网络图片
- 2、可通过插槽`pointer`设置
- 3、因为插件是能过获取内部方法实现抽奖，只要获取方法，任何元素都是指针按钮

```html
// 方式1
<l-dialer pointer-style="background-image: url(http://a.cn/static/dialer/bg.png)"/>
// 方式2
<l-dialer>
	<image slot="pointer" src="static/dialer/lottery-bg.png" />
</l-dialer>
```

#### 奖品插槽
- 默认会按奖品列表渲染，但想更个性可通过插槽`prize`设置
- 微信小程序最好使用HX3.7.12+并且在`manifest.json`设置`slotMultipleInstance`
```json
"mp-weixin" : {
    "slotMultipleInstance" : true
}
```

```html
<l-dialer>
	<template #prize="{item}">
		<image style="width: 72rpx; height: 72rpx;" :src="item.img" />
	</template>
</l-dialer>
```


### 查看示例
- 导入后直接使用这个标签查看演示效果

```html
<!-- // 代码位于 uni_modules/lime-dialer/compoents/lime-dialer -->
<lime-dialer />
```


### 插件标签
- 默认 l-dialer 为 component
- 默认 lime-dialer 为 demo



### API
#### Props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| size | 转盘直径，默认单位为 `rpx` | Number | `300` | - |
| prizeList | 奖品列表  | Array | [] | - |
| turns | 旋转圈数 | Number | `10` | - |
| duration | 旋转过程时间,单位为 `s` | Number | `3` | - |
| styleOpt | 转盘中的样式，包括每个扇区的背景颜色(在每条数据中页可单独设置prizeColor)，扇区的边框颜色 | Object | {prizeBgColors: [],borderColor: ''} | - |
| customStyle | 外容器的自定义样式 | String |  | - |
| dialStyle | 转盘自定义样式 | String |  | - |
| pointerStyle | 指针自定义样式 | String | `width:30%` | - |

#### Event

| 名称 | 说明                                                       |
| ---- | ---------------------------------------------------------- |
| run(index)   | 旋转到指定索引，该事件是通过`ref`获取插件实例的内部方法 |
| done   | 旋转结束，该事件是通过标签接收的方法 |
| click   | 点击指针，该事件是通过标签接收的方法 |


#### Slots

| 名称 | 说明                                                       |
| ---- | ---------------------------------------------------------- |
| border   | 边框插槽 |
| prize   | 奖品插槽 |
| pointer   | 指针插槽 |
