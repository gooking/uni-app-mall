// @ts-nocheck
/**
 * 将字符串转换为数字
 * @param val 要转换的字符串
 * @returns 转换后的数字或原始字符串
 */
export function toNumber(val: string): number | string {
  const n = parseFloat(val); // 使用 parseFloat 函数将字符串转换为浮点数
  return isNaN(n) ? val : n; // 使用 isNaN 函数判断是否为非数字，返回转换后的数字或原始字符串
}

// 示例
// console.log(toNumber("123")); // 输出: 123
// console.log(toNumber("3.14")); // 输出: 3.14
// console.log(toNumber("hello")); // 输出: "hello"