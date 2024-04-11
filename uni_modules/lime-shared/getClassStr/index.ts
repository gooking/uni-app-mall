// @ts-nocheck
/**
 * 获取对象的类名字符串
 * @param obj - 需要处理的对象
 * @returns 由对象属性作为类名组成的字符串
 */
export function getClassStr<T>(obj: T): string {
  let classNames: string[] = [];
  
  // 遍历对象的属性
  for (let key in obj) {
    // 检查属性确实属于对象自身且其值为true
    if ((obj as any).hasOwnProperty(key) && obj[key]) {
      // 将属性名添加到类名数组中
      classNames.push(key);
    }
  }
  
  // 将类名数组用空格连接成字符串并返回
  return classNames.join(' ');
}


// 示例
// const obj = { foo: true, bar: false, baz: true };
// const classNameStr = getClassStr(obj);
// console.log(classNameStr); // 输出: "foo baz"