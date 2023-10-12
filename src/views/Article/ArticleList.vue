<template>
  <div class="body">
    <backTop :defaultProps="55" :date="1000" :color="topColor" style="z-index:999;"></backTop>
    <div class="left-side">
      <div class="articles">
        <div v-for="article in articles" :key="article.id" class="article" @click="navigateToArticle(article.id)">
          <div class="image-container">
            <img class="image_cover" :src="ImageUrl+article.image_path" alt="文章图片" v-if="article.image_path" />
          </div>
          <div class="article-details">
            <h2>{{ article.title }}</h2>
            <p class="article-content">{{ truncateContent(article.Introduction) }}</p>
            <div class="article-meta">
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
          <button class="filter-button" @click="searchArticle">搜索</button>
        </div>
        <div class="category-filter">
          <div class="filter-header">
            <h3>分类筛选</h3>
          </div>
          <div class="filter-content">
            <select class="category-select" v-model="selectedCategory">
              <option value="">全部分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id" :label="category.name">{{ category.name }}</option>
            </select>
            <button class="filter-button" @click="filterByCategory">筛选</button>
          </div>
        </div>

        <div class="svgicon">
          <MySvgIcon></MySvgIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import backTop from '../../components/nav/ToTap.vue'
import { getart, getCategoriesList, searchArticles } from '@/api/ArticleList.api'
import MySvgIcon from '@/components/Svg/MySvgIcon.vue'
export default {
  components: {
    MySvgIcon,
    backTop
  },
  data() {
    return {
      articles: [],
      searchQuery: '',
      selectedCategory: '',
      categories: [], // 从后端获取文章分类列表
      ImageUrl: 'http://47.115.231.184:5555',
      // 回到顶部组件颜色
      topColor: '#66ccff',
    };
  },
  created() {
    this.fetchCategoryList();

  },
  mounted() {

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
            this.filterByCategory();
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'axios报错');
        })
    },
    // 页面跳转
    navigateToArticle(articleId) {
      // 在这里添加页面跳转逻辑，使用 router.push() 或类似方法进行导航
      // 例如：this.$router.push(`/article/${articleId}`);
      this.$router.push({ name: 'ArticleShow', params: { id: articleId } });
    },
    // 搜索文章
    searchArticle() {
      const searchArtQuery = { searchQuery: this.searchQuery }
      searchArticles(searchArtQuery)
        .then(res => {
          if (res.status === 200) {
            const articles = res.data.articles;
            this.articles = articles.map(item => ({
              id: item.id,
              category: this.categoryNames[item.category],
              // content: item.content,
              image_path: item.image_path,
              publish_date: item.formatted_publish_date,
              title: item.title,
              Introduction: item.Introduction
            }));
          } else {
            console.log('报错');
          }
        })
        .catch(error => {
          console.error('获取文章列表失败', error);
        });
    },

    // 根据分类筛选文章
    filterByCategory() {
      const searchCategory = { category: parseInt(this.selectedCategory) }
      getart(searchCategory)
        .then(res => {
          if (res.status === 200) {
            const articles = res.data.articles;
            this.articles = articles.map(item => ({
              id: item.id,
              category: this.categoryNames[item.category],
              // content: item.content,
              image_path: item.image_path,
              publish_date: item.formatted_publish_date,
              title: item.title,
              Introduction: item.Introduction
            }));
          } else {
            console.log('报错');
          }
        })
        .catch(error => {
          console.error('获取文章列表失败', error);
        });
    },
    truncateContent(Introduction) {
      const maxLength = 40; // 限制内容显示的最大长度
      if (Introduction.length <= maxLength) {
        return Introduction;
      } else {
        return Introduction.slice(0, maxLength) + '...';
      }
    }
  }
}
</script>

<style scoped>
.body {
  margin: 100px 250px 0 340px;
  padding-top: 80px;
  margin-bottom: 20px;
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
  width: 100%; /* 添加固定宽度 */
}

.article {
  display: flex;
  background-color: #dfd5d5;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
}

.article:hover {
  background-color: #cfc1c1;
  transform: translateY(-5px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

.image-container {
  width: 200px;
  height: 200px;
  padding: 20px;
}

.image_cover {
  width: 100%;
  height: 100%;
  border-radius: 10px;
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
  max-width: 80%; /* 添加最大宽度，根据需要调整 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* .article-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #999;
  font-size: 12px;
} */
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
  width: 200px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-right: 10px;
}

.filter-header {
  margin-bottom: 10px;
}

.filter-content {
  display: flex;
  align-items: center;
}

.category-select {
  width: 200px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-right: 10px;
}

.filter-button {
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.filter-button:hover {
  background-color: #0056b3;
}
</style>
