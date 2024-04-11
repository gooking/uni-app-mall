<template>
	<view class="lime-dialer" :style="getStyle">
		<view class="lime-dialer__inner" :style="getDialStyle">
			<view class="lime-dialer__inner-border" v-if="$slots.border">
				<slot name="border"/>
			</view>
			<view class="lime-dialer__inner-wrap" :style="styleOpt.borderColor && (' border: 1rpx solid ' + styleOpt.borderColor)">
				<view class="lime-dialer__inner-item" v-for="(item, index) in prizeList" :key="index" :style="[getRotateAngle(index)]">
					<view class="lime-dialer__inner-content" :style="[getCorrectAngle(index)]">
						<slot v-if="$slots.prize" name="prize" :item="item" :even="index % 2"></slot>
						<block v-else>
							<view class="lime-dialer__inner-name" :style="[{fontSize: styleOpt.fontSize, color: styleOpt.color}]">{{ item.name }}</view>
							<image class="lime-dialer__inner-img" :src="item.img"></image>
						</block>
					</view>
				</view>
			</view>
		</view>
		<view class="lime-dialer__pointer" :style="pointerStyle" >
			<slot v-if="$slots && $slots.pointer" name="pointer"/>
			<image
				v-else
				:class="!isTurnIng ? 'heart': ''"
				src="/uni_modules/lime-dialer/static/turnable_btn.png" 
				style="width: 100%"
				mode="widthFix" 
				@tap="$emit('click')"
			/>
		</view>
	</view>
</template>
<script>
import {addUnit} from '@/uni_modules/lime-shared/addUnit'	
import {sleep} from '@/uni_modules/lime-shared/sleep'	
export default {
	name: 'lime-dialer',
	props: {
		size: {
			type: [String, Number],
			default: 300
		},
		prizeList: {
			type: Array
		},
		turns: {
			type: Number,
			default: 10
		},
		duration: {
			type: Number,
		    default: 3
		},
		styleOpt: {
			type: Object,
			default: () => ({
				// 每一块扇形的背景色,默认值,可通过父组件来改变
				// $primary-1 $primary-2 
				prizeBgColors: ['#fff0a3', '#fffce6'],
				// 每一块扇形的外边框颜色,默认值,可通过父组件来改变
				// primary-4
				borderColor: '#ffd752',
			})
		},
		customStyle: {
			type: String,
		},
		dialStyle: {
			type: String,
		},
		pointerStyle: {
			type: String,
			default: `width: 30%`
		}
	},
	data() {
		return {
			// 开始转动的角度
			startRotateDegree: 0,
			// 设置指针默认指向的位置,现在是默认指向2个扇形之间的边线上
			rotateAngle: 0,
			rotateTransition: '',
			isTurnIng: false,
		};
	},
	computed: {
		getRotateAngle() {
			return index => {
				return {
					transform: `rotate(${(360 / this.prizeList.length) * index}deg) skewX(0deg) skewY(${360 / this.prizeList.length - 90}deg)`,
					backgroundColor: `${this.styleOpt.prizeBgColors[index % this.styleOpt.prizeBgColors.length]}`,
					border: `${this.styleOpt.borderColor && '1rpx solid ' + this.styleOpt.borderColor }`
				}
			};
		},
		getCorrectAngle() {
			return index => {
				return {
					transform: `skewY(${90 - 360 / this.prizeList.length}deg) skewX(0deg) rotate(${180 / this.prizeList.length}deg)`
				}
			};
		},
		getStyle() {
			let { size, customStyle } = this;
			size = addUnit(size)///\d$/.test(size) ? size + 'rpx' : size;
			return `width: ${size}; height: ${size}; ${customStyle}`;
		},
		getDialStyle() {
			return `
				padding: ${this.styleOpt.padding};
				transform: ${this.rotateAngle};
				transition: ${this.rotateTransition};
				${this.dialStyle}
			`;
		}
		
	},
	methods: {
		// 转动起来
		run(index) {
			if(this.isTurnIng) return
			const duration = this.duration;
			const length = this.prizeList.length
			
			const rotateAngle = this.startRotateDegree + this.turns * 360 + 360 - (180 / length + (360 / length) * index) - (this.startRotateDegree % 360);
			this.startRotateDegree = rotateAngle;
			this.rotateAngle = `rotate(${rotateAngle}deg)`;
			this.rotateTransition = `transform ${duration}s cubic-bezier(0.250, 0.460, 0.455, 0.995)`;
			this.isTurnIng = true
			sleep(duration * 1000 + 500).then(() => {
				this.$emit('done', index);
				this.isTurnIng = false
			})
			// setTimeout(() => {
			// 	this.$emit('done', index);
			// 	this.isTurnIng = false
			// }, duration * 1000 + 500);
		}
	}
};
</script>
<style lang="stylus" scoped>
replace2(val)
	r = match('\$[^() ]+', val, 'gi')
	re = val
	for v, i in r
		k = split(v, re)
		j = s('%s', convert(v))
		re = join(j, k)
	unquote(re)

theme($property, $imp)
	a = replace('(\$[^() ]+)', '$1', $imp)
	// #ifndef APP-NVUE
	b = replace('(\$)([^() ]+)', 'var(--$2, $1$2)', $imp)
	// #endif
	{$property} replace2(a)
	// #ifndef APP-NVUE
	{$property} replace2(b)
	// #endif
		
$dialer_text_color ?= #ffb400
$dialer_prize_font_size ?= 12px
$dialer_prize_name_padding ?= 8px
$dialer_prize_inner_padding ?= 8px
$dialer_prize_image_size ?= 36px

.lime-dialer
	position relative
	&__inner
		width 100%
		height 100%
		position relative
		// color $dialer_text_color
		theme('color', '$dialer_text_color')
		background-repeat no-repeat
		background-size cover
		box-sizing border-box
		&-border
			position absolute
			left 0
			top 0
			bottom 0
			right 0
		&-wrap
			position relative
			z-index 1
			// flex 1
			width 100%
			height 100%
			border-radius 50%
			overflow hidden
			box-sizing border-box
			
			&::after
				position absolute
				left 0
				top 0
				bottom 0
				right 0
				content ''
				border-radius 50%
				box-shadow 0 0 20rpx currentColor inset 
		&-item
			overflow hidden
			position absolute
			top -50%
			left 50%
			width 100%
			height 100%
			transform-origin 0 100%
		&-content
			position absolute
			theme('padding-top', '$dialer_prize_inner_padding')
			// padding-top $dialer_prize_inner_padding
			box-sizing border-box
			width 100%
			height 100%
			left -50%
			bottom -50%
			display flex
			flex-direction column
			align-items center
		&-name
			theme('padding-top', '$dialer_prize_name_padding')
			theme('padding-bottom', '$dialer_prize_name_padding')
			theme('font-size', '$dialer_prize_font_size')
			theme('color', '$dialer_text_color')
			// padding-top $dialer_prize_name_padding
			// padding-bottom $dialer_prize_name_padding
			// font-size $dialer_prize_font_size
			// color $dialer_text_color
		&-img
			// margin-top 24rpx
			theme('width', '$dialer_prize_image_size')
			theme('height', '$dialer_prize_image_size')
			// width $dialer_prize_image_size
			// height $dialer_prize_image_size
	&__pointer
		position absolute
		left 50%
		top 50%
		transform translate(-50%, -50%)
		z-index 1
.heart
	animation heart 1s infinite
@keyframes heart
	0%
		transform scale(1)
	25%
		transform scale(1.03)
	to
		transform scale(1)
</style>
