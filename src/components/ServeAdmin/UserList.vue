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
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getUserList">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 用户列表区域 -->
    <el-table :data="userList.data" border stripe>
      <!-- 在这里绑定表格的数据 userList -->
      <el-table-column type="index"></el-table-column>
      <!-- 添加索引列 -->
      <el-table-column prop="username" label="姓名"> </el-table-column>
      <!-- prop是取得userList中每一个对象中的对应属性值 -->
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="user_pic" label="电话"> </el-table-column>
      <el-table-column prop="nickname" label="角色"> </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="stateObj">
          <el-switch
            v-model="stateObj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <!-- slot-scope="scope" -->
        <template>
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
          <!-- 分配角色按钮 -->
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handeleCurrentChange"
      :current-page="queryIofo.pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="queryIofo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      // 获取用户列表的参数
      queryIofo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
    };
  },
  created() {
    // 组件一旦创建，就执行这个函数，获取用户列表页面
    this.getUserList();
  },
  methods: {
    getUserList() {
      // 这里把要传进去的参数事先在数据区域写好，然后再用axios调用即可
      
      const token = sessionStorage.token;
      const params = new URLSearchParams();
      axios({
        method: "get",
        url: "http://47.115.231.184:5555/my/userinfo",
        data: params,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": token,
        },
      })
        .then((res) => {
          console.log(res.data.data);
          console.log(res);
          console.log('--------------')
          if (res.data.status !== 200) {
            return this.$message.error("获取用户失败");
          } else {
            
            this.userList = res.data;
            this.total = res.data.total;
            console.log(this.userList)
            console.log(this.total)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 监听每页显示的条数
    handleSizeChange(newSize) {
      // 一旦每页几条发生变化，则触发这个事件，把数据中的pagesize更新
      this.queryIofo.pagesize = newSize;
      // 重新用新的queryIofo参数获取用户数据，渲染页面
      this.getUserList();
    },
    // 监听页码变化
    handleCurrentChange(newPage) {
      this.queryIofo.pagenum = newPage;
      // 重新用新的queryIofo参数获取用户数据，渲染页面
      this.getUserList();
    },
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

