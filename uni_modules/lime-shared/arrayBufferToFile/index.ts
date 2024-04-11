// @ts-nocheck
import {platform} from '../platform'
/**
 * buffer转路径
 * @param {Object} buffer
 */
// @ts-nocheck
export function arrayBufferToFile(buffer: ArrayBuffer | Blob, name?: string, format?:string):Promise<(File|string)> {
	return new Promise((resolve, reject) => {
		// #ifdef MP
		const fs = uni.getFileSystemManager()
		//自定义文件名
		if (!name && !format) {
			reject(new Error('ERROR_NAME_PARSE'))
		}
		const fileName = `${name || new Date().getTime()}.${format.replace(/(.+)?\//,'')}`;
		let pre = platform()
		const filePath = `${pre.env.USER_DATA_PATH}/${fileName}`
		fs.writeFile({
			filePath,
			data: buffer, 
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
		const file = new File([buffer], name, {
		     type: format,
		});
		resolve(file)
		// #endif

		// #ifdef APP-PLUS
		const bitmap = new plus.nativeObj.Bitmap('bitmap' + Date.now())
		const base64 = uni.arrayBufferToBase64(buffer)
		bitmap.loadBase64Data(base64, () => {
			if (!name && !format) {
				reject(new Error('ERROR_NAME_PARSE'))
			}
			const fileNmae = `${name || new Date().getTime()}.${format.replace(/(.+)?\//,'')}`;
			const filePath = `_doc/uniapp_temp/${fileNmae}`
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