// @ts-nocheck
import {isFunction} from '../isFunction'
import {isObject} from '../isObject'
/**
 * 检查一个值是否为 Promise 类型
 * @param val 要检查的值
 * @returns 如果值的类型是 Promise 类型，则返回 true；否则返回 false
 */
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  // 使用 isObject 函数判断值是否为对象类型
  // 使用 isFunction 函数判断值是否具有 then 方法和 catch 方法
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};