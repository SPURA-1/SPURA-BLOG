<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header class="el-header">
      <!-- 左侧的 logo -->
      <img src="../../assets/Main/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <!-- 通过mode属性可以使导航菜单变更为水平模式 -->
      <!-- select	菜单激活回调 -->
      <!-- :default-active 与当前激活的菜单绑定“path” -->
      <el-menu class="el-menu-top" mode="horizontal" @select="handleSelect" background-color="#23262E" text-color="#fff" active-text-color="#409EFF">
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img src="../../assets/Main/avatar.jpg" alt="" class="avatar" />
            <span>个人中心</span>
          </template>
          <el-menu-item index="/UpdateUserData"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="/AdminSet"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="/UpdateUser"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="logoutHandler"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>

    <!-- 页面主体 -->
    <el-container class="foot-container">
      <!-- 侧边栏区域 -->
      <el-scrollbar class="page-scroll">
        <el-aside width="200px" class="el-aside">
          <!-- 可以设置默认起始 default-active="/UpdateUser" -->
          <el-menu unique-opened :default-active="activePath" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <!-- 一级菜单 用户信息 -->
            <el-submenu index="1" class="el-submenu">
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-user"></i>
                <!-- 一级导航名称 -->
                <span>用户信息</span>
              </template>

              <!-- 二级菜单 -->
              <el-submenu index="2">
                <template slot="title">账号</template>
                <el-menu-item index="/UpdateUserData">基本资料</el-menu-item>
                <el-menu-item index="/UpdateUser">更新</el-menu-item>
              </el-submenu>

              <el-menu-item index="TextEditor">发布内容</el-menu-item>

              <el-menu-item index="AdminSet">上传头像</el-menu-item>

              <!-- 更改成下拉框 -->
              <!-- 
              <el-submenu index="1-4">
              <template slot="title">上传头像</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu> 
              -->
            </el-submenu>

            <!-- 权限管理 -->
            <el-submenu index="3">
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 一级导航名称 -->
                <span>用户管理</span>
              </template>
              <!-- 二级菜单 -->
              <el-submenu index="3-1">
                <template slot="title">账号</template>
                <el-menu-item index="UserList">添加新账号</el-menu-item>
                <el-menu-item index="3-2">更新</el-menu-item>
              </el-submenu>

              <el-submenu index="3-3">
                <template slot="title">文章</template>
                <el-menu-item index="TextEditor">文章发表</el-menu-item>
                <el-menu-item index="ArtList">文章编辑</el-menu-item>
              </el-submenu>
            </el-submenu>

            <!-- 文章管理 disabled 设置不可点击-->
            <el-submenu index="4">
              <!-- 一级菜单 -->
              <template slot="title">
                <i class="el-icon-document"></i>
                <span slot="title">生活</span>
              </template>
              <!-- 二级菜单 -->
              <el-submenu index="4-1">
                <template slot="title">日常</template>
                <el-menu-item index="4-1-2">日常</el-menu-item>
                <el-menu-item index="4-1-3">更新模块</el-menu-item>
              </el-submenu>

              <el-submenu index="4-2">
                <template slot="title">更新模块</template>
                <el-menu-item index="4-2-1">更新模块</el-menu-item>
              </el-submenu>
            </el-submenu>

            <el-submenu index="5">
              <!-- 一级菜单 -->
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span slot="title">数据统计</span>
              </template>
              <!-- 二级菜单 -->
              <el-submenu index="5-1">
                <template slot="title">去过的地方</template>
                <el-menu-item index="5-1-1">地图锚点</el-menu-item>
                <el-menu-item index="/AdminHome">数据信息</el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu>
        </el-aside>
      </el-scrollbar>
      <el-container class="container">
        <!-- 页面主体区域 -->
        <el-main class="el-main">
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <!-- <el-footer>© www.spura.com - spura后台</el-footer> -->
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { userLogin } from "@/utils/api";
export default {
  data() {
    return {
      isCollapse: true,
      activePath: '',
    };
  },
  methods: {
    // 侧边栏展开
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    // 侧边栏关闭
    handleClose(key, keyPath) {
      console.log(key, keyPath);
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
          this.$router.push("/login");
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

/* 隐藏横向滚动条 */
.page-scroll {
  height: 100%;
  min-width: 0;
}
.page-scroll .el-scrollbar__wrap {
  overflow: hidden;
}
.el-aside::-webkit-scrollbar {
  display: none;
}

// 头部
.el-header {
  background-color: #23262e;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  //  居中
  align-items: center;
  //  文本颜色
  color: #fff;
  // 文字大小
  font-size: 20px;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 5px;
  }
}

// 侧边栏
.el-aside {
  height: calc(100vh - 60px);
  background-color: #545c64;
  min-width: 0;
}

// 主体
.el-main {
  height: calc(100vh - 60px);
  // background-color: #89cff8;
}
.container {
  height: calc(100vh - 60px);
}
.el-submenu {
  width: 200px;
}
</style>
