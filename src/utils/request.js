import axios from 'axios'
import router from '../router/index'
import { Message } from 'element-ui'
import Vue from 'vue'
// 配置axios实例
// URL(绝对的) = baseURL + url(相对的)
const service = axios.create({
  baseURL : "http://127.0.0.1:80",
  timeout : 5000
})

// 请求拦截器
// .request就是一个请求拦截器
// 使用use函数为请求拦截器挂载一个回调函数
// 在发送请求时，会优先调用use函数
service.interceptors.request.use(
  (config)=>{
    // 为请求头对象，添加 Token 验证的 Authorization 字段
    const token = sessionStorage.getItem('token')
    if(token){
      config.headers.Authorization = token
    }else{
      return config
    }
  },
  (error) => Promise.reject(error),
)

// 拦截器 检测到401状态码 返回Error
// 后续加一个Error页面
service.interceptors.response.use(
  (response) => response,
  ({ response }) => {
    const { status, data } = response
    const { message } = data
    Message.error(message)
    if (status) {
        switch (status) {
        case 400:
         $message("请求错误(400)，请重新申请");
         break;
        case 401:
         $message("登录错误(401)，请重新登录");
         return this.$router.replace("/login");
        case 403:
         $message("拒绝访问(403)");
         break;
        case 404:
         $message("请求出错(404)");
         break;
        case 408:
         $message("请求超时(408)");
         break;
        case 500:
         $message("服务器错误(500)，请重启软件或切换功能页！");
         break;
        case 501:
         $message("服务未实现(501)");
         break;
        case 502:
         $message("网络错误(502)");
         break;
        case 503:
         text = "服务不可用(503)";
         break;
        case 504:
         text = "网络超时(504)";
         break;
        case 505:
         text = "HTTP版本不受支持(505)";
         break;
        default:
         text = "网络连接出错";
        }
       } else {
        text = "连接服务器失败,请退出重试!";
       }
    return Promise.reject(error)
  }
)

Vue.prototype.$http=service
export default service
// export {
// 	GET,
// 	POST
// }