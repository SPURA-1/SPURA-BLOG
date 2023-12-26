import service from "@/utils/request"

// 留言板

/**
 * @description 留言板发送评论请求
 * @url  /comment/comment
 * */
export function sendComment(params) {
    // return service.post('/comment/comment', params);
    const formData = new URLSearchParams(params);
    return service.post('/comment/comment', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
}

/**
 * @description 留言板评论详情
 * @url  /comment/comments
 * */
export function getComment(params) {
    return service.get('/comment/comments', params);
}

/**
 * @description 留言板评论状态显示详情
 * @url  /comment//Updstatus
 * */
export function Updstatus(params) {
    return service.post('/comment//Updstatus', params);
}

/**
 * @description 留言板评论加载更多
 * @url  /comment/getMoreComments
 * */
export function getMoreComments(params) {
    return service.post('/comment/getMoreComments', params);
}

// 点赞区

/**
 * @description 将点赞数发送到后台保存
 * @url  /likes/like
 * */
export function saveLikes(params) {
    return service.post('/likes/like', params);
}

/**
 * @description 获取点赞数
 * @url  /likes/likeCounts
 * */
export function getLikes(params) {
    return service.get('/likes/likeCounts', params);
}