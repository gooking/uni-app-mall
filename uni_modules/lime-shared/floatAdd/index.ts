import {isNumber} from '../isNumber'
/**
 * 返回两个浮点数相加的结果
 * @param num1 第一个浮点数
 * @param num2 第二个浮点数
 * @returns 两个浮点数的相加结果
 */
export function floatAdd(num1: number, num2: number): number {
  // 检查 num1 和 num2 是否为数字类型
  if (!(isNumber(num1) || isNumber(num2))) {
    console.warn('Please pass in the number type');
    return NaN;
  }

  let r1: number, r2: number, m: number;

  try {
    // 获取 num1 小数点后的位数
    r1 = num1.toString().split('.')[1].length;
  } catch (error) {
    r1 = 0;
  }

  try {
    // 获取 num2 小数点后的位数
    r2 = num2.toString().split('.')[1].length;
  } catch (error) {
    r2 = 0;
  }

  // 计算需要扩大的倍数
  m = Math.pow(10, Math.max(r1, r2));

  // 返回相加结果
  return (num1 * m + num2 * m) / m;
}
