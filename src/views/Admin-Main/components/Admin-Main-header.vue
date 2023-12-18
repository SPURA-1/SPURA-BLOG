<template>
  <el-header class="el-header">
    <!-- 左侧的 logo -->
    <img
      class="Logo"
      style="margin-left:30px;"
      src="@/assets/Main/logo.png"
      alt="Logo"
    />
    <!-- 右侧的菜单 -->
    <!-- 通过mode属性可以使导航菜单变更为水平模式 -->
    <!-- select	菜单激活回调 -->
    <!-- :default-active 与当前激活的菜单绑定“path” -->
    <el-menu
      class="el-menu-top"
      mode="horizontal"
      @select="handleSelect"
      background-color="#23262E"
      text-color="#fff"
      active-text-color="#409EFF"
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
          class="MenuTop"
          index="/Userimage"
        ><i class="el-icon-camera"></i>更换头像</el-menu-item>
        <el-menu-item
          class="MenuTop"
          index="/UpdateUser"
        ><i class="el-icon-key"></i>更换密码</el-menu-item>
      </el-submenu>
      <el-menu-item @click="logoutHandler"><i class="el-icon-switch-button"></i>退出</el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>
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
    ...mapGetters(['userData']),
  },
  methods: {
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
}
</script>

<style lang="less" scoped>
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
}
</style>