import service from "@/utils/request"


/**
 * @description 获取所有状态为1的文章列表，根据分类筛选文章
 * @url  /article/visible
 * */
export function getart(params) {
    return service.post('/article/visible', params);
}
/**
 * @description 模糊搜索文章列表
 * @url  /article/searchArticles
 * */
export function searchArticles(params) {
    return service.post('/article/searchArticles', params);
}

/**
 * @description 获取所有状态的文章列表
 * @url  /article/articles
 * */
export function getarticles(params) {
    return service.get('/article/articles', params);
}

/**
 * @description 获取单篇文章
 * @url  /article/articlesID
 * */
export function getarticlesId(params) {
    return service.post('/article/articlesID', params);
}

/**
 * @description 修改文章内容
 * @url  /article/articles/updateArt
 * */
export function updateArticlesId(params) {
    return service.post('/article/updateArt', params);
}

/**
 * @description 获取全部分类列表
 * @url  /article/categories_List
 * */
export function getCategoriesList(params) {
    return service.get('/article/categories_List', params);
}

/**
 * @description 后台添加分类列表
 * @url  /article/categories
 * */
export function getCategories(params) {
    return service.post('/article/categories', params);
}

/**
 * @description 后台修改文章状态
 * @url  /article/articles/Updstatus
 * */
export function Updstatus(params) {
    return service.post('/article/Updstatus', params);
}

/**
 * @description 获取所有图片
 * @url  /article/getImages
 * */
export function GetImages(params) {
    return service.get('/article/getImages', params);
}

/**
 * @description 文件上传
 * @url  /article/articles/Updstatus
 * */
export function FileUpdate(file) {
    // return service.post('/article/upload', params);
    const formData = new FormData();
    formData.append('image', file); // 'image' 应该对应后端接收文件的字段名
    return service.post('/article/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}