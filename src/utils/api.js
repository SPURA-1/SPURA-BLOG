import axiosService from './request'

// 下面是POST形式 用户登录
export const userLogin = data => {
  return axiosService({
  url: "http://127.0.0.1/api/login", // 根据实际接口地址来写
  method: "post",
  data: params,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
 };
  
 // 下面是GET形式
 export const userInfo = params => {
  return axiosService({
  url: "my/article/cates", // 根据实际接口地址来写
  method: "get",
  params
  });
 };