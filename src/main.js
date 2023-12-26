import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

import has from './utils/ButtonPermissions';
Vue.directive('has', has);

import TopBar from '@/components/ServeAdmin/components/Breadcrumb.vue';
Vue.component('top-bar', TopBar); // 注册 TopBar 组件

// 导入全局错误处理逻辑
import '@/utils/errorLogs';

import {
  Pagination,
  Dialog,
  Menu,
  MenuItem,
  Submenu,
  Input,
  drawer,
  scrollbar,
  RadioGroup,
  RadioButton,
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
  Popover,
  Tag,
  Icon,
  Row,
  Col,
  Upload,
  Badge,
  Card,
  Carousel,
  CarouselItem,
  Header,
  Main,
  Aside,
  Timeline,
  TimelineItem,
  MessageBox,
  Message,
  Image,
  calendar,
} from 'element-ui';

Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Input);
Vue.use(drawer);
Vue.use(scrollbar);
Vue.use(RadioGroup);
Vue.use(RadioButton);
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
Vue.use(Popover);
Vue.use(Slider);
Vue.use(Tag);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(Badge);
Vue.use(Card);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(CarouselItem);
Vue.use(Header);
Vue.use(Main);
Vue.use(Aside);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Image);
Vue.use(calendar);
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;


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
