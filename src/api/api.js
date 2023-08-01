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
 * @description 留言板发送评论请求
 * @url  /comment/comment
 * */
export function getComment(params) {
    return service.get('/comment/comments', params);
}

// 点赞区

/**
 * @description 将点赞数发送到后台保存
 * @url  /comment/comment
 * */
export function saveLikes(params) {
    return service.post('/likes/like', params);
}

/**
 * @description 获取点赞数
 * @url  /comment/comment
 * */
export function getLikes(params) {
    return service.get('/likes/likeCounts', params);
}