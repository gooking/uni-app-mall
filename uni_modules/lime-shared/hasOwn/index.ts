// @ts-nocheck
const hasOwnProperty = Object.prototype.hasOwnProperty
/**
 * 检查对象或数组是否具有指定的属性或键
 * @param obj 要检查的对象或数组
 * @param key 指定的属性或键
 * @returns 如果对象或数组具有指定的属性或键，则返回true；否则返回false
 */
export function hasOwn(obj: Object | Array<any>, key: string): boolean {
  return hasOwnProperty.call(obj, key);
}

// 示例
// const obj = { name: 'John', age: 30 };

// if (hasOwn(obj, 'name')) {
//   console.log("对象具有 'name' 属性");
// } else {
//   console.log("对象不具有 'name' 属性");
// }
// // 输出: 对象具有 'name' 属性

// const arr = [1, 2, 3];

// if (hasOwn(arr, 'length')) {
//   console.log("数组具有 'length' 属性");
// } else {
//   console.log("数组不具有 'length' 属性");
// }
// 输出: 数组具有 'length' 属性