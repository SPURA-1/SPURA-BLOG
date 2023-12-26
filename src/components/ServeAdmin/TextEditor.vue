<template>
  <div>
    <!-- 面包屑导航区 -->
    <top-bar />
    <div>
      <div
        class="editor-body"
        style="border: 1px solid #ccc; padding: 10px; margin: 10px 0px;"
      >
        <p class="preview-title">实时预览：</p>
        <div
          v-html="parsedHtml"
          class="article-content"
        ></div>
      </div>
    </div>

    <div style="border: 1px solid #ccc;">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px;"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
      />
    </div>
    <!-- 添加文章 -->
    <el-dialog
      :visible.sync="addArt"
      title="添加"
      width="30%"
      center
    >
      <el-form
        :model="AddArtform"
        label-position="left"
      >
        <el-form-item
          label="文章标题"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="AddArtform.title"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="文章简介"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="AddArtform.Introduction"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="文章分类"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="AddArtform.category"
            placeholder="请选择分类"
            autocomplete="off"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
              :label="category.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addArt = false">取消</el-button>
        <el-button
          type="primary"
          @click="publishArticle"
        >创建</el-button>
      </div>
    </el-dialog>
    <el-button
      type="primary"
      @click="openArtDialog"
    >发表文章</el-button>
  </div>
</template>

<script>
import { PublishArt, getCategoriesList, FileContentUpLoad, } from '@/api/ArticleList.api'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import hljs from 'highlight.js'; // 导入 highlight.js 库
import 'highlight.js/styles/github.css'; // 导入高亮样式
export default {
  components: { Editor, Toolbar },
  data() {
    return {
      formLabelWidth: '120px',
      editor: null,
      html: '',
      toolbarConfig: {},
      editorConfig: {
        placeholder: "请输入内容...",
        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {
          //配置上传图片
          uploadImage: {
            // 自定义上传图片 方法
            customUpload: this.uploadImg,
            // 自定义插入图片 方法
            customInsert: this.insertImg,
            //server必须要配置正确,我这里因为上传图片有点特殊，在下面方法配置了，所以此处不用配置地址
            // server: 'https://xwbdzzz.haiyan.gov.cn:10002/form/temp/update/ajax/img',

            maxFileSize: 4 * 1024 * 1024, // 1M
            // 最多可上传几个文件，默认为 100
            maxNumberOfFiles: 100,
            // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
            allowedFileTypes: [],
            // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
            fieldName: "file",
            meta: {
              //官网中把token放到了这里，但是请求的时候会看不到token
            },
            headers: {
              //所以token放这里
              // token: window.sessionStorage.token,
            },
            // 将 meta 拼接到 url 参数中，默认 false
            metaWithUrl: false,
            // 跨域是否传递 cookie ，默认为 false
            withCredentials: false,
            // 超时时间，默认为 10 秒
            timeout: 5 * 1000, // 5 秒

            // 上传之前触发
            onBeforeUpload(file) {
              // console.log(file, '上传之前触发');    // JS 语法
              // file 选中的文件，格式如 { key: file }
              return file

              // 可以 return
              // 1. return file 或者 new 一个 file ，接下来将上传
              // 2. return false ，不上传这个 file
            },

            // 上传进度的回调函数

            onProgress(progress) {       // JS 语法
              // progress 是 0-100 的数字
              // console.log('progress', progress)
            },

            // 单个文件上传成功之后

            onSuccess(file, res) {          // JS 语法
              // console.log(`${file.name} 上传成功`, res)
            },

            // 单个文件上传失败

            onFailed(file, res) {           // JS 语法
              // console.log(`${file.name} 上传失败`, res)
            },

            // 上传错误，或者触发 timeout 超时

            onError(file, err, res) {               // JS 语法
              // console.log(`${file.name} 上传出错`, err, res)
            },
          },
          // 配置上传视频（同上传图片）
          uploadVideo: {},
        },
      },
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
      publishDebounced: null, // 用于存储防抖后的发布文章函数
    }
  },
  created() {
    this.fetchCategoryList();
    this.createPublishDebounced();
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
    //自定义上传图片
    uploadImg(file) {
      FileContentUpLoad(file) // 使用 file.raw 作为上传的文件数据
        .then(res => {
          if (res.status === 200) {
            this.$message.success('文件上传成功');
            // 上传成功后，将返回的图片地址保存到一个变量中
            const Url = this.$store.state.ImageUrl;
            const fileUrl = res.data.fileContentPath;
            const imageUrl = Url + fileUrl;
            // 在 insertImg 方法中插入图片
            this.insertImg(imageUrl);
          }
        })
        .catch(error => {
          console.error('文件上传失败', error);
          this.$message.error('文件上传失败');
        });
    },
    // 自定义插入图片
    insertImg(imageUrl) {
      const imgHtml = `<img src="${imageUrl}" alt="插入的图片" />`;
      this.html += imgHtml;
      // this.editor.cmd.do('insertHTML', imgHtml);
    },
    // 解析并高亮代码块内的代码
    parseAndHighlightCodeBlocks() {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.html, 'text/html');
      const codeBlocks = doc.querySelectorAll('pre code');

      if (codeBlocks && codeBlocks.length > 0) {
        codeBlocks.forEach(codeBlock => {
          hljs.highlightElement(codeBlock); // 使用 highlightElement
        });
      }
      this.parsedHtml = doc.documentElement.innerHTML;
    },
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
    openArtDialog() {
      this.addArt = true;
    },
    // 创建防抖函数
    createPublishDebounced() {
      // 使用防抖函数（debounce）来包装 publishArticle 函数，以便在一段时间内只触发一次
      this.publishDebounced = this.debounce(this.Article, 1000); // 创建防抖函数，防抖时间间隔为1000毫秒
    },
    // 防抖函数，用于延迟执行一个函数
    debounce(func, wait) {
      // 定义一个 timeoutId 变量，用于存储定时器的 ID
      let timeoutId;
      // 返回一个新的函数，该函数将被用于包装需要防抖的函数（func）
      return function () {
        // 在这里，this 指向包装函数的上下文，即调用 debounce 时的上下文
        const context = this;
        const args = arguments; // 保存传递给包装函数的参数

        // 清除之前的定时器，以防止函数被执行多次
        clearTimeout(timeoutId);

        // 设置一个新的定时器，在一定时间后执行 func 函数，以实现防抖效果
        timeoutId = setTimeout(() => {
          func.apply(context, args); // 用保存的参数调用原始函数
        }, wait);
      };
    },
    // 文章发表
    publishArticle() {
      this.$confirm('文章将要发表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.publishDebounced();
      }).catch(() => {
        this.$message.info('已取消!');
      });
    },
    Article() {
      const startData = {
        title: this.AddArtform.title,          // 标题
        Introduction: this.AddArtform.Introduction,   // 简介
        content: this.html,        // 文章内容
        category: this.AddArtform.category,       // 分类，封面根据分类决定
      }
      // 文章发表接口
      PublishArt(startData)
        .then(res => {
          if (res.status === 200) {
            // this.addArt = false;
            this.$message.success('发表成功!');
            this.$router.push({ path: '/ArtList' });
          } else {
            console.log('报错');
          }
        })
        .catch(error => {
          console.log(error, 'AXIOS报错');
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