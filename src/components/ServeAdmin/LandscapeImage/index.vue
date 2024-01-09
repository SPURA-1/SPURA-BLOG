<template>
  <div>
    <!-- 面包屑导航区 -->
    <top-bar />
    <el-button style="margin-bottom:5px" type="primary" @click="addArt">上传照片</el-button>
    <!-- 用户列表区域 -->
    <el-table :data="ArtList" border stripe>
      <!-- 在这里绑定表格的数据 ArtList -->
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="image_path" label="图片">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px" :src="ImageUrl+scope.row.image_path" :previewSrcList="evaluatePictureList">
          </el-image>
        </template></el-table-column>
      <el-table-column prop="description" label="描述"> </el-table-column>
      <el-table-column prop="formatted_publish_date" label="日期"> </el-table-column>
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
    <el-dialog :visible.sync="dialogVisibleSet" title="照片上传">
      <LandscapeImage @uploadComplete="handleUploadComplete" />
    </el-dialog>
  </div>
</template>

<script>
import { getAlllandscapeImages, Updstatus } from '@/api/homePage.api';
import LandscapeImage from "@/components/ServeAdmin/LandscapeImage/components/LandscapeImage.vue";
export default {
  components: {
    LandscapeImage,
  },
  data() {
    return {
      dialogVisibleSet: false,
      ImageUrl: this.$store.state.ImageUrl,
      // 获取用户列表的参数
      queryIofo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      // 评价图片列表
      evaluatePictureList: [],
      ArtList: [],
      total: 0,
      lastUpdateTimestamp: 0, //上次点击时间
      throttleInterval: 2000, // 节流时间间隔，单位：毫秒
    };
  },
  created() {
    // 获取用户列表页面
    this.getArtList();
  },
  methods: {
    getArtList() {
      getAlllandscapeImages()
        .then((res) => {
          if (res.status === 200) {
            this.ArtList = res.data.images;
            this.ArtList = this.ArtList.map(item => ({
              id: item.id,
              description: description,
              image_path: item.image_path,
              formatted_publish_date: item.formatted_publish_date,
              status: item.status
            }));
            // 遍历 ArtList，将不为 null，不为空 且不存在于 evaluatePictureList 中的图片路径添加到列表中
            this.ArtList.forEach(item => {
              const imagePath = this.ImageUrl + item.image_path;
              if (item.image_path !== null && item.image_path !== "" && !this.evaluatePictureList.includes(imagePath)) {
                this.evaluatePictureList.push(imagePath);
              }
            });
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
        landscapeId: row.id,
      }
      console.log(tableData);
      Updstatus(tableData)
        .then(res => {
          if (res.status === 200) {

            console.log(tableData, 'console.log(tableData);');
            console.log(res, 'sss');
            // this.getArtList(); // 更新列表数据
            this.$message.success(res.data);
          } else {
            this.$message.error(res.data);
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
      } else {
        // 提示用户更新过于频繁
        this.$message.warning('状态更新过于频繁，请稍后再试！');
        this.getArtList();
      }
    },
    addArt() {
      this.dialogVisibleSet = true;
      console.log(this.dialogVisibleSet);
    },
    handleUploadComplete() {
      // 文件上传完成后的回调
      this.dialogVisibleSet = false; // 隐藏 el-dialog
      this.getArtList();
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

