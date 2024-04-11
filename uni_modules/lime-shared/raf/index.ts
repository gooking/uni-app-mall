// @ts-nocheck
import {isBrowser} from '../isBrowser'

// 是否支持被动事件监听
export const supportsPassive = true;

// 请求动画帧
export function raf(fn: FrameRequestCallback): number {
  // 如果是在浏览器环境下，使用 requestAnimationFrame 方法
  if (isBrowser) {
    return requestAnimationFrame(fn); // 请求动画帧
  } else { // 在非浏览器环境下，使用 setTimeout 模拟
    return setTimeout(fn, 1000 / 30); // 使用 setTimeout 模拟动画帧，每秒钟执行 30 次
  }
}

// 取消动画帧
export function cancelRaf(id: number) {
  // 如果是在浏览器环境下，使用 cancelAnimationFrame 方法
  if (isBrowser) {
    cancelAnimationFrame(id); // 取消动画帧
  } else { // 在非浏览器环境下，使用 clearTimeout 模拟
    clearTimeout(id); // 使用 clearTimeout 模拟取消动画帧
  }
}

// 双倍动画帧
export function doubleRaf(fn: FrameRequestCallback): void {
  raf(() => raf(fn)); // 在下一帧回调中再次请求动画帧，实现双倍动画帧效果
}