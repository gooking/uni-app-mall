// @ts-nocheck
// #ifdef MP-ALIPAY
interface My {
	SDKVersion: string
}
declare var my: My
// #endif

function compareVersion(v1:string, v2:string) {
  let a1 = v1.split('.');
  let a2 = v2.split('.');
  const len = Math.max(a1.length, a2.length);

  while (a1.length < len) {
    a1.push('0');
  }
  while (a2.length < len) {
    a2.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(a1[i], 10);
    const num2 = parseInt(a2[i], 10);

    if (num1 > num2) {
      return 1;
    }
    if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}

function gte(version: string) {
	let {SDKVersion} = uni.getSystemInfoSync();
	// #ifdef MP-ALIPAY
	SDKVersion = my.SDKVersion
	// #endif
	return compareVersion(SDKVersion, version) >= 0;
}

/** 环境是否支持canvas 2d */
export function canIUseCanvas2d() {
	// #ifdef MP-WEIXIN
	return gte('2.9.0');
	// #endif
	// #ifdef MP-ALIPAY
	return gte('2.7.0');
	// #endif
	// #ifdef MP-TOUTIAO
	return gte('1.78.0');
	// #endif
	// #ifndef MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO
	return false
	// #endif
}