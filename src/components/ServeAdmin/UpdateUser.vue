<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更新密码</span>
    </div>
    <!-- 表单 -->
    <el-form
      :model="userForm"
      :rules="userFormRules"
      ref="userFormRef"
      label-width="100px"
    >
      <el-form-item label="原密码" prop="oldPwd">
        <el-input v-model="userForm.oldPwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input v-model="userForm.newPwd"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="rePwd">
        <el-input v-model="userForm.rePwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="UpdateUser">提交修改</el-button>
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
  created() {
    // 基于浅拷贝，把 Vuex 中的用户信息对象复制一份，交给 userForm
    this.userForm = { ...this.$store.state.user.userInfo };
  },
  methods: {
    // 登录的 AXIOS
    UpdateUser() {
      // 获取键盘输入的账号密码
      // const Uid = this.userForm.username
      const newPwd = this.userForm.newPwd;
      const oldPwd = this.userForm.oldPwd;
      const params = new URLSearchParams();
      // params.append('id', Uid);
      params.append("newPwd", newPwd);
      params.append("oldPwd", oldPwd);
      const token = sessionStorage.token;
      // params.append('token', token);
      axios({
        method: "post",
        url: "http://47.115.231.184:5555/my/updatepwd",
        data: params,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: token,
        },
      })
        .then((res) => {
          console.log(res.data);
          console.log(res);
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
