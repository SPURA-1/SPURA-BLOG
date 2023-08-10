import service from "@/utils/request"


/**
 * @description 获取所有状态为1的文章列表
 * @url  /article/articles/visible
 * */
export function getart(params) {
    return service.get('/article/articles/visible', params);
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
 * @url  /article/articles/:id
 * */
export function getarticlesId(params) {
    return service.get('/article/articles/:id', params);
}

/**
 * @description 修改文章内容
 * @url  /article/articles/update/:id
 * */
export function updateArticlesId(params) {
    return service.post('/article/articles/update/:id', params);
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
    return service.post('/article/articles/Updstatus', params);
}