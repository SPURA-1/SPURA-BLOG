<template>
  <div class="avatar-container">
    <!-- 已上传的图片列表 -->
    <div class="uploaded-images">
      <p>已上传的图片:</p>
      <el-table
        :data="uploadedImages"
        border
        stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="file_path"
          label="图片"
        >
          <template slot-scope="scope">
            <img
              style="width: 100px; height: 100px"
              :src="imageUrl+scope.row.file_path"
              class="uploaded-image"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
        >
        </el-table-column>
        <el-table-column
          prop="file_path"
          label="地址"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 选择按钮 -->
            <el-button
              type="primary"
              icon="el-icon-check"
              size="mini"
              @click="editImage(scope.row.file_path)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteImage(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <hr /> <!-- 分割线 -->
    </div>

    <!-- 头像封面上传 -->
    <div class="avatar-uploader">
      <el-upload
        ref="avatarUpload"
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
import { GetImages, userUpdAvatar, FileUpdate } from '@/api/UserInfo.api'
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      fileList: [],
      imageUrl: this.$store.state.ImageUrl,
      uploadedImages: [], // 用于存储已上传的图片 URL
    };
  },
  computed: {
    ...mapGetters(['userData']), // 此处应包含 'userNickname' 的映射
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
              // this.uploadedImages.push(res.data.filePath);
              this.AllImage()
              this.$message.success('文件上传成功');
            }
          })
          .catch(error => {
            console.error('文件上传失败', error);
            this.$message.error('文件上传失败');
          });
      });

      this.fileList = []; // 清空文件列表
    },
    AllImage() {
      GetImages()
        .then(res => {
          if (res.status === 200) {
            this.uploadedImages = res.data.images
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
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
    },
    // 编辑按钮
    editImage(index) {
      const Userimage = { Userimage: index }
      userUpdAvatar(Userimage)
        .then(res => {
          if (res.status === 200) {
            // 更新 Vuex 中的用户头像信息
            this.$store.commit('loginMsg', {
              userImg: Userimage.Userimage, // 更新头像信息
              userNickname: this.userData.userNickname // 保持昵称信息
            });
            this.$message.success("头像更换完成");
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
    deleteImage(index) {
      // if (this.canChangePassword) {
      //   console.log(index);
      // } else {
      //   this.$message.error("当前账号没有权限！");
      // }
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
