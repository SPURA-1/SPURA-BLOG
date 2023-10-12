<template>
  <div class="body">
    <backTop :defaultProps="55" :date="1000" :color="topColor" style="z-index:999;"></backTop>
    <div>
      <router-link class="back-button" to="/ArticleList">返回</router-link>
    </div>
    <div class="container">
      <div class="left">
        <!-- 使用 v-html 指令渲染富文本内容 -->
        <div class="ArticleShowPage">
          <div v-html="parsedArticleContent" class="article-content"></div>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="right" :class="{ 'fixed': fixed, 'hidden': hidden }">
        <!-- 使用 this.$route.params.id 获取传递的文章 ID -->
        <div class="scroll-container">
          <div class="container_title">目录</div>
          <br>
          <ul id="header-container">
            <li v-for="header in headers" :key="header.id">
              <a @click="scrollToAnchor(header.id)" :class="['anchor-link', header.className, { 'active': activeAnchor === header.id }]">{{ header.text }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import backTop from '../../components/nav/ToTap.vue'
import { getarticlesId } from '@/api/ArticleList.api';
import hljs from 'highlight.js'; // 导入 highlight.js 库
import 'highlight.js/styles/github.css'; // 导入高亮样式
import Clipboard from 'clipboard'; // 一键复制
export default {
  components: {
    backTop
  },
  data() {
    return {
      lastScrollTop: 0,
      fixed: false,
      hidden: false,
      searchData: this.$route.params.id,
      articleContent: '',
      parsedArticleContent: '',
      activeAnchor: null,
      headers: '',
      codeBlocks: [], // 用于存储所有的代码块内容
      // 回到顶部组件颜色
      topColor: '#66ccff',
    }
  },
  created() {
    this.searchPageList();
    // 在页面创建时重置滚动条位置
    window.scrollTo(0, 0);
  },
  mounted() {
    // 开启监听事件
    window.addEventListener("scroll", this.watchScroll);
    // 在组件挂载后调用添加复制按钮的方法
    setTimeout(() => {
      this.addCopyButtonsToCodeBlocks();
    }, 500);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.watchScroll)
  },
  methods: {
    // 监听页面高度，给侧边锚点增加粘性位置
    watchScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop === 0) {
        this.fixed = false;
      } else if (scrollTop >= this.lastScrollTop) {
        this.fixed = false;
        this.hidden = true;
      } else {
        this.fixed = true
        this.hidden = false
      }
      this.lastScrollTop = scrollTop
      // 循环遍历所有锚点元素，确定活动的锚点
      for (const header of this.headers) {
        const targetElement = document.querySelector(`#${header.id}`);
        if (targetElement) {
          const targetRect = targetElement.getBoundingClientRect();
          if (targetRect.top <= window.innerHeight * 0.5 && targetRect.bottom >= window.innerHeight * 0.5) {
            this.activeAnchor = header.id;
            break;
          }
        }
      }
    },
    // 在文章内容中查找标题，并生成锚点目录
    generateAnchors() {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.articleContent, 'text/html');
      // 解析并高亮代码块内的代码
      const codeBlocks = doc.querySelectorAll('pre code');
      codeBlocks.forEach(codeBlock => {
        hljs.highlightElement(codeBlock); // 使用 highlightElement
        this.codeBlocks.push({ content: codeBlock.textContent.trim() });
      });

      // 解析标题,添加ID 附上样式
      const headers = doc.querySelectorAll('h1,h2, h3, h4, h5, h6');
      this.headers = Array.from(headers).map((header, index) => ({
        id: `header-${index}`,
        text: header.textContent,
        className: `header-${header.tagName.toLowerCase()}`
      }));

      const titleElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
      titleElements.forEach((titleElement, index) => {
        titleElement.id = `header-${index}`;
      });

      // 获取带有临时 ID 的解析后的文章内容
      this.parsedArticleContent = doc.documentElement.innerHTML;
    },
    // 点击目录中的锚点，滚动到相应的位置
    scrollToAnchor(id) {
      const anchorElement = document.querySelector(`#${id}`);
      if (anchorElement) {
        anchorElement.scrollIntoView({
          block: "center",
          behavior: 'smooth', // 添加滚动动画效果
        });
      }
    },
    // 获取当前id的文章
    searchPageList() {
      const artId = {
        articleId: this.searchData
      }
      getarticlesId(artId)
        .then(res => {
          if (res.status === 200) {
            this.articleContent = res.data.article.content
            this.generateAnchors();
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
    // 添加复制按钮到代码块
    addCopyButtonsToCodeBlocks() {
      const codeBlocks = document.querySelectorAll('pre code');
      codeBlocks.forEach(codeBlock => {
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制代码';
        // copyButton.classList.add('copy-button'); // 添加类名用于样式控制

        // 设置代码块的相对定位，以便容纳复制按钮
        codeBlock.style.position = 'relative';
        codeBlock.style.border = '#dddddd 1px solid';
        codeBlock.style.margin = '5px';
        codeBlock.style.borderRadius = '5px';
        // 复制按钮样式
        copyButton.style.position = 'absolute';
        copyButton.style.right = '600px';
        copyButton.style.backgroundColor = '#dddddd';
        copyButton.style.color = '#fff';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.margin = '5px';
        copyButton.style.padding = '8px 12px'; // 增加按钮的内边距以增大大小
        copyButton.style.fontSize = '14px'; // 调整字体大小
        copyButton.style.zIndex = '99';
        codeBlock.parentNode.insertBefore(copyButton, codeBlock);

        const clipboard = new Clipboard(copyButton, {
          target: () => codeBlock,
        });

        clipboard.on('success', (e) => {
          e.clearSelection();
          this.$message({
            type: 'success',
            message: '复制成功!'
          });
          // 这里可以添加一些提示，如“代码已复制”之类的信息
        });

        clipboard.on('error', (e) => {
          // 这里可以处理复制失败的情况
          this.$message({
            type: 'warning',
            message: '复制失败!'
          });
        });
      });
    },
  }
}
</script>

<style scoped lang="less">
.body {
  margin: 80px 250px 0 340px;
  padding-top: 80px;
  padding-bottom: 20px;
}

.left {
  padding: 20px;
  margin-right: 10px;
  background-color: #f0f0f0;
  border-radius: 10px;
  max-width: 1000px;
  min-height: 700px;
}

.back-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
}

.right {
  width: 270px;
  min-height: 400px;
  padding: 20px;
  border-radius: 10px;
  background-color: #f2f2f2;
  border-left: 1px solid #ccc;
  position: fixed;
  top: 200px;
  right: 120px;
  z-index: 100;
  transition: 0.3s all ease;
  -webkit-transition: 0.3s all ease;
  -moz-transition: 0.3s all linear;
  -o-transition: 0.3s all ease;
  -ms-transition: 0.3s all ease;

  &.fixed {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
// 目录
.container_title {
  padding: 10px;
  font-size: 18px;
  border-bottom: 1px solid #ccc;
}
// 锚点
.container {
  padding-top: 50px; //遮盖元素的高度，即导航栏高度
  margin-top: -50px;
}
.anchor-link.active {
  color: #007bff; /* 将颜色更改为您希望的活动链接颜色 */
}
/* 高亮代码块样式 */
/* 文章内容样式 */
.article-content {
  padding: 10px;
  font-size: 14px;
  line-height: 1.6;
  overflow-wrap: break-word;
}
.article-content ::selection {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.3);
}

/* 代码块样式 */
.article-content code {
  background-color: #686868;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
}
// 锚点
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

// 锚点目录
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
  padding-bottom: 20px;
}
</style>
