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