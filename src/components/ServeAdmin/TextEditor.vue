<template>
  <div>
    <div style="border: 1px solid #ccc;">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor style="height: 500px; overflow-y: hidden;" v-model="html" :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated" />
    </div>
    <div>
      <div>
        <button @click="getContent">获取内容</button>
      </div>

    </div>

  </div>

</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
export default {
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      html: '',
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'default', // or 'simple'
      headers: [], // 存储标题信息
      articleContent: '',
      parsedArticleContent: '',
    }
  },
  created() {
    this.generateAnchors();
  },
  methods: {
    // 在文章内容中查找标题，并生成锚点目录
    generateAnchors() {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.articleContent, 'text/html');
      console.log(doc, 'doc');
      const headers = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
      console.log(Array.from(headers), '之前');
      this.headers = Array.from(headers).map((header, index) => ({
        id: `header-${index}`,
        text: header.textContent,
        className: `header-${header.tagName.toLowerCase()}`
      }));
      console.log(this.headers);

      const titleElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
      titleElements.forEach((titleElement, index) => {
        titleElement.id = `header-${index}`;
      });

      // 获取带有临时 ID 的解析后的文章内容
      this.parsedArticleContent = doc.documentElement.innerHTML;
      console.log(this.parsedArticleContent, 'kaijuqif');
    },
    // 点击目录中的锚点，滚动到相应的位置
    scrollToAnchor(id) {
      console.log(id);
      const anchorElement = document.querySelector(`#${id}`);
      console.log(anchorElement, 'anchorelement');
      if (anchorElement) {
        anchorElement.scrollIntoView({
          behavior: 'smooth', // 添加滚动动画效果
        });
      }
    },
    onCreated(editor) {
      // 一定要用 Object.seal() ，否则会报错
      this.editor = Object.seal(editor);
    },
    getContent() {
      //   this.updateHeaders(); // 初始化标题信息
      // 获取编辑器内容
      const content = this.html;
      console.log(content, 'ssss');
      this.parsedArticleContent = content;
    },
  },
  mounted() {
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
