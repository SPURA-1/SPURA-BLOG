import axios from 'axios'
import router from '../router/index'
import { Message } from 'element-ui'
import Vue from 'vue'
// 配置axios实例
// URL(绝对的) = baseURL + url(相对的)
const service = axios.create({
  // baseURL : "http://127.0.0.1:80",
  //配置对象
  baseURL: 'http://47.115.231.184:5555',
  // baseURL: '/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*'
  }
});

// 请求拦截器
// 请求拦截器
service.interceptors.request.use(config => {
  console.log(config, 'config');
  if (config.FORMDATA) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else if (config.FORM) {
    config.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
  }
  // 为请求头对象，添加 Token 验证的 Authorization 字段
  const token = sessionStorage.getItem('token')
  if (token) {
    console.log(token, 'youtoken');
    config.headers.Authorization = token
  }
  return config;
}, error => {
  return Promise.reject(error);
});


// 拦截器 检测到401状态码 返回Error
// 后续加一个Error页面
// 拦截器 检测到401状态码 返回Error
service.interceptors.response.use(
  response => response,
  error => {
    const { response } = error; // 从错误对象中提取响应信息
    const { status, data } = response;
    const { message } = data;
    Message.error(message);
    if (status) {
      console.log(status, 'status');
      switch (status) {
        case 400:
          // Message.error("请求错误(400)，请重新申请");
          break;
        case 401:
          Message.error("登录错误(401)，请重新登录");
          router.replace("/login"); // 使用router进行路由跳转
          break;
        case 403:
          Message.error("拒绝访问(403)");
          break;
        case 404:
          Message.error("请求出错(404)");
          break;
        case 408:
          Message.error("请求超时(408)");
          break;
        case 500:
          Message.error("服务器错误(500)，请重启软件或切换功能页！");
          break;
        case 501:
          Message.error("服务未实现(501)");
          break;
        case 502:
          Message.error("网络错误(502)");
          break;
        case 503:
          Message.error("服务不可用(503)");
          break;
        case 504:
          Message.error("网络超时(504)");
          break;
        case 505:
          Message.error("HTTP版本不受支持(505)");
          break;
        default:
          Message.error("网络连接出错");
      }
    } else {
      Message.error("连接服务器失败,请退出重试!");
    }
    return Promise.reject(error);
  }
);

// 使用 Vue.prototype.$http = service，那么在每个组件中都可以直接使用 this.$http，省去了导入和设置的过程
// Vue.prototype.$http = service
// 没有将 request 实例设置为 Vue 的原型属性，所以需要在每个组件中导入和使用。
export default service
// export {
// 	GET,
// 	POST
// }