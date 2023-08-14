<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="100px">
      <el-form-item label="登录名称" prop="username">
        <!-- 禁用用户名输入框 disabled -->
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userForm.nickname" minlength="1" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="UpdateUser">提交修改</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import axios from "axios";
export default {
  name: "UserInfo",
  data() {
    return {
      userForm: {},
      userFormRules: {},
    };
  },
  created() { },

  methods: {
    // 登录的 AXIOS
    UpdateUser() {
      // 获取键盘输入的用户昵称 用户邮箱
      const username = this.userForm.username;
      const nickname = this.userForm.nickname;
      const email = this.userForm.email;
      const params = new URLSearchParams();
      // params.append("username", username);
      params.append("nickname", nickname);
      params.append("email", email);
      const token = sessionStorage.token;
      axios({
        method: "post",
        url: "http://47.115.231.184:5555/my/userinfo",
        data: params,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: token,
        },
      })
        .then((res) => {
          console.log(res.data);
          console.log(res);
          // 后台node更新都设置的是201状态码
          if (res.data.status === 201) {
            this.$message.success("更新成功！");
          } else {
            this.$message.error("更新失败！");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>


<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
