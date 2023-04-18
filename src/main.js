import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// import service from './utils/request'
// Vue.prototype.$http=service
import * as echarts from "echarts";  //引入echarts
Vue.prototype.$echarts = echarts  //挂载在全局

// 富文本编辑器挂载全局
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

Vue.use(ElementUI);
Vue.config.productionTip = false
//在原型链上给$http赋值为axios对象
Vue.prototype.$http = axios
//定义根路径
axios.defaults.baseURL= '/'


  // 定义请求拦截器
// axios.interceptors.request.use(
//   (config)=>{
//     // 为请求头对象，添加 Token 验证的 Authorization 字段
//     const token = JSON.parse(sessionStorage.getItem('token'))
//     if(token){
//      return config.headers.Authorization = token
//     }else{
//       return config
//     }
//   },
//   (error) => Promise.reject(error),
// )




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
