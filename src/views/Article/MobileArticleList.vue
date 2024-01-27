<template>
  <div>
    <!-- 下划线 -->
    <div class="separator"></div>
    <!-- 文字描述 -->
    <el-card class="card">
      <div class="description">
        <p>
          &emsp;欢迎来到我的个人博客！这里是我分享思考、学习和经验的地方。我将在这里发布关于技术、生活、学术等方面的文章。希望我的分享能够为你提供一些有价值的信息，并激发更多的思考。
        </p>
      </div>
    </el-card>
    <!-- 最近文章 -->
    <el-card class="card">
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
    </el-card>
    <el-card class="card">
      <div class="description">
        <p>
          &emsp;如果你有任何问题、建议或想法，欢迎留言。谢谢你的光临，希望你在这里找到有趣和有益的内容！
        </p>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getart, getCategoriesList, searchArticles } from '@/api/ArticleList.api'
export default {
  components: {

  },
  data() {
    return {
      ImageUrl: this.$store.state.ImageUrl,
      // 图片走马灯的图片数组
      carouselImages: [],
      recentPosts: [],
      articles: [],
      categories: [], // 从后端获取文章分类列表
      selectedCategory: '',
    };
  },
  created() {
    // 获取文章
    this.filterByCategory();
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
    // 根据分类筛选文章
    filterByCategory() {
      const searchCategory = { category: parseInt(this.selectedCategory) }
      getart(searchCategory)
        .then(res => {
          if (res.status === 200) {
            const articles = res.data.articles;
            console.log(articles, 'ss');
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
    // 页面跳转
    navigateToArticle(articleId) {
      // 在这里添加页面跳转逻辑，使用 router.push() 或类似方法进行导航
      // 例如：this.$router.push(`/article/${articleId}`);
      this.$router.push({ name: 'ArticleShow', params: { id: articleId } });
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
};
</script>

<style lang="less" scoped>
.separator {
  margin: 20px 0;
  height: 1px;
  background-color: #ccc;
  width: 80%; /* 设置分隔线宽度 */
  margin-left: auto; /* 左侧自动对齐 */
  margin-right: auto; /* 右侧自动对齐 */
}

.card {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
}

.description {
  /* text-align: center; */
  padding: 20px 0 0 0;
  font-size: 16px;
  color: #666;
}
.description p {
  text-indent: 1em; /* 设置首行缩进 */
  margin-bottom: 1.5em; /* 设置段落间距 */
}

/* 设置最近文章 */
.recent-posts {
  display: flex;
  flex-wrap: wrap;
}

.post-card {
  display: flex;
  margin-bottom: 15px;
}

.post-card img {
  width: 10vh; /* 调整图片宽度 */
  height: 10vh; /* 调整图片高度 */
  object-fit: cover;
  margin-right: 15px; /* 调整图片和文本之间的间距 */
}

.post-info {
  // display: flex;
}

.date {
  font-size: 14px;
  color: #888;
  align-self: flex-end; /* 将日期推到右下角 */
  margin-top: 5px;
  padding-left: 21vh;
}

/* 使用 Flexbox 来布局你的文章列表 */
/* 用于移动响应的调整 */

.articles {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.article {
  display: flex;
  flex-direction: column; /* 为移动设备更改为纵向布局 */
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
  width: 50%; /* 图片大小调整为50% */
  height: auto; /* 自动调整高度 */
  margin: 0 auto; /* 左右居中 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.image_cover {
  margin-top: 10px;
  max-width: 100%; /* 最大宽度100%，确保适应容器大小 */
  max-height: 100%; /* 最大高度100%，确保适应容器大小 */
  border-radius: 10px;
}

.article-details {
  padding: 10px;
}

.article-details h2 {
  margin-top: 0;
  font-size: 18px; /* 为移动设备调整字体大小 */
  line-height: 1.2; /* 为更好的可读性调整行高 */
}

.article-content {
  font-size: 14px; /* 为移动设备调整字体大小 */
  line-height: 1.4; /* 为更好的可读性调整行高 */
}
</style>
