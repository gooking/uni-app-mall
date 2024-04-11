// @ts-nocheck
/**
 * 判断给定的路径是否为Base64编码的图像路径
 * @param path 图像路径
 * @returns 如果路径是Base64编码，则返回true；否则返回false
 */
export const isBase64 = (path: string): boolean => {
  return /^data:image\/(\w+);base64/.test(path);
};