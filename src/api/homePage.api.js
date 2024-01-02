import service from "@/utils/request"


/**
 * @description 旅途风景上传
 * @url  /homePage/upload
 * */
export function FileUpdate(file) {
    const formData = new FormData();
    formData.append('image', file); // 'image' 应该对应后端接收文件的字段名
    return service.post('/homePage/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

/**
 * @description 获取所有旅途风景
 * @url  /homePage/getAlllandscapeImages
 * */
export function getAlllandscapeImages(params) {
    return service.get('/homePage/getAlllandscapeImages', params);
}


/**
 * @description 获取状态为1的旅途风景
 * @url  /homePage/getlandscapeImages
 * */
export function getlandscapeImages(params) {
    return service.get('/homePage/getlandscapeImages', params);
}

/**
 * @description 后台修改照片状态
 * @url  /homePage/Updstatus
 * */
export function Updstatus(params) {
    return service.post('/homePage/Updstatus', params);
}