// @ts-nocheck
/**
 * 检查一个值是否为数字类型
 * @param value 要检查的值，可以是 number 类型或 string 类型的数字
 * @returns 如果值是数字类型且不是 NaN，则返回 true；否则返回 false
 */
export function isNumber(value: number | string): boolean {
  return typeof value === 'number' && !isNaN(value);
}