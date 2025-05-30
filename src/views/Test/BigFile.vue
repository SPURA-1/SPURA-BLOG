<template>
  <div class="upload-container">
    <!-- 拖拽上传区域 -->
    <div 
      class="drop-zone"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop"
      :class="{ 'dragover': dragOver }"
    >
      <div class="drop-content">
        <span class="icon">📤</span>
        <p>将文件拖拽到此处或</p>
        <button @click.stop="triggerFileSelect">选择文件</button>
        <p class="tip">支持大文件上传，最大10GB</p>
      </div>
    </div>

    <!-- 上传列表 -->
    <div class="upload-list">
      <div
        v-for="file in activeUploads"
        :key="file.hash"
        class="upload-item"
        :class="{
          'uploading': file.status === 'uploading',
          'success': file.status === 'success',
          'error': file.status === 'error'
        }"
      >
        <div class="file-info">
          <span class="filename">{{ file.name }}</span>
          <span class="status">{{ statusText[file.status] }}</span>
          <div class="speed" v-if="file.status === 'uploading'">
            {{ formatSpeed(file.speed) }}
          </div>
          <button
            v-if="file.status === 'uploading'"
            @click="cancelUpload(file)"
            class="cancel-btn"
          >
            取消
          </button>
        </div>

        <!-- 进度条 -->
        <div class="progress-container">
          <div
            class="progress-bar"
            :style="{ width: file.progress + '%' }"
          ></div>
          <span class="progress-text">
            {{ formatSize(file.loaded) }} / {{ formatSize(file.total) }}
            ({{ file.progress.toFixed(1) }}%)
          </span>
        </div>
      </div>
    </div>

    <!-- 已上传文件列表 -->
    <div class="uploaded-files">
      <h3>已上传文件</h3>
      <div class="file-list">
        <div
          v-for="(file, index) in uploadedFiles"
          :key="index"
          class="file-item"
        >
          <div class="file-info">
            <span class="filename">{{ file.originalName }}</span>
            <span class="file-size">{{ formatSize(file.fileSize) }}</span>
          </div>
          <div class="file-actions">
            <button 
              class="preview-btn"
              @click="previewFile(file)"
              title="预览文件"
            >
              <i class="icon-eye"></i>
            </button>
            <button
              class="download-btn"
              @click="downloadFile(file)"
              title="下载文件"
            >
              <i class="icon-download"></i>
            </button>
            <button
              class="delete-btn"
              @click="upstatusFile(file)"
              title="更新状态"
            >
              <i class="icon-trash"></i>
            </button>
            <button
              class="delete-btn"
              @click="deleteFile(file)"
              title="删除文件"
            >
              <i class="icon-trash"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="uploadedFiles.length === 0" class="empty-list">
        暂无已上传文件
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import SparkMD5 from 'spark-md5'
import { getBigFileList, checkBigFileList, uploadBigFileList, mergeBigFile, BigFileStatus, delBigFile } from '@/api/BigFile.api'

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_PARALLEL = 3
const SPEED_UPDATE_INTERVAL = 1000 // 速度更新间隔

