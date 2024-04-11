import { watch, unref, Ref } from "../vue"
// #ifdef APP-NVUE
// const dom = weex.requireModule('dom')
// const dom = uni.requireNativePlugin('dom')  
// #endif

interface UseIntersectionObserverOptions {
	root ?: string; // 观察器的根元素选择器字符串
	rootMargin ?: {
		top ?: number; // 根元素顶部边距
		bottom ?: number; // 根元素底部边距
		left ?: number; // 根元素左侧边距
		right ?: number; // 根元素右侧边距
	}; // 根元素的边距
	thresholds ?: any[]; // 交叉比例数组，用于指定何时触发回调函数
	context ?: any; // 上下文对象，用于指定观察器的上下文
	initialRatio ?: number; // 初始的交叉比例
	observeAll ?: boolean; // 是否同时观察所有交叉对象
}

/**
 * 使用 Intersection Observer 观察元素可见性的自定义钩子函数
 * @param {Ref<string> | string} target - 目标元素，可以是一个字符串或 ref 对象
 * @param {(result: UniNamespace.ObserveResult) => void} callback - 回调函数，当目标元素的可见性发生变化时调用
 * @param {UseIntersectionObserverOptions} options - 可选的配置参数
 * @returns {Object} - 包含 stop 方法的对象，用于停止观察
 */
export function useIntersectionObserver(
	target : Ref<string> | string,
	callback : (result : UniNamespace.ObserveResult) => void,
	options : UseIntersectionObserverOptions = {}) {
	const {
		root, // 观察器的根元素选择器
		rootMargin = { top: 0, bottom: 0 }, // 根元素的边距，默认为顶部和底部都为0
		thresholds = [0], // 交叉比例数组，默认为[0]
		initialRatio = 0, // 初始交叉比例，默认为0
		observeAll = false, // 是否同时观察所有交叉对象，默认为false
		context // 上下文对象，用于指定观察器的上下文
	} = options
	const noop = () => { }; // 空函数，用于初始化 cleanup
	let cleanup = noop; // 清理函数，用于停止 Intersection Observer 的观察

	const stopWatch = watch(() => ({ el: unref(target), root: unref(root) }), ({ el, root }) => {
		if (!el) {
			return
		}
		// #ifndef APP-NVUE
		// 创建 Intersection Observer 实例
		const observer = uni.createIntersectionObserver(context, { thresholds, initialRatio, observeAll })
		if (root) {
			// 相对于根元素设置边界
			observer.relativeTo(root, rootMargin) 
		} else {
			// 相对于视口设置边界
			observer.relativeToViewport(rootMargin)
		}
		// 观察目标元素的可见性变化
		observer.observe(el, callback)
		cleanup = () => {
			// 停止观察
			observer.disconnect()
			// 将 cleanup 函数重置为空函数
			cleanup = noop
		}
		// #endif
		// #ifdef APP-NVUE
		// dom.getComponentRect(el, (res) => {
		// 	console.log('res', res)
		// })
		// #endif
	}, { immediate: true, flush: 'post' })

	const stop = () => {
		// 调用 cleanup 函数停止观察
		cleanup && cleanup()
		// 停止 watch
		stopWatch && stopWatch()
	}

	return { stop }
}