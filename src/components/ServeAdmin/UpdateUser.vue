<template>
  <div>
    <!-- 面包屑导航区 -->
    <top-bar style="margin-bottom:10px;" />
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>更新密码</span>
      </div>
      <!-- 表单 -->
      <el-form
        :model="userForm"
        :rules="userFormRules"
        ref="userFormRef"
        label-width="100px"
      >
        <el-form-item
          label="原密码"
          prop="oldPwd"
        >
          <el-input v-model="userForm.oldPwd"></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPwd"
        >
          <el-input v-model="userForm.newPwd"></el-input>
        </el-form-item>
        <el-form-item
          label="确认新密码"
          prop="rePwd"
        >
          <el-input v-model="userForm.rePwd"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 权限设置，可选择按钮隐藏或者跳出提示没有权限 -->
          <!-- <el-button type="primary" v-if="canChangePassword" @click="UpdateUser">提交修改</el-button> -->
          <el-button
            type="primary"
            @click="UpdateUser"
          >提交修改</el-button>
          <!-- 自定义指令v-has 可以选择不填，不填则从路由获取权限规则或者可以自己设置接口获取规则 -->
          <el-button
            type="primary"
            v-has="1"
          >测试</el-button>
          <el-button
            type="primary"
            v-has
          >编辑0</el-button>

        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { updUserPwd } from '@/api/UserInfo.api';
import { mapGetters } from 'vuex'; // 导入 mapGetters
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
    // this.userForm = { ...this.$store.state.user.userInfo };
  },
  computed: {
    ...mapGetters(['userRole']),
    canChangePassword() {
      const canChange = this.userRole === 1;
      return canChange;
    }
  },
  methods: {
    // 登录的 AXIOS
    UpdateUser() {
      if (this.canChangePassword) {
        // 执行修改密码操作

        // 获取键盘输入的账号密码
        // const Uid = this.userForm.username
        const newPwd = this.userForm.newPwd;
        const oldPwd = this.userForm.oldPwd;
        const params = new URLSearchParams();
        // params.append('id', Uid);
        params.append("newPwd", newPwd);
        params.append("oldPwd", oldPwd);
        updUserPwd(params)
          .then((res) => {
            if (res.data.status === 201) {
              this.$message.success("更新成功！");
            } else {
              this.$message.error("更新失败！");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        // 没有权限执行修改密码操作
        this.$message.error("当前账号没有权限！");
      }

    },
  },
};
</script>


<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
