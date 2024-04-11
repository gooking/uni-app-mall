// @ts-nocheck
/**
 * 检查一个值是否为数字类型或表示数字的字符串
 * @param value 要检查的值，可以是 string 类型或 number 类型
 * @returns 如果值是数字类型或表示数字的字符串，则返回 true；否则返回 false
 */
export function isNumeric(value: string | number): boolean {
  return /^(-)?\d+(\.\d+)?$/.test(value);
}