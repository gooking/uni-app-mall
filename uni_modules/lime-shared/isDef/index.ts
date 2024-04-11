// @ts-nocheck
/**
 * 检查一个值是否已定义（不为 undefined）且不为 null
 * @param value 要检查的值
 * @returns 如果值已定义且不为 null，则返回 true；否则返回 false
 */
export function isDef(value: unknown): boolean {
  return value !== undefined && value !== null;
}