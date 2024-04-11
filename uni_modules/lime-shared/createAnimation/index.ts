// @ts-nocheck
// nvue 需要在节点上设置ref或在export里传入
// const animation = createAnimation({
//   ref: this.$refs['xxx'],
// 	 duration: 0,
// 	 timingFunction: 'linear'
// })
// animation.opacity(1).translate(x, y).step({duration})
// animation.export(ref)

// 抹平nvue 与 uni.createAnimation的使用差距
// 但是nvue动画太慢~~~无语




// #ifdef APP-NVUE
const nvueAnimation = uni.requireNativePlugin('animation')

type AnimationTypes = 'matrix' | 'matrix3d' | 'rotate' | 'rotate3d' | 'rotateX' | 'rotateY' | 'rotateZ' | 'scale' | 'scale3d' | 'scaleX' | 'scaleY' | 'scaleZ' | 'skew' | 'skewX' | 'skewY' | 'translate' | 'translate3d' | 'translateX' | 'translateY' | 'translateZ'
	| 'opacity' | 'backgroundColor' | 'width' | 'height' | 'left' | 'right' | 'top' | 'bottom'

interface Styles {
	[key : string] : any
}
	
interface StepConfig {
	duration?: number
	timingFunction?: string
	delay?: number
	needLayout?: boolean
	transformOrigin?: string
}
interface StepAnimate {
	styles?: Styles
	config?: StepConfig
}
interface StepAnimates {
	[key: number]: StepAnimate
}
interface CreateAnimationOptions extends UniApp.CreateAnimationOptions {
	ref?: string
}

type Callback = (time: number) => void
const animateTypes1 : AnimationTypes[] = ['matrix', 'matrix3d', 'rotate', 'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scale3d',
	'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'translate', 'translate3d', 'translateX', 'translateY',
	'translateZ'
]
const animateTypes2 : AnimationTypes[] = ['opacity', 'backgroundColor']
const animateTypes3 : AnimationTypes[] = ['width', 'height', 'left', 'right', 'top', 'bottom']

class LimeAnimation {
	ref : any
	context : any
	options : UniApp.CreateAnimationOptions
	// stack : any[] = []
	next : number = 0
	currentStepAnimates : StepAnimates = {}
	duration : number = 0
	constructor(options : CreateAnimationOptions) {
		const {ref} = options
		this.ref = ref
		this.options = options
	}
	addAnimate(type : AnimationTypes, args: (string | number)[]) {
		let aniObj = this.currentStepAnimates[this.next]
		let stepAnimate:StepAnimate = {}
		if (!aniObj) {
			stepAnimate = {styles: {}, config: {}}
		} else {
			stepAnimate = aniObj
		}

		if (animateTypes1.includes(type)) {
			if (!stepAnimate.styles.transform) {
				stepAnimate.styles.transform = ''
			}
			let unit = ''
			if (type === 'rotate') {
				unit = 'deg'
			}
			stepAnimate.styles.transform += `${type}(${args.map((v: number) => v + unit).join(',')}) `
		} else {
			stepAnimate.styles[type] = `${args.join(',')}`
		}
		this.currentStepAnimates[this.next] = stepAnimate
	}
	animateRun(styles: Styles = {}, config:StepConfig = {}, ref: any) {
		const el = ref || this.ref
		if (!el) return
		return new Promise((resolve) => {
			const time = +new Date()
			nvueAnimation.transition(el, {
				styles,
				...config
			}, () => {
				resolve(+new Date() - time)
			})
		})
	}
	nextAnimate(animates: StepAnimates, step: number = 0, ref: any, cb: Callback) {
		let obj = animates[step]
		if (obj) {
			let { styles, config } = obj
			// this.duration += config.duration
			this.animateRun(styles, config, ref).then((time: number) => {
				step += 1
				this.duration += time
				this.nextAnimate(animates, step, ref, cb)
			})
		} else {
			this.currentStepAnimates = {}
			cb && cb(this.duration)
		}
	}
	step(config:StepConfig = {}) {
		this.currentStepAnimates[this.next].config = Object.assign({}, this.options, config)
		this.currentStepAnimates[this.next].styles.transformOrigin = this.currentStepAnimates[this.next].config.transformOrigin
		this.next++
		return this
	}
	export(ref: any, cb?: Callback) {
		ref = ref || this.ref
		if(!ref) return
		this.duration = 0
		this.next = 0
		this.nextAnimate(this.currentStepAnimates, 0, ref, cb)
		return null
	}
}


animateTypes1.concat(animateTypes2, animateTypes3).forEach(type => {
	LimeAnimation.prototype[type] = function(...args: (string | number)[]) {
		this.addAnimate(type, args)
		return this
	}
})
// #endif
export function createAnimation(options : CreateAnimationOptions) {
	// #ifndef APP-NVUE
	// 在iOS10+QQ小程序平台下，传给原生的对象一定是个普通对象而不是Proxy对象，否则会报parameter should be Object instead of ProxyObject的错误
	return uni.createAnimation({ ...options })
	// #endif
	// #ifdef APP-NVUE
	return new LimeAnimation(options)
	// #endif
}