// @ts-nocheck

// #ifdef APP-NVUE
// 当编译环境是 APP-NVUE 时，引入 uni.requireNativePlugin('dom')，具体插件用途未知
const dom = uni.requireNativePlugin('dom')
// #endif

interface RectOptions {
  /**
   * 上下文
   */
  context ?: any // ComponentInternalInstance 类型，用于指定上下文

  /**
   * 是否需要获取所有节点，nvue 环境下不支持
   */
  needAll ?: boolean,

  /**
   * 节点引用对象，类型为 UniNamespace.NodesRef
   */
  nodes ?: UniNamespace.NodesRef

  /**
   * 节点引用对象的键，类型为 UniNamespace.NodesRef 中的某个键
   */
  type ?: keyof UniNamespace.NodesRef
}

/** 
 * 获取节点信息
 * @param selector 选择器字符串
 * @param options RectOptions 对象，用于配置选项
 * @returns 包含节点信息的 Promise 对象
 */
export function getRect(selector : string, options : RectOptions = {}) {
	// #ifndef APP-NVUE
	const typeDefault = 'boundingClientRect'
	let { context, needAll, type = typeDefault } = options
	// #endif

	// #ifdef MP || VUE2
	if (context.proxy) context = context.proxy
	// #endif

	return new Promise<UniNamespace.NodeInfo>((resolve, reject) => {
		// #ifndef APP-NVUE
		const dom = uni.createSelectorQuery().in(context)[needAll ? 'selectAll' : 'select'](selector);
		const result = (rect: UniNamespace.NodeInfo) => {
			if (rect) {
				resolve(rect)
			} else {
				reject('no rect')
			}
		}
		if (type == typeDefault) {
			dom[type](result).exec()
		} else {
			dom[type]({
				node: true,
				size: true,
				rect: true
			}, result).exec()
		}
		// #endif
		// #ifdef APP-NVUE
		let { context } = options
		if (/#|\./.test(selector) && context.refs) {
			selector = selector.replace(/#|\./, '')
			if (context.refs[selector]) {
				selector = context.refs[selector]
				if(Array.isArray(selector)) {
					selector = selector[0]
				}
			}
		}
		dom.getComponentRect(selector, (res) => {
			if (res.size) {
				resolve(res.size)
			} else {
				reject('no rect')
			}
		})
		// #endif
	});
};