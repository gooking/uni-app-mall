// @ts-nocheck
/** 获取当前页 */
export const getCurrentPage = () => {
  const pages = getCurrentPages();
  return pages[pages.length - 1] //as T & WechatMiniprogram.Page.TrivialInstance;
};