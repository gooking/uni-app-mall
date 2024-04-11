/**
 * 将字符串转换为 camelCase 或 PascalCase 风格的命名约定
 * @param str 要转换的字符串
 * @param isPascalCase 指示是否转换为 PascalCase 的布尔值，默认为 false
 * @returns 转换后的字符串
 */
export function camelCase(str: string, isPascalCase: boolean = false): string {
    // 将字符串分割成单词数组
    let words: string[] = str.split(/[\s_-]+/);
  
    // 将数组中的每个单词首字母大写（除了第一个单词）
    let camelCased: string[] = words.map((word, index) => {
      if (index === 0 && !isPascalCase) {
        return word.toLowerCase(); // 第一个单词全小写
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  
    // 将数组中的单词拼接成一个字符串
    return camelCased.join('');
};