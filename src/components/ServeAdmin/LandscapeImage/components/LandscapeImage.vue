<template>
  <div class="avatar-container">
    <!-- 风景上传 -->
    <div class="avatar-uploader">
      <el-upload
        ref="imageUpload"
        drag
        class="avatar-upload"
        action=""
        :http-request="submitUpload"
        :auto-upload="false"
        :on-change="handleAvatarSuccess"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        name="image"
      >
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>

    <!-- 点击按钮上传 -->
    <el-button
      class="upload-button"
      type="primary"
      @click="submitUpload"
    >
      上传
    </el-button>
  </div>
</template>

<script>
import { getlandscapeImages, FileUpdate } from '@/api/homePage.api'
import { mapGetters } from 'vuex'; // 导入 mapGetters
export default {
  data() {
    return {
      ImageUrl: this.$store.state.ImageUrl,
      fileList: [],
      GameList: [],
      uploadedImages: [], // 用于存储已上传的图片 URL
    };
  },
  computed: {
    ...mapGetters(['userRole']),
    canChangePassword() {
      const canChange = this.userRole === 1;
      return canChange;
    }
  },
  created() {
  },
  methods: {
    submitUpload(file) {
      if (this.fileList.length === 0) {
        this.$message({
          type: 'warning',
          message: '没有选中文件!'
        });
        return; // 如果没有选中文件，不执行上传操作
      }
      // 逐个上传文件
      this.fileList.forEach(file => {
        FileUpdate(file.raw) // 使用 file.raw 作为上传的文件数据
          .then(res => {
            if (res.status === 200) {
              this.uploadedImages.push(res.data.filePath);
              this.$message.success('文件上传成功');
              // 将子组件事件传递给父组件
              this.$emit('uploadComplete'); // 发送自定义事件
            }
          })
          .catch(error => {
            console.error('文件上传失败', error);
            this.$message.error('文件上传失败');
          });
      });

      this.fileList = []; // 清空文件列表
    },
    // 文件上传成功后的钩子
    handleAvatarSuccess(res, file, fileList) {
      this.fileList = file; // 更新文件列表
    },
    // 点击文件列表中已上传的文件时的钩子
    handleRemove(file, fileList) {
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
    },
    editImage(index) {
      if (this.canChangePassword) {
      } else {
        this.$message.error("当前账号没有权限！");
      }
    },
    deleteImage(index) {
      if (this.canChangePassword) {
        console.log(index);
      } else {
        this.$message.error("当前账号没有权限！");
      }
    },
  }
};
</script>

<style scoped>
.avatar-container {
  text-align: center;
}

.uploaded-images {
  margin-bottom: 20px;
}

.uploaded-images p {
  font-weight: bold;
}

.uploaded-image {
  max-width: 300px;
  max-height: 300px;
  margin-right: 10px;
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ccc;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
}
.upload-button {
  margin-top: 10px;
}
</style>
