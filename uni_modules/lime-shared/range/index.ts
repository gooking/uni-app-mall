// @ts-nocheck
/**
 * 生成一个数字范围的数组
 * @param start 范围的起始值
 * @param end 范围的结束值
 * @param step 步长，默认为 1
 * @param fromRight 是否从右侧开始生成，默认为 false
 * @returns 生成的数字范围数组
 */
export function range(start: number, end: number, step: number = 1, fromRight: boolean = false): number[] {
  let index = -1;
  // 计算范围的长度
  let length = Math.max(Math.ceil((end - start) / (step || 1)), 0);
  // 创建一个长度为 length 的数组
  const result = new Array(length);

  // 使用循环生成数字范围数组
  while (length--) {
    // 根据 fromRight 参数决定从左侧还是右侧开始填充数组
    result[fromRight ? length : ++index] = start;
    start += step;
  }

  return result;
}


// 示例
// console.log(range(0, 5)); // 输出: [0, 1, 2, 3, 4]
// console.log(range(1, 10, 2, true)); // 输出: [9, 7, 5, 3, 1]
// console.log(range(5, 0, -1)); // 输出: [5, 4, 3, 2, 1]