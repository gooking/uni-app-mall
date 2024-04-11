// @ts-nocheck

/**
 * 在给定数组中找到最接近目标数字的元素。
 * @param arr 要搜索的数字数组。
 * @param target 目标数字。
 * @returns 最接近目标数字的数组元素。
 */
export function closest(arr: number[], target: number) {
  return arr.reduce((pre, cur) =>
    Math.abs(pre - target) < Math.abs(cur - target) ? pre : cur
  );
}

// 示例
// // 定义一个数字数组
// const numbers = [1, 3, 5, 7, 9];

// // 在数组中找到最接近目标数字 6 的元素
// const closestNumber = closest(numbers, 6);

// console.log(closestNumber); // 输出结果: 5