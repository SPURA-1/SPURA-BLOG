<template>
  <div>
    <!-- 导航区 -->
    <el-breadcrumb class="el-breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/AdminHome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账号</el-breadcrumb-item>
      <el-breadcrumb-item>添加新账号</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="50">
        <el-col :span="8">
          <el-input v-model="searchQuery" placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" @click="searchUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserShow">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog :visible.sync="addUser" title="添加" width="350px">
      <el-form :model="addUserform" label-position="left">
        <el-form-item label="用户ID">
          <el-input v-model="addUserform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addUserform.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUser = false">取消</el-button>
        <el-button type="primary" @click="addNewUser">创建</el-button>
      </div>
    </el-dialog>
    <!-- 用户列表区域 -->
    <el-table :data="userList" border stripe>
      <!-- 在这里绑定表格的数据 userList -->
      <el-table-column type="index"></el-table-column>
      <!-- 添加索引列 -->
      <el-table-column prop="username" label="用户ID"> </el-table-column>
      <el-table-column prop="nickname" label="昵称"> </el-table-column>
      <!-- prop是取得userList中每一个对象中的对应属性值 -->
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="user_pic" label="头像">
        <template slot-scope="scope">
          <!-- <img style="width:150px;height:150px;" :src="scope.row.user_pic" alt="" /> -->
          <el-image style="width: 100px; height: 100px" :src="ImageUrl+scope.row.user_pic" :previewSrcList="evaluatePictureList" @click="clickevaluatePicture(scope.row)">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" @change="upUserStarts(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <!-- slot-scope="scope" -->
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="EditButton(scope.row.id)"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="DelButton(scope.row.id)"></el-button>
          <!-- 分配角色按钮 -->
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="EditButtonPage" title="修改" width="550px">
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
            <el-button @click="resetUpdateUser">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>
    <!-- 分页区域 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handeleCurrentChange" :current-page="queryIofo.pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="queryIofo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { getUserMsg, addUserMsg, userUpdstatus, UserReg, userinfoSearch } from '@/api/UserInfo.api'
import axios from 'axios';
export default {
  data() {
    return {
      ImageUrl: 'http://47.115.231.184:5555',
      addUser: false,
      // 获取用户列表的参数
      queryIofo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      addUserform: {
        username: '',
        password: ''
      },
      searchQuery: '',
      userList: [],
      total: 0,
      evaluatePictureList: [],
      // 添加昵称
      userForm: {},
      userFormRules: {},
      EditButtonPage: false,
    };
  },
  created() {
    // 组件一旦创建，就执行这个函数，获取用户列表页面
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    getUserList() {
      // 这里把要传进去的参数事先在数据区域写好，然后再用axios调用即可

      // const token = sessionStorage.token;
      // const params = new URLSearchParams();
      // axios({
      //   method: "get",
      //   url: "http://47.115.231.184:5555/my/userinfo",
      //   data: params,
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //     "Authorization": token,
      //   },
      // })
      getUserMsg()
        .then((res) => {
          if (res.data.status === 200) {
            this.userList = res.data.data;
            this.userList = this.userList.map(item => ({
              id: item.id,
              username: item.username,
              email: item.email,
              user_pic: item.user_pic,
              nickname: item.nickname,
              mg_state: item.mg_state
            }));
            this.total = res.data.total;
            console.log(this.userList)
            console.log(this.total)
          } else {
            return this.$message.error("获取用户失败");

          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 打开添加用户dialog
    addUserShow() {
      this.addUser = true
    },
    // 添加用户
    addNewUser() {
      UserReg(this.addUserform)
        .then(res => {
          if (res.status === 200) {
            this.addUser = false;
            this.addUserform = {
              username: '',
              password: ''
            }
            this.$message({
              type: 'success',
              message: '新用户创建成功!'
            });
          } else {
            console.log('AXIOS报错');
            this.$message({
              type: 'error',
              message: '新用户创建失败!'
            });
          }
        })
        .catch(err => {
          console.log(err, '报错');
          this.$message({
            type: 'error',
            message: '新用户创建失败!'
          });
        })
    },
    // 搜索用户
    searchUserList() {
      const search = { searchQuery: this.searchQuery }
      userinfoSearch(search)
        .then(res => {
          if (res.status === 200) {
            console.log(res.data);
            this.userList = res.data.users
          } else {

          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    // 修改用户状态
    upUserStarts(row) {
      const tableData = {
        status: row.mg_state,
        userId: row.id,
      }
      console.log(tableData, 's');
      userUpdstatus(tableData)
        .then(res => {
          if (res.status === 200) {
            console.log(res.data);
            this.$message.success("状态更新成功");
          } else {
            this.$message.error("状态更新失败");
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
    // 添加用户信息
    EditButton(id) {
      console.log(id);
      this.EditButtonPage = true
    },
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
      // axios({
      //   method: "post",
      //   url: "http://47.115.231.184:5555/my/userinfo",
      //   data: params,
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //     Authorization: token,
      //   },
      // })
      // id由后端token里解析出来,SQL语句暂只支持修改目前登录的账户ID，需做更改
      const addMsg = {
        username: this.userForm.username,
        nickname: this.userForm.nickname,
        email: this.userForm.email,
      }
      addUserMsg(addMsg)
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
    //  登录的重置按钮
    resetUpdateUser() {
      this.userForm = {}
    },
    // 删除用户
    DelButton(id) {
      console.log(id);
    },
    // 监听每页显示的条数
    handleSizeChange(newSize) {
      // 一旦每页几条发生变化，则触发这个事件，把数据中的pagesize更新
      this.queryIofo.pagesize = newSize;
      // 重新用新的queryIofo参数获取用户数据，渲染页面
      this.getUserList();
    },
    // 监听页码变化
    handeleCurrentChange(newPage) {
      this.queryIofo.pagenum = newPage;
      // 重新用新的queryIofo参数获取用户数据，渲染页面
      this.getUserList();
    },
    // 点击评价图片，大图预览多张图片
    clickevaluatePicture(row) {
      var srclist = []
      srclist.push(this.ImageUrl + row.user_pic)

      this.evaluatePictureList = srclist// 赋值
    }
  },
};
// this.userList=res.data.users
//  this.total=res.data.total
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>

