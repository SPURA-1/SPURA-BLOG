<template>
  <div>
    <!-- 导航区 -->
    <el-breadcrumb
      class="el-breadcrumb"
      separator-class="el-icon-arrow-right"
    >
      <el-breadcrumb-item :to="{ path: '/AdminHome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表区域 -->
    <el-table
      :data="CommentList"
      border
      stripe
    >
      <!-- 在这里绑定表格的数据 CommentList -->
      <el-table-column type="index"></el-table-column>
      <!-- 添加索引列 -->
      <el-table-column
        prop="username"
        label="用户名"
      > </el-table-column>
      <!-- prop是取得userList中每一个对象中的对应属性值 -->
      <el-table-column
        show-overflow-tooltip
        prop="ip"
        label="IP地址"
      > </el-table-column>
      <el-table-column
        prop="content"
        label="评论"
      >
      </el-table-column>
      <el-table-column
        prop="publish_date"
        label="日期"
      > </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleThrottledStatusChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180px"
      >
        <!-- slot-scope="scope" -->
        <template>
          <!-- 修改按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <!-- <el-pagination @size-change="handleSizeChange" @current-change="handeleCurrentChange" :current-page="queryIofo.pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="queryIofo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination> -->
  </div>
</template>

<script>
import { getComment, Updstatus } from '@/api/MessageBoard.api'
import { mapGetters } from 'vuex'; // 导入 mapGetters
export default {
  data() {
    return {
      ImageUrl: this.$store.state.ImageUrl,
      // 分页器-获取用户列表的参数
      queryIofo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      total: 0,
      // 评价图片列表
      evaluatePictureList: [],
      CommentList: [],
      lastUpdateTimestamp: 0, //上次点击时间
      throttleInterval: 2000, // 节流时间间隔，单位：毫秒
    };
  },
  created() {
    // 获取用户列表页面
    this.getComment();
  },
  computed: {
  },
  methods: {
    getComment() {
      getComment()
        .then((res) => {
          if (res.status === 200) {
            this.CommentList = res.data.comments;
            this.CommentList = this.CommentList.map(item => ({
              id: item.id,
              username: item.username,
              ip: item.city,
              content: item.content,
              publish_date: item.formatted_publish_date,
              status: item.status,
              username: item.username
            }));
          } else {
            console.log('报错');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // // 监听每页显示的条数
    // handleSizeChange(newSize) {
    //   // 一旦每页几条发生变化，则触发这个事件，把数据中的pagesize更新
    //   this.queryIofo.pagesize = newSize;
    //   // 重新用新的queryIofo参数获取用户数据，渲染页面
    //   this.getComment();
    // },
    // // 监听页码变化
    // handleCurrentChange(newPage) {
    //   this.queryIofo.pagenum = newPage;
    //   // 重新用新的queryIofo参数获取用户数据，渲染页面
    //   this.getComment();
    // },

    // 修改文章的显示
    updateStatus(row) {
      const tableData = {
        status: row.status,
        commentId: row.id,
      }
      console.log(tableData, 'ppp');
      Updstatus(tableData)
        .then(res => {
          if (res.status === 200) {
            // this.getComment(); // 更新列表数据
            this.$message.success("状态更新成功");
          } else {
            this.$message.error("状态更新失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 节流
    handleThrottledStatusChange(row) {
      const currentTime = Date.now(); // 获取当前时间戳
      // 检查当前时间与上次更新时间的间隔是否超过节流时间间隔
      if (currentTime - this.lastUpdateTimestamp >= this.throttleInterval) {
        this.updateStatus(row); // 执行实际的状态更新逻辑
        this.lastUpdateTimestamp = currentTime; // 更新上次更新时间戳
      }
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

