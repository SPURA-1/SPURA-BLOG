import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
// import SpuraBlog from '../views/SpuraBlog.vue';
// 定义加载页面组件
const LoadingComponent = () => import('../components/Loading/Loading.vue');

Vue.use(ElementUI);
Vue.use(VueRouter)

const routes = [
  // Blog主页
  {
    path: '/',
    redirect: '/Loading',
  },
  //  加载页面
  {
    path: '/Loading',
    component: LoadingComponent,
  },
  // 登陆界面
  {
    name: 'Login',
    path: '/login',
    component: () => import('../views/login.vue'),
  },
  {
    name: 'test',
    path: '/test',
    component: () => import('../views/test.vue'),
  },
  // 后台主页的路由
  {
    path: '/Admin-Main',
    name: 'Admin-Main',
    component: () => import('../views/Admin-Main/Admin-Main.vue'),
    redirect: '/AdminHome',
    meta: { requireAuth: true },
    // meta 标记 需要登录才能使用
    // meta: { requireAuth:true}
    children: [
      // 子路由
      {
        path: '/AdminHome',
        name: 'AdminHome',
        component: () => import('../components/ServeAdmin/AdminHome.vue')
      },
      {
        path: '/UpdateUserData',
        name: 'UpdateUserData',
        component: () => import('../components/ServeAdmin/UpdateUserData.vue')
      },
      {
        path: '/UpdateUser',
        name: 'UpdateUser',
        component: () => import('../components/ServeAdmin/UpdateUser.vue')
      },
      {
        path: '/UserList',
        name: 'UserList',
        component: () => import('../components/ServeAdmin/UserList.vue')
      },
      {
        path: '/AdminSet',
        name: 'AdminSet',
        component: () => import('../components/ServeAdmin/AdminSet.vue')
      },
      {
        path: '/TextEditor',
        name: 'TextEditor',
        component: () => import('../components/ServeAdmin/TextEditor.vue')
      },
      {
        path: '/ArtList',
        name: 'ArtList',
        component: () => import('../components/ServeAdmin/ArtList.vue')
      },
      {
        path: '/GameManage',
        name: 'GameManage',
        component: () => import('../components/ServeAdmin/GameManage.vue')
      },
      {
        path: '/UserImage',
        name: 'UserImage',
        component: () => import('../components/ServeAdmin/UserImage.vue')
      },

    ]
  },
  // Blog主页
  {
    // Blog主页
    path: '/SpuraBlog',
    redirect: '/Main',
    component: () => import('../views/SpuraBlog.vue'),
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
    ]
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
      ElementUI.Message({
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
