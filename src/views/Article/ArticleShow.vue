<template>
  <div class="body">
    <div>
      <router-link class="back-button" to="/ArticleList">返回</router-link>
    </div>
    <div class="container">
      <div class="left">
        <!-- 使用 v-html 指令渲染富文本内容 -->
        <div class="ArticleShowPage">
          <div v-html="parsedArticleContent"></div>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="right" :class="{ 'fixed': fixed, 'hidden': hidden }">
        <!-- 使用 this.$route.params.id 获取传递的文章 ID -->
        <div class="scroll-container">
          <ul id="header-container">
            <!-- <li v-for="header in headers" :key="header.id" :class="`header-${header.type}`">{{ header.text }}</li> -->
            <!-- <li v-for="header in headers" :key="header.id" @click="scrollToHeader(header.id)" :class="`header-${header.type}`">{{ header.text }}</li> -->
            <li v-for="header in headers" :key="header.id">
              <a @click="scrollToAnchor(header.id)" :class="header.className">{{ header.text }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getarticlesId } from '@/api/ArticleList.api'
export default {
  data() {
    return {
      lastScrollTop: 0,
      fixed: false,
      hidden: false,
      searchData: this.$route.params.id,
      articleContent: '',
      parsedArticleContent: '',
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
    },
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
      console.log(artId);
      getarticlesId(artId)
        .then(res => {
          if (res.status === 200) {
            console.log(res.data, 'sss');
            this.articleContent = res.data.article.content
            this.generateAnchors();
          } else {

          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
    test() {
      console.log(this.searchData);
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s all ease;
  -webkit-transition: 0.3s all ease;
  -moz-transition: 0.3s all linear;
  -o-transition: 0.3s all ease;
  -ms-transition: 0.3s all ease;

  &.fixed {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
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
