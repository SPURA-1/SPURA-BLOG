import service from "@/utils/request"


/**
 * @description 获取全部游戏列表
 * @url  /game/gamesList
 * */
export function getGamesList(params) {
    return service.get('/game/gamesList', params);
}


/**
 * @description 获取所有游戏封面
 * @url  /game/getGameImages
 * */
export function getGameImages(params) {
    return service.get('/game/getGameImages', params);
}

/**
 * @description 游戏封面上传
 * @url  /game/upload
 * */
export function FileUpdate(file) {
    const formData = new FormData();
    formData.append('image', file); // 'image' 应该对应后端接收文件的字段名
    return service.post('/game/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

/**
 * @description 获取俄罗斯方块数据
 * @url  /game/TetrisGame
 * */
export function getTetrisGame(params) {
    return service.get('/game/TetrisGame', params);
}

/**
 * @description 保存俄罗斯方块数据
 * @url  /game/TetrisGame
 * */
export function updTetrisGame(params) {
    return service.post('/game/TetrisGame', params);
}