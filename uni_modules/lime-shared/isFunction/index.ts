// @ts-nocheck
/**
 * 检查一个值是否为函数类型
 * @param val 要检查的值
 * @returns 如果值的类型是函数类型，则返回 true；否则返回 false
 */
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function';