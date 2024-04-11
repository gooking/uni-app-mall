// @ts-nocheck
/**
 * 节流函数，用于限制函数的调用频率
 * @param fn 要进行节流的函数
 * @param delay 两次调用之间的最小间隔时间
 * @returns 节流后的函数
 */
export function throttle(fn: (...args: any[]) => void, delay: number) {
  let flag = true; // 标记是否可以执行函数

  return (...args: any[]) => {
    if (flag) {
      flag = false; // 设置为不可执行状态
      fn(...args); // 执行传入的函数

      setTimeout(() => {
        flag = true; // 经过指定时间后，设置为可执行状态
      }, delay);
    }
  };
}


// // 示例
// // 定义一个被节流的函数
// function handleScroll() {
//   console.log("Scroll event handled!");
// }

// // 使用节流函数对 handleScroll 进行节流，间隔时间为 500 毫秒
// const throttledScroll = throttle(handleScroll, 500);

// // 模拟多次调用 handleScroll
// throttledScroll(); // 输出 "Scroll event handled!"
// throttledScroll(); // 不会输出
// throttledScroll(); // 不会输出

// // 经过 500 毫秒后，再次调用 handleScroll
// setTimeout(() => {
//   throttledScroll(); // 输出 "Scroll event handled!"
// }, 500);