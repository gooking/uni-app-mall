// @ts-nocheck
import {platform} from '../platform'
/**
 * base64转路径
 * @param {Object} base64
 */
export function base64ToPath(base64: string, filename?: string):Promise<string> {
	const [, format] = /^data:image\/(\w+);base64,/.exec(base64) || [];
	console.log('format', format)
	return new Promise((resolve, reject) => {
		// #ifdef MP
		const fs = uni.getFileSystemManager()
		//自定义文件名
		if (!filename && !format) {
			reject(new Error('ERROR_BASE64SRC_PARSE'))
		}
		// const time = new Date().getTime();
		const name = filename || `${new Date().getTime()}.${format}`;
		let pre = platform()
		const filePath = `${pre.env.USER_DATA_PATH}/${name}`
		fs.writeFile({
			filePath,
			data: base64.split(',')[1], 
			encoding: 'base64',
			success() {
				resolve(filePath)
			},
			fail(err) {
				console.error(err)
				reject(err)
			}
		})
		// #endif

		// #ifdef H5
		// mime类型
		let mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
		//base64 解码
		let byteString = atob(base64.split(',')[1]);
		//创建缓冲数组
		let arrayBuffer = new ArrayBuffer(byteString.length);
		//创建视图
		let intArray = new Uint8Array(arrayBuffer);
		for (let i = 0; i < byteString.length; i++) {
			intArray[i] = byteString.charCodeAt(i);
		}
		resolve(URL.createObjectURL(new Blob([intArray], {
			type: mimeString
		})))
		// #endif

		// #ifdef APP-PLUS
		const bitmap = new plus.nativeObj.Bitmap('bitmap' + Date.now())
		bitmap.loadBase64Data(base64, () => {
			if (!filename && !format) {
				reject(new Error('ERROR_BASE64SRC_PARSE'))
			}
			// const time = new Date().getTime();
			const name = filename || `${new Date().getTime()}.${format}`;
			const filePath = `_doc/uniapp_temp/${name}`
			bitmap.save(filePath, {},
				() => {
					bitmap.clear()
					resolve(filePath)
				},
				(error) => {
					bitmap.clear()
					reject(error)
				})
		}, (error) => {
			bitmap.clear()
			reject(error)
		})
		// #endif
	})
}