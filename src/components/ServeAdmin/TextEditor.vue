<template>
  <div>
    <div>
      <div class="editor-body" style="border: 1px solid #ccc; padding: 10px; margin: 10px 0px;">
        <p class="preview-title">实时预览：</p>
        <div v-html="parsedHtml" class="article-content"></div>
      </div>
    </div>

    <div style="border: 1px solid #ccc;">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor style="height: 500px;" v-model="html" :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated" />
    </div>
    <!-- 添加文章 -->
    <el-dialog :visible.sync="addArt" title="添加" width="30%" center>
      <el-form :model="AddArtform" label-position="left">
        <el-form-item label="文章标题" :label-width="formLabelWidth">
          <el-input v-model="AddArtform.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章简介" :label-width="formLabelWidth">
          <el-input v-model="AddArtform.Introduction" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" :label-width="formLabelWidth">
          <el-select v-model="AddArtform.category" placeholder="请选择分类" autocomplete="off">
            <el-option v-for="category in categories" :key="category.id" :value="category.id" :label="category.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addArt = false">取消</el-button>
        <el-button type="primary" @click="publishArticle">创建</el-button>
      </div>
    </el-dialog>
    <el-button type="primary" @click="openArtDialog">发表文章</el-button>
  </div>
</template>

<script>
import { PublishArt, getCategoriesList } from '@/api/ArticleList.api'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import hljs from 'highlight.js'; // 导入 highlight.js 库
import 'highlight.js/styles/monokai-sublime.css'; // 导入高亮样式
export default {
  components: { Editor, Toolbar },
  data() {
    return {
      formLabelWidth: '120px',
      editor: null,
      html: '',
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'default', // or 'simple'
      parsedHtml: '', // 存储解析后的 HTML
      addArt: false,
      AddArtform: {
        title: '',          // 标题
        Introduction: '',   // 简介
        content: '',        // 文章内容
        category: '',       // 分类，封面根据分类决定
      },
      categories: [], // 从后端获取文章分类列表
    }
  },
  created() {
    this.fetchCategoryList();
  },
  mounted() {
    // 初始解析渲染
    this.parseAndHighlightCodeBlocks();
  },
  methods: {
    onCreated(editor) {
      // 一定要用 Object.seal() ，否则会报错
      this.editor = Object.seal(editor);
    },
    // 解析并高亮代码块内的代码
    parseAndHighlightCodeBlocks() {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.html, 'text/html');
      const codeBlocks = doc.querySelectorAll('pre code');
      console.log(codeBlocks, 'sssssssssssssssssssssssssss');
      codeBlocks.forEach(codeBlock => {
        hljs.highlightElement(codeBlock); // 使用 highlightElement
      });
      this.parsedHtml = doc.documentElement.innerHTML;
    },
    // 获取分类列表
    fetchCategoryList() {
      getCategoriesList()
        .then(res => {
          if (res.status === 200) {
            this.categories = res.data.categories;
            this.filterByCategory();
            console.log(this.categories, '1');
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'axios报错');
        })
    },
    openArtDialog() {
      this.addArt = true;
    },
    publishArticle() {
      this.$confirm('文章将要发表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        const startData = {
          title: this.AddArtform.title,          // 标题
          Introduction: this.AddArtform.Introduction,   // 简介
          content: this.html,        // 文章内容
          category: this.AddArtform.category,       // 分类，封面根据分类决定
        }
        console.log(startData, '888');
        PublishArt(startData)
          .then(response => {
            if (response.data.status === 200) {
              this.addArt = false;
              this.$message({
                type: 'success',
                message: '发表成功!'
              });
            } else {
              console.log('报错');
            }
          })
          .catch(error => {
            console.log(error, 'AXIOS报错');
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
  },
  watch: {
    // 监听 html 数据变化，实时更新解析后的 HTML 并进行代码高亮
    html() {
      this.parseAndHighlightCodeBlocks();
    },
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style scoped>
/* 高亮代码块样式 */
/* 文章内容样式 */
.article-content {
  font-size: 14px;
  line-height: 1.6;
  overflow-wrap: break-word;
}

/* 代码块样式 */
.article-content code {
  background-color: #686868;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
}
/* 添加预览标题样式 */
.preview-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}

.editor-body {
  height: 420px;
  overflow: auto;
  max-height: 800px; /* 设置最大高度 */
}

#header-container {
  list-style-type: none;
  padding-left: 20px;
  transition: background-color 0.3s;
}

#header-container li {
  color: #333;
  margin: 10px 0;
  cursor: pointer;
  transition: color 0.3s;
}

#header-container li:hover {
  /* text-decoration: underline; */
  background-color: #f2f2f2;
  color: #007bff; /* 示例颜色，可以根据需求修改 */
}

.header-h1 {
  font-size: 20px;
  font-weight: bold;
}

.header-h2 {
  font-size: 16px;
  padding-left: 15px;
  font-weight: bold;
}

.header-h3 {
  font-size: 14px;
  padding-left: 30px;
}

.header-h4 {
  font-size: 12px;
  padding-left: 45px;
}

.header-h5 {
  font-size: 12px;
  padding-left: 60px;
}
.ArticleShowPage {
  color: #383838;
  font-size: 15px;
  line-height: 30px;
  letter-spacing: 2px;
  word-break: break-word;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
  scroll-behavior: smooth;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(201, 195, 195, 0.329) 25%,
      hsla(0, 8%, 80.4%, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      hsla(0, 5.2%, 81%, 0.185) 75%,
      rgba(180, 176, 176, 0.05) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(204, 196, 196, 0.226) 25%,
      hsla(0, 4%, 66.1%, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      hsla(0, 5.2%, 81%, 0.185) 75%,
      rgba(180, 176, 176, 0.05) 76%,
      transparent 77%,
      transparent
    );
  background-color: #fff;
  background-size: 50px 50px;
  padding-bottom: 60px;
}
</style>