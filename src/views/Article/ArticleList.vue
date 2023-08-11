<template>
  <div class="body">
    <div class="left-side">
      <div class="articles">
        <div v-for="article in articles" :key="article.id" class="article" @click="navigateToArticle(article.id)">
          <div class="image-container">
            <img :src="article.image_path" alt="文章图片" v-if="article.image_path" />
          </div>
          <div class="article-details">
            <h2>{{ article.title }}</h2>
            <p class="article-content">{{ truncateContent(article.Introduction) }}</p>
            <div>
              <p class="" style="display:flex;justify-content: flex-end;">{{ article.category }}</p>
              <p style="display:flex;justify-content: flex-end;">{{ article.publish_date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-side">
      <div class="sidebar">
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="搜索文章" />
          <button @click="searchArticles">搜索</button>
        </div>
        <div class="category-filter">
          <h3>分类筛选</h3>
          <select v-model="selectedCategory">
            <option value="">全部分类</option>
            <option v-for="category in categories" :key="category.id" :label="category.name">{{ category }}</option>
          </select>
          <button @click="filterByCategory">筛选</button>
        </div>
        <div class="svgicon">
          <test></test>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { getart, getCategoriesList } from '@/api/ArticleList.api'
import test from '@/components/Svg/MySvgIcon.vue'
export default {
  components: {
    test
  },
  data() {
    return {
      articles: [],
      searchQuery: '',
      selectedCategory: '',
      categories: [] // 假设你从后端获取文章分类列表
    };
  },
  created() {
    this.fetchCategoryList();
    this.fetchArticles();
  },
  computed: {
    categoryNames() {
      const categoryMap = {}; // 使用一个对象来存储分类 id 到名称的映射
      this.categories.forEach(category => {
        categoryMap[category.id] = category.name;
      });
      return categoryMap;
    }
  },
  methods: {
    // 获取分类列表
    fetchCategoryList() {
      getCategoriesList()
        .then(res => {
          if (res.status === 200) {
            this.categories = res.data.categories;
            console.log(this.categories, '1');
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'axios报错');
        })
    },
    // 获取文章列表
    fetchArticles() {
      getart()
        .then(res => {
          if (res.status === 200) {
            this.articles = res.data.articles;
            this.articles = this.articles.map(item => ({
              id: item.id,
              category: this.categoryNames[item.category],
              content: item.content,
              image_path: item.image_path,
              publish_date: moment(item.publish_date).format('YYYY-MM-DD HH:mm:ss'), // 使用 moment.js 格式化日期
              title: item.title,
              Introduction: item.Introduction
            }));

            console.log(this.articles, 'ss');
          } else {
            console.log('报错');
          }
        })
        .catch(error => {
          console.error('获取文章列表失败', error);
        });
    },
    navigateToArticle(articleId) {
      // 在这里添加页面跳转逻辑，使用 router.push() 或类似方法进行导航
      // 例如：this.$router.push(`/article/${articleId}`);
      this.$router.push({ name: 'ArticleShow', params: { id: articleId } });
      console.log(articleId);
    },
    // 搜索文章
    searchArticles() {
      // 在这里执行搜索逻辑，根据 searchQuery 进行搜索
      // 例如：调用 API 获取搜索结果，然后更新 this.articles
    },

    // 根据分类筛选文章
    filterByCategory() {
      // 在这里执行分类筛选逻辑，根据 selectedCategory 进行筛选
      // 例如：调用 API 获取分类筛选结果，然后更新 this.articles
    },
    truncateContent(content) {
      const maxLength = 40; // 限制内容显示的最大长度
      if (content.length <= maxLength) {
        return content;
      } else {
        return content.slice(0, maxLength) + '...';
      }
    }
  }
}
</script>

<style scoped>
.body {
  margin: 100px 250px 0 340px;
  padding-top: 80px;
  display: flex;
  justify-content: space-around; /* 添加居中对齐 */
}

.left-side {
  flex: 2;
  margin-right: 10px;
}

.right-side {
}

/* 使用 Flexbox 来布局你的文章列表 */
.articles {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 900px; /* 限制最大宽度，可以根据需要调整 */
}

.article {
  display: flex;
  background-color: #dfd5d5;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.article:hover {
  background-color: #cfc1c1;
}

.image-container {
  width: 200px;
  height: 200px;
  padding: 20px;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
}

.article-details {
  flex: 2;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-details h2 {
  margin-top: 0;
}

.article-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 右侧搜索框 */
.sidebar {
  width: 350px;
  height: 420px;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
}

.search-box {
  margin-bottom: 20px;
}

.search-box input {
  width: 70%;
  padding: 5px;
}

.category-filter h3 {
  margin-top: 0;
}

.category-filter select {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
}

/* SVG */
</style>
