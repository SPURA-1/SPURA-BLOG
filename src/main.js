import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// import service from './utils/request'
// Vue.prototype.$http=service
import * as echarts from "echarts";  //引入echarts
Vue.prototype.$echarts = echarts  //挂载在全局

import {
  Pagination,
  Dialog,
  Menu,
  MenuItem,
  Submenu,
  Input,
  Switch,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Slider,
  Icon,
  Row,
  Col,
  Upload,
  Badge,
  Card,
  Carousel,
  Header,
  Aside,
  Timeline,
  Message,
  Image,
} from 'element-ui';

Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Input);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tooltip);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Slider);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(Badge);
Vue.use(Card);
Vue.use(Carousel);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Timeline);
Vue.use(Image);
Vue.prototype.$message = Message;

// Vue.use(ElementUI);
Vue.config.productionTip = false
//在原型链上给$http赋值为axios对象
Vue.prototype.$http = axios
//定义根路径
axios.defaults.baseURL = '/'


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
