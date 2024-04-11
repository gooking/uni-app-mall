// @ts-nocheck
/**
 * 生成一个指定范围内的随机数
 * @param min 随机数的最小值
 * @param max 随机数的最大值
 * @param fixed 随机数的小数位数，默认为 0
 * @returns 生成的随机数
 */
export function random(min: number, max: number, fixed: number = 0) {
  // 将 min 和 max 转换为数字类型
  min = +min || 0;
  max = +max || 0;
  // 计算随机数范围内的一个随机数
  const num = Math.random() * (max - min) + min;
  // 如果 fixed 参数为 0，则返回四舍五入的整数随机数；否则保留固定小数位数
  return fixed == 0 ? Math.round(num) : Number(num.toFixed(fixed));
}

// 示例
// console.log(random(0, 10)); // 输出：在 0 和 10 之间的一个整数随机数
// console.log(random(0, 1, 2)); // 输出：在 0 和 1 之间的一个保留两位小数的随机数
// console.log(random(1, 100, 3)); // 输出：在 1 和 100 之间的一个保留三位小数的随机数