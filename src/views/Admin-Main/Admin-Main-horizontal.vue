<template>
  <div class="main-container">
    <!-- 头部区域 -->
    <!-- :style="{ backgroundColor: SettingColor }" 可添加配置颜色 -->
    <div class="top-main">
      <div>
        <img
          class="Logo"
          style="margin-left:30px;"
          src="@/assets/Main/logo.png"
          alt="Logo"
        />
      </div>
      <div
        style="padding-top:3px;"
        class="top-menu"
      >
        <!-- 可以设置默认起始 default-active="/UpdateUser" -->
        <!-- unique-opened 只允许展开一个 -->
        <el-menu
          mode="horizontal"
          unique-opened
          :default-active="activePath"
          background-color="#545c64"
          text-color="#fff"
          :active-text-color="SettingColor"
        >
          <AsideItems
            :menu="menu"
            style="display:flex"
            @saveNavState="saveNavState"
          />
        </el-menu>
      </div>
      <div>
        <el-menu
          mode="horizontal"
          :default-active="activePath"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          :active-text-color="SettingColor"
        >
          <el-submenu index="1">
            <template slot="title">
              <!-- 头像 -->
              <img
                :src="ImageUrl + userData.userImage"
                alt="userImage"
                class="avatar"
              />
              <span>个人中心</span>
            </template>
            <el-menu-item
              index="/Userimage"
              @click="saveNavState('/Userimage')"
            ><i class="el-icon-camera"></i>更换头像</el-menu-item>
            <el-menu-item
              index="/UpdateUser"
              @click="saveNavState('/UpdateUser')"
            ><i class="el-icon-key"></i>更换密码</el-menu-item>
          </el-submenu>
          <el-menu-item
            index="10"
            @click="logoutHandler"
          ><i class="el-icon-switch-button"></i>退出</el-menu-item>
        </el-menu>
      </div>
    </div>
    <!-- 页面主体 -->
    <div class="admin-main">
      <el-main>
        <!-- 配置主题组件 -->
        <AdminSet :SettingColor="SettingColor" />
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'; // 导入 mapGetters
import AsideItems from "@/views/Admin-Main/components/Admin-Main-items.vue"; // 导入导航栏递归子组件
import AdminSet from "@/views/Admin-Main/components/Admin-Main-setting.vue"; // 导入配置主题子组件
export default {
  components: {
    AsideItems,
    AdminSet
  },
  props: {
    // 父组件传递的 SettingColor
    SettingColor: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      ImageUrl: this.$store.state.ImageUrl,
      activePath: '',
      menu: [],
    };
  },
  computed: {
    ...mapGetters(['userData']),
  },
  mounted() {
    const routerdata = this.$router.options.routes
    const backendRoute = routerdata.find(route => route.name === 'Admin-Main');
    this.menu = backendRoute ? backendRoute.children : [];
  },
  created() {
    // 从sessionStorage中把保存的激活菜单的地址取出来
    this.activePath = window.sessionStorage.getItem('activePath')
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
    saveNavState(activePath) {
      // 当点击其他链接时，还需要为activePath重新赋值
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
};
</script>

<style lang="less" scoped>
.el-menu.el-menu--horizontal {
  // NavMenu 导航菜单 去除下划白线
  border: none;
}
.top-main {
  height: 100%;
  background-color: #545c64;
  display: flex;
  justify-content: space-between;
}
// 去除导航栏的箭头标志
.top-menu {
  ::v-deep .el-submenu__title {
    .el-icon-arrow-down {
      display: none;
    }
  }
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 5px;
}
.main-container {
  height: 100%;
}
// .admin-main {
//   padding: 20px;
// }
</style>
