// @ts-nocheck
/**
 * 检查一个值是否为字符串类型
 * @param str 要检查的值
 * @returns 如果值的类型是字符串类型，则返回 true；否则返回 false
 */
export const isString = (str: unknown): str is string => typeof str === 'string';