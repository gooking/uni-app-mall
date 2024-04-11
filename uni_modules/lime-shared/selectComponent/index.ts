// @ts-nocheck
interface SelectOptions {
	context?: any
	needAll?: boolean
	node?: boolean
}
// #ifdef MP
function selectMPComponent(key: string, name: string, context: any, needAll: boolean) {
	const {proxy, $vm} = context
	context = $vm || proxy
	if(!['ref','component'].includes(key)) {
		const queue = [context]
		let result = null
		const selector = (key == 'id' ? '#': '.') + name;
		while(queue.length > 0) {
			const child = queue.shift();
			const flag = child?.selectComponent(selector)
			if(flag) {
				if(!needAll) {return result = flag.$vm}
				return result = child.selectAllComponents(selector).map(item => item.$vm)
			} else {
				child.$children && (queue.push(...child.$children));
			}
		}
		return result
	} else {
		const {$templateRefs} = context.$
		const nameMap = {}
		for (var i = 0; i < $templateRefs.length; i++) {
			const item = $templateRefs[i]
			nameMap[item.i] = item.r
		}
		let result = []
		if(context.$children.length) {
			const queue = [...context.$children]
			while(queue.length > 0) {
				const child = queue.shift();
				if(key == 'component' && (child.type?.name === name || child.$?.type?.name === name)) {
					result.push(child)
				} else if(child.$refs && child.$refs[name]) {
					result = child.$refs[name]
				} else if(nameMap[child.id] === name){
					result.push(child)
				}  else {
					child.$children && (queue.push(...child.$children));
				}
				if(result.length && !needAll) {
					return;
				}
			}
		}
		return needAll ? result : result[0]
	}
}
// #endif
// #ifdef H5
function selectH5Component(key: string, name: string, context: any, needAll: boolean) {
	const {_, component } = context
	const child = {component: _ || component || context, children: null , subTree: null, props: null}
	let result = []
	let queue = [child]
	while(queue.length > 0 ) {
		const child = queue.shift()
		const {component, children , props, subTree} = child
		if(key === 'component' && component?.type?.name == name) {
			result.push(component)
		} else if(key === 'ref' && component && (props?.ref == name || component[key][name])) {
			if(props?.ref == name) {
				//exposed
				result.push(component)
			} else if(component[key][name]) {
				result.push(component[key][name])
			}
		} else if(key !== 'ref' && component?.exposed && new RegExp(`\\b${name}\\b`).test(component.attrs[key])) {
			// exposed
			result.push(component)
		} else if(children && Array.isArray(children)) {
			queue.push(...children)
		} else if(!component && subTree) {
			queue.push(subTree)
		} else if(component?.subTree) {
			queue.push(component.subTree)
		}
		if(result.length && !needAll) {
			break
		}
	}
	return needAll ? result : result[0]
}
// #endif
// #ifdef APP
function selectAPPComponent(key: string, name: string, context: any, needAll: boolean, node: boolean) {
	let result = []
	// const {_, component} = context
	// const child = {component: _ || component || context, children: null, props: null, subTree: null}
	const queue = [context]
	while(queue.length > 0) {
		const child = queue.shift()
		const {component, children, props, subTree} = child
		const isComp = component && props && component.exposed && !node
		if(key == 'component' && child.type && child.type.name === name) {
			result.push(component)
		} else if(props?.[key] === name && node) {
			result.push(child)
		} else if(key === 'ref' && isComp && (props.ref === name || props.ref_key === name)) {
			// exposed
			result.push(component)
		} else if(key !== 'ref' && isComp && new RegExp(`\\b${name}\\b`).test(props[key])) {
			// exposed
			result.push(component)
		}
		// else if(component && component.subTree && Array.isArray(component.subTree.children)){
		// 	queue.push(...component.subTree.children)
		// }
		else if(subTree) {
			queue.push(subTree)
		} else if(component && component.subTree){
			queue.push(component.subTree)
		} 
		 else if(children && Array.isArray(children)) {
			queue.push(...children)
		}
		if(result.length && !needAll) {
			break;
		}
	}
	return needAll ? result : result[0]
}
// #endif
export function selectComponent(selector: string, options: SelectOptions = {}) {
	// . class
	// # id
	// $ ref
	// @ component name
	const reg = /^(\.|#|@|\$)([a-zA-Z_0-9\-]+)$/;
	if(!reg.test(selector)) return null
	let { context, needAll, node} = options
	const [,prefix, name] = selector.match(reg)
	const symbolMappings  = {'.': 'class', '#': 'id', '$':'ref', '@':'component'}
	
	const key = symbolMappings [prefix] //prefix === '.' ? 'class' : prefix === '#' ? 'id' : 'ref';
	console.log('key', key)
	// #ifdef MP
	return selectMPComponent(key, name, context, needAll)
	// #endif
	// #ifdef H5
	return selectH5Component(key, name, context, needAll)
	// #endif
	// #ifdef APP
	return selectAPPComponent(key, name, context, needAll, node)
	// #endif
}