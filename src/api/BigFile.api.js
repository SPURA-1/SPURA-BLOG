import service from "@/utils/request"


/**
 * @description 获取文件上传列表
 * @url  /bigFile/files
 * */
export function getBigFileList(params) {
    return service.get('/bigFile/files', params);
}

/**
 * @description 核对文件上传列表的信息
 * @url  /bigFile/check
 * */
export function checkBigFileList(params) {
    return service.get('/bigFile/check', params);
}

/**
 * @description 上传文件切片
 * @url  /bigFile/upload
 * */
export function uploadBigFileList(params) {
    return service.post('/bigFile/upload', params);
}

/**
 * @description 后端合并文件切片
 * @url  /bigFile/merge
 * */
export function mergeBigFile(params) {
    return service.post('/bigFile/merge', params);
}

/**
 * @description 修改文件状态（软删除）
 * @url  /bigFile/files/status
 * */
export function BigFileStatus(params) {
    return service.post('/bigFile/files/status', params);
}

/**
 * @description 删除文件（硬删除）
 * @url  /bigFile/files/${file.id}
 * */
export function delBigFile(params) {
    return service.delete(`/bigFile/files/${file.id}`, params);
}