export default {
  data() {
    return {
      activeUploads: [], // 当前上传中的文件
      uploadedFiles: [], // 已上传完成的文件
      statusText: {
        uploading: '上传中',
        success: '上传完成',
        error: '上传失败',
        hashing: '计算哈希'
      },
      dragOver: false,
      speedTimer: null
    }
  },

  mounted() {
    this.startSpeedUpdate()
    this.fetchUploadedFiles() // 加载已上传文件列表
  },

  beforeDestroy() {
    clearInterval(this.speedTimer)
  },

  methods: {
    // 初始化速度更新定时器
    startSpeedUpdate() {
      this.speedTimer = setInterval(() => {
        this.activeUploads.forEach(file => {
          if (file.status === 'uploading') {
            const delta = file.loaded - file.lastLoaded
            file.speed = delta / 1024 // KB/s
            file.lastLoaded = file.loaded
          }
        })
      }, SPEED_UPDATE_INTERVAL)
    },

    // 获取已上传文件列表
    async fetchUploadedFiles() {
        // const response = await axios.get('/bigFile/files')
        await getBigFileList()
        .then(response=>{
        this.uploadedFiles = response.data.data
        })
        .catch(error => {
          console.error(error);
        });
    },

    // 触发文件选择
    triggerFileSelect() {
      this.$refs.fileInput.click()
    },

    // 处理拖放文件
    handleDrop(e) {
      this.dragOver = false
      const files = Array.from(e.dataTransfer.files)
      files.forEach(file => this.addFile(file))
    },

    // 处理文件选择
    async handleFileSelect(e) {
      const files = Array.from(e.target.files)
      files.forEach(file => this.addFile(file))
      e.target.value = null // 清空选择
    },

    // 添加文件到上传列表
    async addFile(file) {
      const fileItem = {
        name: file.name,
        size: file.size,
        loaded: 0,
        total: file.size,
        progress: 0,
        status: 'pending',
        hash: '',
        speed: 0,
        lastLoaded: 0,
        controller: new AbortController(),
        file: file
      }

      this.activeUploads.push(fileItem)
      
      try {
        fileItem.status = 'hashing'
        fileItem.hash = await this.calculateHash(file)
        await this.startUpload(file, fileItem)
      } catch (err) {
        this.updateFileStatus(fileItem, 'error')
      }
    },

    // 计算文件哈希（抽样优化）
    calculateHash(file) {
      return new Promise((resolve) => {
        const spark = new SparkMD5.ArrayBuffer()
        const reader = new FileReader()
        const chunkSize = 2 * 1024 * 1024
        const chunks = Math.ceil(file.size / chunkSize)
        const sampleChunks = Math.min(3, chunks)
        
        let currentChunk = 0
        const loadNext = () => {
          const start = currentChunk * chunkSize
          const end = start + chunkSize >= file.size ? file.size : start + chunkSize
          reader.readAsArrayBuffer(file.slice(start, end))
        }

        reader.onload = (e) => {
          spark.append(e.target.result)
          currentChunk++
          
          currentChunk < sampleChunks ? loadNext() : resolve(spark.end())
        }

        loadNext()
      })
    },

    // 开始上传流程
    async startUpload(file, fileItem) {
      // const ext = file.name ? '.' + file.name.split('.').pop() : ''
      // const params = { 
      //       fileHash: fileItem.hash,
      //       ext
      //     }
      // checkBigFileList(params)
      // .then(response=>{

      // })
      // .catch(error=>{

      // })
      try {
        const ext = file.name ? '.' + file.name.split('.').pop() : ''
        const checkRes = await axios.get('/bigFile/check', {
          params: { 
            fileHash: fileItem.hash,
            ext
          }
        })

        if (!checkRes.data.shouldUpload) {
          this.updateFileProgress(fileItem, fileItem.size)
          this.updateFileStatus(fileItem, 'success')
          this.fetchUploadedFiles() // 更新文件列表
          return
        }

        const chunkTasks = []
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
        const existedChunks = checkRes.data.existedChunks || []

        for (let index = 0; index < totalChunks; index++) {
          if (existedChunks.includes(index)) {
            fileItem.loaded += CHUNK_SIZE
            continue
          }

          const chunk = file.slice(
            index * CHUNK_SIZE,
            (index + 1) * CHUNK_SIZE
          )

          const formData = new FormData()
          
            // formData.append('index', index.toString()) // 确保索引是字符串
            formData.append('index', index) // 确保索引是字符串
            formData.append('hash', fileItem.hash)    // 确保包含 hash 参数
            formData.append('file', chunk)
          chunkTasks.push(() => 
            axios.post('/bigFile/upload', formData, {
              signal: fileItem.controller.signal,
              onUploadProgress: (progressEvent) => {
                const loaded = progressEvent.loaded
                fileItem.loaded += loaded - (fileItem.chunkLoaded || 0)
                fileItem.chunkLoaded = loaded
                this.updateFileProgress(fileItem)
              }
            })
          )
        }

        this.updateFileStatus(fileItem, 'uploading')
        await this.parallelExecute(chunkTasks, MAX_PARALLEL)

        await axios.post('/bigFile/merge', {
          filename: file.name,
          fileHash: fileItem.hash
        })

        this.updateFileStatus(fileItem, 'success')
        this.fetchUploadedFiles() // 更新文件列表
        
        // 上传成功后5秒移除
        setTimeout(() => {
          this.activeUploads = this.activeUploads.filter(f => f.hash !== fileItem.hash)
        }, 5000)
      } catch (err) {
        if (!axios.isCancel(err)) {
          this.updateFileStatus(fileItem, 'error')
        }
      }
    },

    // 并行控制
    async parallelExecute(tasks, maxParallel) {
      const executing = new Set()
      const results = []

      for (const task of tasks) {
        const p = task().then(res => {
          executing.delete(p)
          return res
        })
        
        executing.add(p)
        results.push(p)

        if (executing.size >= maxParallel) {
          await Promise.race(executing)
        }
      }

      return Promise.all(results)
    },

    // 更新进度
    updateFileProgress(fileItem) {
      fileItem.progress = Math.min(
        (fileItem.loaded / fileItem.total) * 100,
        100
      )
    },

    // 更新状态
    updateFileStatus(fileItem, status) {
      fileItem.status = status
      if (status !== 'uploading') {
        fileItem.speed = 0
      }
    },

    // 取消上传
    cancelUpload(fileItem) {
      fileItem.controller.abort()
      this.updateFileStatus(fileItem, 'error')
    },
    
    // 预览文件
    previewFile(file) {
      alert(`预览功能开发中，文件: ${file.name}`)
      // 实际实现：
      // window.open(file.url, '_blank')
    },
    
    // 下载文件
    downloadFile(file) {
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.originalName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    
    // 删除文件
    async deleteFile(file) {
      if (confirm(`确定要删除文件 ${file.name} 吗？`)) {
        try {
          await axios.delete(`/bigFile/files/${file.id}`)
          this.fetchUploadedFiles() // 刷新列表
        } catch (error) {
          console.error('删除文件失败:', error)
          alert('删除文件失败')
        }
      }
    },
    // 更新状态
    async upstatusFile(file) {
      if (confirm(`确定要删除文件 ${file.name} 吗？`)) {
        try {
          await axios.post(`/bigFile/files/status`,
            {
              fileId: file.id,
              status: 0,
            }
          )
          this.fetchUploadedFiles() // 刷新列表
        } catch (error) {
          console.error('删除文件失败:', error)
          alert('删除文件失败')
        }
      }
    },

    // 格式化文件大小
    formatSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    // 格式化上传速度
    formatSpeed(kb) {
      if (kb > 1024) {
        return (kb / 1024).toFixed(1) + ' MB/s'
      }
      return kb.toFixed(1) + ' KB/s'
    }
  }
}
</script>

<style scoped>
.upload-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.drop-zone {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s;
  margin-bottom: 20px;
  grid-column: span 2;
}

.drop-zone.dragover {
  border-color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

.drop-content {
  color: #606266;
}

.drop-content .icon {
  font-size: 40px;
  display: block;
  margin-bottom: 10px;
}

button {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #66b1ff;
}

.tip {
  margin-top: 10px;
  color: #909399;
  font-size: 0.9em;
}

.upload-list {
  grid-column: 1;
}

.uploaded-files {
  grid-column: 2;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 15px;
  background: #fafafa;
  max-height: 500px;
  overflow-y: auto;
}

.uploaded-files h3 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  color: #606266;
}

.file-list {
  margin-top: 10px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  transition: background 0.3s;
}

.file-item:hover {
  background: #f5f7fa;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.filename {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.file-size {
  font-size: 0.8em;
  color: #909399;
  margin-top: 3px;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.preview-btn, .download-btn, .delete-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.preview-btn {
  background: #e6f7ff;
  color: #1890ff;
}

.preview-btn:hover {
  background: #bae7ff;
}

.download-btn {
  background: #f6ffed;
  color: #52c41a;
}

.download-btn:hover {
  background: #d9f7be;
}

.delete-btn {
  background: #fff2f0;
  color: #ff4d4f;
}

.delete-btn:hover {
  background: #ffccc7;
}

.empty-list {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-style: italic;
}

/* 原有样式保留 */
.upload-item {
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #fafafa;
}

.upload-item.success {
  border-color: #67c23a;
  background: #f0f9eb;
}

.upload-item.error {
  border-color: #f56c6c;
  background: #fef0f0;
}

.file-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.filename {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status {
  margin: 0 15px;
  color: #666;
  min-width: 60px;
}

.speed {
  margin: 0 15px;
  color: #409eff;
  font-size: 0.9em;
}

.cancel-btn {
  background: #f56c6c;
  padding: 4px 8px;
  font-size: 0.8em;
}

.cancel-btn:hover {
  background: #f78989;
}

.progress-container {
  height: 20px;
  background: #f5f7fa;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #79bbff);
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8em;
  color: #fff;
  text-shadow: 0 0 2px rgba(0,0,0,0.5);
}

/* 图标样式 */
.icon-eye:before {
  content: "👁️";
}

.icon-download:before {
  content: "⬇️";
}

.icon-trash:before {
  content: "🗑️";
}
</style>