<template>
  <div class="main-container">
    <!-- 头部区域 -->
    <el-header class="el-header">
      <!-- 左侧的 logo -->
      <img class="Logo" style="margin-left:30px;" src="../../assets/Main/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <!-- 通过mode属性可以使导航菜单变更为水平模式 -->
      <!-- select	菜单激活回调 -->
      <!-- :default-active 与当前激活的菜单绑定“path” -->
      <el-menu class="el-menu-top" mode="horizontal" @select="handleSelect" background-color="#23262E" text-color="#fff" active-text-color="#409EFF">
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img :src="ImageUrl + userData.userImage" alt="" class="avatar" />
            <span>个人中心</span>
          </template>
          <el-menu-item class="MenuTop" index="/UpdateUserData"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item class="MenuTop" index="/Userimage"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item class="MenuTop" index="/UpdateUser"><i class="el-icon-key"></i>更换密码</el-menu-item>
        </el-submenu>
        <el-menu-item @click="logoutHandler"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>

    <!-- 页面主体 -->
    <div class="foot-container">
      <!-- 侧边栏区域 -->
      <div class="page-scroll">
        <el-aside width="auto" class="el-aside">
          <!-- 可以设置默认起始 default-active="/UpdateUser" -->
          <el-menu unique-opened :default-active="activePath" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <!-- 一级菜单 用户信息 -->
            <el-menu-item index="/AdminHome">
              <i class="el-icon-menu"></i>
              <span slot="title">主页</span>
            </el-menu-item>
            <el-submenu index="1" class="el-submenu">
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-user"></i>
                <!-- 一级导航名称 -->
                <span>个人信息</span>
              </template>

              <!-- 二级菜单 -->
              <el-submenu v-if="canChangePassword" index="2">
                <template slot="title">账号</template>
                <el-menu-item index="/UpdateUserData">基本资料</el-menu-item>
                <el-menu-item index="/UpdateUser">更新</el-menu-item>
              </el-submenu>

              <el-menu-item index="/TextEditor">发布内容</el-menu-item>

              <el-menu-item index="/AdminSet">文章封面</el-menu-item>

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
              <el-menu-item index="/UserList">账号</el-menu-item>

              <el-menu-item index="/ArtList">文章</el-menu-item>
            </el-submenu>

            <!-- 文章管理 disabled 设置不可点击-->
            <el-submenu index="4">
              <!-- 一级菜单 -->
              <template slot="title">
                <i class="el-icon-document"></i>
                <span slot="title">生活</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item index="/GameManage">游戏列表</el-menu-item>

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
      </div>
      <div class="mainBody">
        <!-- 页面主体区域 -->
        <div class="el-main">
          <router-view></router-view>
        </div>
        <!-- 底部 footer 区域 -->
        <!-- <el-footer>© www.spura.com - spura后台</el-footer> -->
      </div>
    </div>
  </div>
</template>

<script>
import { userLogin } from "@/utils/api";
import { mapGetters } from 'vuex'; // 导入 mapGetters
export default {
  data() {
    return {
      ImageUrl: 'http://47.115.231.184:5555',
      isCollapse: true,
      activePath: '',
    };
  },
  computed: {
    ...mapGetters(['userData', 'userRole']),
    canChangePassword() {
      const canChange = this.userRole === 1;
      return canChange;
    }
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
.foot-container {
  display: flex;
}
// 侧边栏
.el-aside {
  height: calc(100vh - 60px);
  background-color: #545c64;
  min-width: 0;
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

  /* 头部 */
  .el-header {
    flex-direction: row; /* 恢复水平布局 */
    padding: 0 0 0 10px; /* 恢复内边距 */
    align-items: center; /* 水平对齐内容 */
    justify-content: flex-end;
    .Logo {
      width: 80px;
    }
    .el-menu-top {
      display: flex;
    }
    .avatar {
      margin: 0 10px; /* 在头像和文本之间添加一些间距 */
    }
  }
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
