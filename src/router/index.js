import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
// 1. 导入后台主页组件
import AdminMain from '../views/Admin-Main/Admin-Main.vue'
import UpdateUserData from '../components/ServeAdmin/UpdateUserData.vue'
import UpdateUser from '../components/ServeAdmin/UpdateUser.vue'
import UserList from '../components/ServeAdmin/UserList.vue'
import AdminHome from '../components/ServeAdmin/AdminHome.vue'
import AdminSet from '../components/ServeAdmin/AdminSet.vue'
import TextEditor from '../components/ServeAdmin/TextEditor.vue'
// 前台主页组件
import SpuraBlog from '../views/SpuraBlog.vue'
import Test from '../views/Main/TestMain.vue'

import ElementUI from 'element-ui'
Vue.use(ElementUI);
Vue.use(VueRouter)

const routes = [
  // Blog主页
  {
    path: '/',
    redirect:'/SpuraBlog'
  },
  {
    name: 'Login',
    path: '/login',
    component: Login,
    
  },
  // 后台主页的路由
  {
    path: '/Admin-Main',
    component: AdminMain,
    redirect: '/AdminHome',
    meta: { requireAuth:true},
    // meta 标记 需要登录才能使用
    // meta: { requireAuth:true}
    children: [
      // 子路由
      {
        path: '/AdminHome',
        component: AdminHome
      },
      {
        path: '/UpdateUserData',
        component: UpdateUserData
      },
      {
        path: '/UpdateUser',
        component: UpdateUser
      },
      {
        path: '/UserList',
        component: UserList,
      },
      {
        path: '/AdminSet',
        component: AdminSet,
      },
      {
        path: '/TextEditor',
        component: TextEditor,
      },
      
    ]
  },
  {
    // Blog主页
    path: '/SpuraBlog',
    redirect: '/Main',
    component: SpuraBlog,
    children: [
      {
        path: '/UserList',
        component: UserList
      },
      {
        path: '/Test',
        component: Test
      }, 
      {
        path: '/Main',
        name: 'Main',
        component: () => import('../components/layout/layout-body.vue')
      },  
      {
        path: '/blockly',
        name: 'blockly',
        component: () => import('../components/blockly/BlocklyBlock.vue')
      },  
      {
        path: '/MessageBoard',
        name: 'MessageBoard',
        component: () => import('../views/MessageBoard/MessageBoard.vue')
      },  
      {
        path: '/MessageTest',
        name: 'MessageTest',
        component: () => import('../views/MessageBoard/MessageTest.vue')
      },  
    ]
  },
 
  
]

const router = new VueRouter({
  mode: "hash",
  routes,
})

// 路由守卫
// router.beforeEach((to, from, next)=>{
//   const token = sessionStorage.getItem('token')
//   if(to.name !== 'Login' && !token){
//     next({name: 'Login' })
//   }else {
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
