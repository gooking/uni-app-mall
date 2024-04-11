// @ts-nocheck

// #ifdef APP-PLUS
import { getLocalFilePath } from '../getLocalFilePath'
// #endif
function isImage(extension : string) {
	const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
	return imageExtensions.includes(extension.toLowerCase());
}
// #ifdef H5
function getSVGFromURL(url: string) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'text';

		xhr.onload = function () {
			if (xhr.status === 200) {
				const svg = xhr.responseText;
				resolve(svg);
			} else {
				reject(new Error(xhr.statusText));
			}
		};

		xhr.onerror = function () {
			reject(new Error('Network error'));
		};

		xhr.send();
	});
}
// #endif
/**
 * 路径转base64
 * @param {Object} string
 */
export function pathToBase64(path : string) : Promise<string> {
	if (/^data:/.test(path)) return path
	let extension = path.substring(path.lastIndexOf('.') + 1);
	const isImageFile = isImage(extension)
	let prefix = ''
	if (isImageFile) {
		prefix = 'image/';
		if(extension == 'svg') {
			extension += '+xml'
		}
	} else if (extension === 'pdf') {
		prefix = 'application/pdf';
	} else if (extension === 'txt') {
		prefix = 'text/plain';
	} else {
		// 添加更多文件类型的判断
		// 如果不是图片、PDF、文本等类型，可以设定默认的前缀或采取其他处理
		prefix = 'application/octet-stream';
	}
	return new Promise((resolve, reject) => {
		// #ifdef H5
		if (isImageFile) {
			if(extension == 'svg') {
				getSVGFromURL(path).then(svg => {
					const base64 = btoa(svg);
					resolve(`data:image/svg+xml;base64,${base64}`);
				})
			} else {
				let image = new Image();
				image.setAttribute("crossOrigin", 'Anonymous');
				image.onload = function () {
					let canvas = document.createElement('canvas');
					canvas.width = this.naturalWidth;
					canvas.height = this.naturalHeight;
					canvas.getContext('2d').drawImage(image, 0, 0);
					let result = canvas.toDataURL(`${prefix}${extension}`)
					resolve(result);
					canvas.height = canvas.width = 0
				}
				image.src = path + '?v=' + Math.random()
				image.onerror = (error) => {
					reject(error);
				};
			}
			
		} else {
			reject('not image');
		}

		// #endif

		// #ifdef MP
		if (uni.canIUse('getFileSystemManager')) {
			uni.getFileSystemManager().readFile({
				filePath: path,
				encoding: 'base64',
				success: (res) => {
					resolve(`data:${prefix}${extension};base64,${res.data}`)
				},
				fail: (error) => {
					console.error({ error, path })
					reject(error)
				}
			})
		}
		// #endif

		// #ifdef APP-PLUS
		plus.io.resolveLocalFileSystemURL(getLocalFilePath(path), (entry) => {
			entry.file((file : any) => {
				const fileReader = new plus.io.FileReader()
				fileReader.onload = (data) => {
					resolve(data.target.result)
				}
				fileReader.onerror = (error) => {
					console.error({ error, path })
					reject(error)
				}
				fileReader.readAsDataURL(file)
			}, reject)
		}, reject)
		// #endif
	})
}