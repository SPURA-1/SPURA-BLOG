import service from "@/utils/request"

/**
 * @description 获取所有用户信息
 * @url  /my/userinfo
 * */
export function getUserMsg(params) {
    const formData = new URLSearchParams(params);
    return service.get('/my/userinfo', formData, {
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