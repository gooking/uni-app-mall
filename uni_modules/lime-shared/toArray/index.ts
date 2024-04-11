// @ts-nocheck
/**
 * 将一个或多个元素转换为数组
 * @param item 要转换为数组的元素
 * @returns 转换后的数组
 */
export const toArray = <T>(item: T | T[]): T[] => Array.isArray(item) ? item : [item];

// 示例
// console.log(toArray(5)); // 输出: [5]
// console.log(toArray("hello")); // 输出: ["hello"]
// console.log(toArray([1, 2, 3])); // 输出: [1, 2, 3]
// console.log(toArray(["apple", "banana"])); // 输出: ["apple", "banana"]