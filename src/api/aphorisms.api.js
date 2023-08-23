import service from "@/utils/request"


/**
 * @description 获取随机三句名人名言
 * @url  /aphorism/aphorisms
 * */
export function getAphorisms(params) {
    return service.get('/aphorism/aphorisms', params);
}