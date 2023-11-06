<template>
  <div>
    <!-- 导航区 -->
    <el-breadcrumb class="el-breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/AdminHome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章</el-breadcrumb-item>
      <el-breadcrumb-item>文章编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="50">
        <el-col :span="8">
          <el-input v-model="searchQuery" placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" @click="searchArt"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addArt">发表文章</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 用户列表区域 -->
    <el-table :data="ArtList" border stripe>
      <!-- 在这里绑定表格的数据 ArtList -->
      <el-table-column type="index"></el-table-column>
      <!-- 添加索引列 -->
      <el-table-column prop="title" label="标题"> </el-table-column>
      <!-- prop是取得userList中每一个对象中的对应属性值 -->
      <el-table-column show-overflow-tooltip prop="Introduction" label="简介"> </el-table-column>
      <el-table-column prop="image_path" label="图片"> </el-table-column>
      <el-table-column prop="publish_date" label="日期"> </el-table-column>
      <el-table-column prop="category" label="分类">
        <template slot-scope="scope">
          <div>
            {{categoryNames[scope.row.category]}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" @change="handleThrottledStatusChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <!-- slot-scope="scope" -->
        <template>
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <!-- <el-pagination @size-change="handleSizeChange" @current-change="handeleCurrentChange" :current-page="queryIofo.pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="queryIofo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination> -->
  </div>
</template>

<script>
import { getarticles, getCategoriesList, Updstatus, searchArticles } from '@/api/ArticleList.api';
export default {
  data() {
    return {
      // 获取用户列表的参数
      queryIofo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      ArtList: [],
      categories: [], // 假设你从后端获取文章分类列表
      total: 0,
      searchQuery: '',
      lastUpdateTimestamp: 0, //上次点击时间
      throttleInterval: 2000, // 节流时间间隔，单位：毫秒
    };
  },
  created() {
    // 先获取分类列表的ID和Name
    this.fetchCategoryList();
    // 获取用户列表页面
    this.getArtList();

  },
  computed: {
    categoryNames() {
      const categoryMap = {}; // 使用一个对象来存储分类 id 到名称的映射
      this.categories.forEach(category => {
        categoryMap[category.id] = category.name;
      });
      return categoryMap;
    }
  },
  methods: {
    // 获取分类列表
    fetchCategoryList() {
      getCategoriesList()
        .then(res => {
          if (res.status === 200) {
            this.categories = res.data.categories;
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'axios报错');
        })
    },
    getArtList() {
      getarticles()
        .then((res) => {
          if (res.status === 200) {
            this.ArtList = res.data.articles;
            this.ArtList = this.ArtList.map(item => ({
              id: item.id,
              category: item.category,
              Introduction: item.Introduction,
              image_path: item.image_path,
              publish_date: item.formatted_publish_date,
              title: item.title,
              status: item.status
            }));
            // this.$message.success("获取用户失败");
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
    //   this.getArtList();
    // },
    // // 监听页码变化
    // handleCurrentChange(newPage) {
    //   this.queryIofo.pagenum = newPage;
    //   // 重新用新的queryIofo参数获取用户数据，渲染页面
    //   this.getArtList();
    // },

    // 修改文章的显示
    updateStatus(row) {
      const tableData = {
        status: row.status,
        articleId: row.id,
      }
      Updstatus(tableData)
        .then(res => {
          if (res.status === 200) {
            // this.getArtList(); // 更新列表数据
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
    // 搜索文章
    searchArt() {
      const search = { searchQuery: this.searchQuery }
      searchArticles(search)
        .then(res => {
          if (res.status === 200) {
            this.ArtList = res.data.articles
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
    addArt() {
      this.$router.push('/TextEditor');
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

