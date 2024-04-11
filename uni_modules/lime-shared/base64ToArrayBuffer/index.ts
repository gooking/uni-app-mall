// @ts-nocheck
// 未完成
export function base64ToArrayBuffer(base64 : string) {
	const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64) || [];
	if (!format) {
		new Error('ERROR_BASE64SRC_PARSE')
	}
	if(uni.base64ToArrayBuffer) {
		return uni.base64ToArrayBuffer(bodyData)
	} else {
		
	}
}