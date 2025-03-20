import service from "@/utils/request"

/**
 * @description 获取所有用户信息
 * @url  /my/userinfo
 * */
/**
export function getUserMsg(params) {
    const formData = new URLSearchParams(params);
    return service.get('/my/userinfo', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": sessionStorage.token,
        },
    });
}
 * */
// 前端 API 请求函数（修正后）
export function getUserMsg(params) {
    return service.get('/my/userinfo', {
      params: params, // 将参数作为 GET 查询参数传递
      headers: {
        "Authorization": sessionStorage.token,
      }
    });
  }

/**
 * @description 添加用户信息
 * @url  /my/userinfo
 * */
export function addUserMsg(params) {
    const formData = new URLSearchParams(params);
    return service.post('/my/userinfo', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": sessionStorage.token,
        },
    });
}

/**
 * @description 修改用户密码
 * @url  /my/updatepwd
 * */
export function updUserPwd(params) {
    const formData = new URLSearchParams(params);
    return service.post('/my/updatepwd', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": sessionStorage.token,
        },
    });
}

/**
 * @description 后台修改用户状态
 * @url  /my/userUpdstatus
 * */
export function userUpdstatus(params) {
    return service.post('/my/userUpdstatus', params, {
        headers: {
            "Authorization": sessionStorage.token,
        },
    });
}

/**
 * @description 获取所有用户头像
 * @url  /my/getImages
 * */
export function GetImages(params) {
    return service.get('/my/getImages', params, {
        headers: {
            "Authorization": sessionStorage.token,
        },
    });
}

/**
 * @description 头像上传
 * @url  /my/upload
 * */
export function FileUpdate(file) {
    const formData = new FormData();
    formData.append('image', file); // 'image' 应该对应后端接收文件的字段名
    return service.post('/my/upload', formData, {
        headers: {
            "Authorization": sessionStorage.token,
            'Content-Type': 'multipart/form-data',
        },
    });
}

/**
 * @description 后台修改用户头像
 * @url  /my/update/avatar
 * */
export function userUpdAvatar(params) {
    return service.post('/my/update/avatar', params, {
        headers: {
            "Authorization": sessionStorage.token,
        },
    });
}

/**
 * @description 后台模糊搜索
 * @url  /my/userinfoSearch
 * */
export function userinfoSearch(params) {
    return service.post('/my/userinfoSearch', params, {
        headers: {
            "Authorization": sessionStorage.token,
        },
    });
}

/**
 * @description 后台用户注册
 * @url  /api/reguser
 * */
export function UserReg(params) {
    return service.post('/api/reguser', params);
}

/**
 * @description 登录后台
 * @url  /api/login
 * */
export function userlogin(params) {
    return service.post('/api/login', params);
}