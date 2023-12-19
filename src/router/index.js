import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui';
// import SpuraBlog from '../views/SpuraBlog.vue';
// 子菜单展开使用
import EmptyComponent from '@/components/ServeAdmin/EmptyComponents.vue';

// Vue.use(ElementUI);
Vue.use(VueRouter)
const routes = [
  // Blog主页
  {
    path: '/',
    redirect: '/SpuraBlog',
  },
  // 登陆界面
  {
    name: 'Login',
    path: '/login',
    component: () => import('../views/login.vue'),
  },
  // 后台主页的路由
  {
    path: '/Admin-Main',
    name: 'Admin-Main',
    component: () => import('../views/Admin-Main/index.vue'),
    redirect: '/AdminHome',
    meta: {
      requireAuth: true,
      title: '组件',
      icon: 'box-open'
    },
    // meta 标记 需要登录才能使用
    // meta: { requireAuth:true}
    children: [
      // 子路由
      {
        path: '/AdminHome',
        name: 'AdminHome',
        meta: { title: '主页', icon: 'el-icon-menu' },
        component: () => import('../components/ServeAdmin/AdminHome.vue')
      },
      {
        path: '/UserInfo',
        component: EmptyComponent, // 或者使用重定向
        meta: { title: '个人信息', icon: 'el-icon-tickets' },
        children: [
          {
            path: '/Account',
            component: EmptyComponent, // 或者使用重定向
            meta: { title: '账号密码', icon: 'el-icon-coin' },
            children: [
              {
                path: '/UpdateUser',
                component: () => import('../components/ServeAdmin/UpdateUser.vue'),
                meta: { title: '更换密码', icon: 'el-icon-key' },
              }
            ]
          },
          {
            path: '/TextEditor',
            component: () => import('../components/ServeAdmin/TextEditor.vue'),
            meta: { title: '发布内容', icon: 'el-icon-upload' },
          },
          {
            path: '/AdminSet',
            component: () => import('../components/ServeAdmin/AdminSet.vue'),
            meta: { title: '文章封面', icon: 'el-icon-picture-outline' },
          },
        ],
      },
      {
        path: '/User',
        component: EmptyComponent, // 或者使用重定向
        meta: { title: '用户信息', icon: 'el-icon-s-custom' },
        children: [
          {
            path: '/UserList',
            name: 'UserList',
            component: () => import('../components/ServeAdmin/UserList.vue'),
            meta: { title: '账号管理', icon: 'el-icon-edit-outline' },
          },
          {
            path: '/ArtList',
            name: 'ArtList',
            component: () => import('../components/ServeAdmin/ArtList.vue'),
            meta: { title: '文章管理', icon: 'el-icon-reading' },
          }
        ],
      },
      {
        path: '/Game',
        component: EmptyComponent, // 或者使用重定向
        meta: { title: '游戏信息', icon: 'el-icon-coordinate' },
        children: [
          {
            path: '/GameManage',
            name: 'GameManage',
            component: () => import('../components/ServeAdmin/GameManage.vue'),
            meta: { title: '游戏管理', icon: 'el-icon-mouse' },
          },
        ],
      },
      {
        path: '/UserImage',
        name: 'UserImage',
        component: () => import('../components/ServeAdmin/UserImage.vue'),
        meta: { title: '头像管理', icon: 'el-icon-camera' },
      },
      {
        name: 'Test',
        path: '/Test',
        component: () => import('../views/Test/Test.vue'),
        meta: { title: '测试', icon: 'el-icon-guide' },
      },
    ]
  },
  // Blog主页
  {
    // Blog主页
    path: '/SpuraBlog',
    redirect: '/Main',
    component: () => import('../views/SpuraBlog.vue'),
    // component: SpuraBlog,
    children: [
      {
        path: '/Main',
        name: 'Main',
        component: () => import('../components/layout/layout-body.vue')
      },
      {
        path: '/ArticleList',
        name: 'ArticleList',
        component: () => import('../views/Article/ArticleList.vue')
      },
      {
        path: '/ArticleShow',
        name: 'ArticleShow',
        component: () => import('../views/Article/ArticleShow.vue')
      },
      {
        path: '/blockly',
        name: 'blockly',
        component: () => import('../components/blockly/BlocklyBlock.vue')
      },
      // 留言板
      {
        path: '/MessageBoard',
        name: 'MessageBoard',
        component: () => import('../views/MessageBoard/MessageBoard.vue')
      },
      // 游戏界面  
      {
        path: '/GameBoard',
        name: 'GameBoard',
        component: () => import('../views/Games/GameBoard.vue')
      },
    ],
  },
  {
    path: '/EsBigScreen',
    name: 'EsBigScreen',
    meta: {
      title: '全屏显示',
      fullscreen: true, // 添加一个 fullscreen 属性，标识该页面需要全屏显示
    },
    component: () => import('../views/EsBigScreen/EsBigScreen.vue')
  },

]

const router = new VueRouter({
  mode: "hash",
  routes,
})

// 路由守卫
// router.beforeEach((to, from, next) => {
//   const token = sessionStorage.getItem('token')
//   if (to.name !== 'Login' && !token) {
//     next({ name: 'Login' })
//   } else {
//     next()
//   }
// })


//路由判断登录，根据路由配置文件的参数
router.beforeEach((to, from, next) => {
  //判断该路由是否需要登录权限
  //record.meta.requireAuth是获取到该请求中携带的该参数
  if (to.matched.some(record => record.meta.requireAuth)) {
    //获取到会话的token
    const token = sessionStorage.getItem("token")
    // console.log("显示token----------：" + token)

    //判断当前的token是否存在，也就是登录时的token
    if (token) {
      //如果指向的是登录页面，不做任何操作
      if (to.path === "/login") {
      } else {
        //如果不是登录页面，且token存在，就放行
        next()
      }
    } else {
      //    如果token不存在
      //    前往登录
      Message({
        message: '请先登录',
        type: 'warning'
      });
      next({
        path: '/login'
      })
    }
  } else {
    //如果不需要登录认证，就直接访问
    next()
  }
})




export default router
