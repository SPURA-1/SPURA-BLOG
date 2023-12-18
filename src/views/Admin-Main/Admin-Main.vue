<template>
  <div class="main-container">
    <!-- 头部区域 -->
    <AdminMainHeader />
    <!-- 页面主体 -->
    <div class="foot-container">
      <!-- 侧边栏区域 -->
      <div class="page-scroll">
        <el-aside
          width="200px"
          class="el-aside"
        >
          <!-- 可以设置默认起始 default-active="/UpdateUser" -->
          <el-menu
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            mode="vertical"
          >
            <AsideItems
              :menu="menu"
              style="width:100%"
            />
          </el-menu>
        </el-aside>
      </div>
      <div class="mainBody">
        <!-- 页面主体区域 -->
        <div class="el-main">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
        <!-- 底部 footer 区域 -->
        <!-- <el-footer>© www.spura.com - spura后台</el-footer> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'; // 导入 mapGetters
import AdminMainHeader from "@/views/Admin-Main/Admin-Main-header.vue"; // 导入头部组件
import AsideItems from "@/views/Admin-Main/Admin-Main-items.vue"; // 导入导航栏递归子组件
export default {
  components: {
    AdminMainHeader,
    AsideItems
  },
  data() {
    return {
      ImageUrl: 'http://47.115.231.184:5555',
      isCollapse: true,
      activePath: '',
      menu: [],
    };
  },
  computed: {
    ...mapGetters(['userData', 'userRole']),
    canChangePassword() {
      const canChange = this.userRole === 1;
      return canChange;
    }
  },
  mounted() {
    const routerdata = this.$router.options.routes
    const backendRoute = routerdata.find(route => route.name === 'Admin-Main');
    this.menu = backendRoute ? backendRoute.children : [];
    console.log(this.menu);

  },
  methods: {
    // 侧边栏展开
    handleOpen(key, keyPath) {
    },
    // 侧边栏关闭
    handleClose(key, keyPath) {
    },
    // 退出提示用户
    logoutHandler() {
      this.$confirm("确定退出吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!",
          });
          window.sessionStorage.clear();
          this.$router.push("/");
        })
        .catch((e) => e);
    },
    // 创建select菜单激活回调函数，实现路由跳转
    handleSelect(index) {
      //index 就是要跳转的路由
      this.$router.push(index)
    },
    // 保存链接的激活状态
    // saveNavState(activePath){
    //   // 当点击其他链接时，还需要为activePath重新赋值
    //   window.sessionStorage.setItem('activePath',activePath)
    //   this.activePath=activePath
    // }
  },
  created() {
    // 从sessionStorage中把保存的激活菜单的地址取出来
    // this.activePath=window.sessionStorage.getItem('activePath')
  }
};
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
}
.foot-container {
  display: flex;
}
/* 隐藏横向滚动条 */
.page-scroll {
  height: 100%;
  min-width: 200px;
}
.page-scroll .el-scrollbar__wrap {
  overflow: hidden;
}
.el-aside::-webkit-scrollbar {
  display: none;
}

// 侧边栏
.el-aside {
  height: calc(100vh - 60px);
  background-color: #545c64;
  min-width: 0;
}
.el-menu-vertical-demo {
  width: 200px;
}
// 主体
.el-main {
  width: 100%;
  height: calc(100vh - 60px);
  margin: 0; /* 添加这行代码 */
}
.mainBody {
  width: 100%;
  height: calc(100vh - 60px);
}
.el-submenu {
  width: 200px;
}
/* 响应式布局的媒体查询 */
@media screen and (max-width: 768px) {
  /* 仅在屏幕宽度大于等于 768px 时应用这些样式 */

  .page-scroll {
    width: 70px;
    min-width: 50px;
  }
  /* 侧边栏 */
  .el-aside {
    height: calc(100vh - 60px);
    background-color: #545c64;
    overflow: auto;
  }

  /* 添加新的样式以保持布局稳定 */
  .div {
    height: 100vh;
    overflow: hidden; /* 避免内容溢出 */
  }
  .el-main {
    flex: 1; /* 主体区域占据剩余空间 */
    overflow: auto; /* 主体内容溢出时出现滚动条 */
  }
}
</style>
