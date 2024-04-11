// @ts-nocheck
/**
 * 深度克隆一个对象或数组
 * @param obj 要克隆的对象或数组
 * @returns 克隆后的对象或数组
 */
export function cloneDeep<T>(obj: any): T {
  // 如果传入的对象为空，返回空
  if (obj === null) {
    return null as unknown as T;
  }

  // 如果传入的对象是 Set 类型，则将其转换为数组，并通过新的 Set 构造函数创建一个新的 Set 对象
  if (obj instanceof Set) {
    return new Set([...obj]) as unknown as T;
  }

  // 如果传入的对象是 Map 类型，则将其转换为数组，并通过新的 Map 构造函数创建一个新的 Map 对象
  if (obj instanceof Map) {
    return new Map([...obj]) as unknown as T;
  }

  // 如果传入的对象是 WeakMap 类型，则直接用传入的 WeakMap 对象进行赋值
  if (obj instanceof WeakMap) {
    let weakMap = new WeakMap();
    weakMap = obj;
    return weakMap as unknown as T;
  }

  // 如果传入的对象是 WeakSet 类型，则直接用传入的 WeakSet 对象进行赋值
  if (obj instanceof WeakSet) {
    let weakSet = new WeakSet();
    weakSet = obj;
    return weakSet as unknown as T;
  }

  // 如果传入的对象是 RegExp 类型，则通过新的 RegExp 构造函数创建一个新的 RegExp 对象
  if (obj instanceof RegExp) {
    return new RegExp(obj) as unknown as T;
  }

  // 如果传入的对象是 undefined 类型，则返回 undefined
  if (typeof obj === 'undefined') {
    return undefined as unknown as T;
  }

  // 如果传入的对象是数组，则递归调用 cloneDeep 函数对数组中的每个元素进行克隆
  if (Array.isArray(obj)) {
    return obj.map(cloneDeep) as unknown as T;
  }

  // 如果传入的对象是 Date 类型，则通过新的 Date 构造函数创建一个新的 Date 对象
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  // 如果传入的对象是普通对象，则使用递归调用 cloneDeep 函数对对象的每个属性进行克隆
  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = cloneDeep(value);
    }
    const symbolKeys = Object.getOwnPropertySymbols(obj);
    for (const key of symbolKeys) {
      newObj[key] = cloneDeep(obj[key]);
    }
    return newObj;
  }

  // 如果传入的对象是基本数据类型（如字符串、数字等），则直接返回
  return obj;
}

// 示例使用

// // 克隆一个对象
// const obj = { name: 'John', age: 30 };
// const clonedObj = cloneDeep(obj);

// console.log(clonedObj); // 输出: { name: 'John', age: 30 }
// console.log(clonedObj === obj); // 输出: false (副本与原对象是独立的)

// // 克隆一个数组
// const arr = [1, 2, 3];
// const clonedArr = cloneDeep(arr);

// console.log(clonedArr); // 输出: [1, 2, 3]
// console.log(clonedArr === arr); // 输出: false (副本与原数组是独立的)

// // 克隆一个包含嵌套对象的对象
// const person = {
//   name: 'Alice',
//   age: 25,
//   address: {
//     city: 'New York',
//     country: 'USA',
//   },
// };
// const clonedPerson = cloneDeep(person);

// console.log(clonedPerson); // 输出: { name: 'Alice', age: 25, address: { city: 'New York', country: 'USA' } }
// console.log(clonedPerson === person); // 输出: false (副本与原对象是独立的)
// console.log(clonedPerson.address === person.address); // 输出: false (嵌套对象的副本也是独立的)