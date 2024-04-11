// @ts-nocheck
/**
 * 检查一个值是否为对象类型
 * @param val 要检查的值
 * @returns 如果值的类型是对象类型，则返回 true；否则返回 false
 */
export const isObject = (val : unknown) : val is Record<any, any> =>
	val !== null && typeof val === 'object';