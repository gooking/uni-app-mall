// @ts-nocheck
/**
 * 在数字前填充零，返回字符串形式的结果
 * @param number 要填充零的数字
 * @param length 填充零后的字符串长度，默认为2
 * @returns 填充零后的字符串
 */
export function fillZero(number: number, length: number = 2): string {
  // 将数字转换为字符串，然后使用 padStart 方法填充零到指定长度
  return `${number}`.padStart(length, '0');
}