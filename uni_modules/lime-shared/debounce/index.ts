// @ts-nocheck
type Timeout = ReturnType<typeof setTimeout> | null;
/**
 * 防抖函数，通过延迟一定时间来限制函数的执行频率。
 * @param fn 要防抖的函数。
 * @param wait 触发防抖的等待时间，单位为毫秒。
 * @returns 防抖函数。
 */
export function debounce(fn: (...args: any[]) => void, wait = 300) {
  let timer: Timeout = null; // 用于存储 setTimeout 的标识符的变量

  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer); // 如果上一个 setTimeout 存在，则清除它

    // 设置一个新的 setTimeout，在指定的等待时间后调用防抖函数
    timer = setTimeout(() => {
      fn.apply(this, args); // 使用提供的参数调用原始函数
    }, wait);
  };
};



// 示例
// 定义一个函数
// function saveData(data: string) {
//   // 模拟保存数据的操作
//   console.log(`Saving data: ${data}`);
// }

// // 创建一个防抖函数，延迟 500 毫秒后调用 saveData 函数
// const debouncedSaveData = debounce(saveData, 500);

// // 连续调用防抖函数
// debouncedSaveData('Data 1'); // 不会立即调用 saveData 函数
// debouncedSaveData('Data 2'); // 不会立即调用 saveData 函数

// 在 500 毫秒后，只会调用一次 saveData 函数，输出结果为 "Saving data: Data 2"