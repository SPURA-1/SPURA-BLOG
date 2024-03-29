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
 * @description 获取最近发布的前三篇文章
 * @url  /article/newArticles
 * */
export function getNewArticles(params) {
    return service.get('/article/newArticles', params);
}
/**
 * @description 获取最近发布的前两篇文章
 * @url  /article/newArticleTwo
 * */
export function getNewArticlesTwo(params) {
    return service.get('/article/newArticlesTwo', params);
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
 * @url  /article/updateArt
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
 * @description 获取文章分类的各个数量
 * @url  /article/categorycount
 * */
export function getCategorycount(params) {
    return service.get('/article/categorycount', params);
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
 * @description 获取所有文章封面
 * @url  /article/getImages
 * */
export function GetImages(params) {
    return service.get('/article/getImages', params);
}

/**
 * @description 文件上传
 * @url  /article/upload
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

/**
 * @description 文章内图片上传
 * @url  /article/contentupload
 * */
export function FileContentUpLoad(file) {
    const formData = new FormData();
    formData.append('image', file); // 'image' 应该对应后端接收文件的字段名
    return service.post('/article/contentupload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

/**
 * @description 后台发表文章
 * @url  /article/articles
 * */
export function PublishArt(params) {
    return service.post('/article/articles', params);
}