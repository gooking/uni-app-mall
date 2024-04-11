// @ts-nocheck
/**
 * 延迟指定时间后解析的 Promise
 * @param delay 延迟的时间（以毫秒为单位），默认为 300 毫秒
 * @returns 一个 Promise，在延迟结束后解析
 */
export const sleep = (delay: number = 300) =>
  new Promise(resolve => setTimeout(resolve, delay));
  
  
// 示例  
// async function example() {
//   console.log("Start");

//   // 延迟 1 秒后执行
//   await sleep(1000);
//   console.log("1 second later");

//   // 延迟 500 毫秒后执行
//   await sleep(500);
//   console.log("500 milliseconds later");

//   // 延迟 2 秒后执行
//   await sleep(2000);
//   console.log("2 seconds later");

//   console.log("End");
// }

// example();