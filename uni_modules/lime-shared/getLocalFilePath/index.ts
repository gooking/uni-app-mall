// @ts-nocheck
export const getLocalFilePath = (path: string) => {
	if(typeof plus == 'undefined') return path
	if(/^(_www|_doc|_documents|_downloads|file:\/\/|\/storage\/emulated\/0\/)/.test(path)) return path
	if (/^\//.test(path)) {
		const localFilePath = plus.io.convertAbsoluteFileSystem(path)
		if (localFilePath !== path) {
			return localFilePath
		} else {
			path = path.slice(1)
		}
	}
	return '_www/' + path
}
