import service from "@/utils/request"


/**
 * @description 登录
 * @url  /api/login
 * */
export function UserLogin(params) {
    return service.post('/api/login', params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
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
 * @description 登录验证码
 * @url  /api/reguser
 * */
export function UserCaptcha(params) {
    return service.get('/api/captcha', params);
}
