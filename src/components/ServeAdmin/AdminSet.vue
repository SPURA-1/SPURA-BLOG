<template>
  <div class="avatar-container">
    <!-- 已上传的图片列表 -->
    <div class="uploaded-images">
      <p>已上传的图片:</p>
      <el-table :data="uploadedImages" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="file_path" label="图片">
          <template slot-scope="scope">
            <img :src="imageUrl+scope.row.file_path" class="uploaded-image" />
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="备注"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editImage(scope.$index)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteImage(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <hr /> <!-- 分割线 -->
    </div>

    <!-- 头像上传 -->
    <div class="avatar-uploader">
      <el-upload ref="avatarUpload" drag class="avatar-upload" action="" :http-request="submitUpload" :auto-upload="false" :on-change="handleAvatarSuccess" :on-preview="handlePreview" :on-remove="handleRemove" name="image">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>

    <!-- 点击按钮上传 -->
    <el-button class="upload-button" type="primary" @click="submitUpload">
      上传
    </el-button>
  </div>
</template>

<script>
import { FileUpdate, GetImages } from '@/api/ArticleList.api'
export default {
  data() {
    return {
      fileList: [],
      imageUrl: 'http://47.115.231.184:5555',
      uploadedImages: [], // 用于存储已上传的图片 URL
    };
  },
  created() {
    this.AllImage();
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
            }
          })
          .catch(error => {
            console.error('文件上传失败', error);
          });
      });

      this.fileList = []; // 清空文件列表
    },
    AllImage() {
      GetImages()
        .then(res => {
          if (res.status === 200) {
            this.uploadedImages = res.data.images
            console.log(this.uploadedImages);
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
    // 文件上传成功后的钩子
    handleAvatarSuccess(res, file, fileList) {
      this.fileList = file; // 更新文件列表
    },
    // 点击文件列表中已上传的文件时的钩子
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      console.log(file);
    },
    editImage(index) {
      console.log(index);
    },
    deleteImage(index) {
      console.log(index);
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
