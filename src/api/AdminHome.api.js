import service from "@/utils/request"


/**
 * @description 获取四个表的数量
 * @url  /adminPage/dataSummary
 * */
export function getAdminData(params) {
    return service.get('/adminPage/dataSummary', params);
}