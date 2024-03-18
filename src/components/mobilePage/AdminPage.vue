<template>
  <div>
    <!-- 头部图片走马灯 -->
    <div class="image_body">
      <el-carousel
        :interval="4000"
        arrow="always"
        indicator-position="none"
        height="30vh"
      >
        <el-carousel-item
          v-for="(image, index) in carouselImages"
          :key="index"
        >
          <img
            :src="ImageUrl+image"
            alt="Carousel Image"
            style="max-width: 100%; max-height: 100%; object-fit: contain;"
          />
        </el-carousel-item>
      </el-carousel>
    </div>
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
      <div
        slot="header"
        class="clearfix"
      >
        <h3>最近文章</h3>
      </div>
      <div class="recent-posts">
        <div
          class="post-card"
          v-for="(post, index) in recentPosts"
          :key="index"
        >
          <!-- 插入图片 -->
          <!-- <img
            :src="post.thumbnail"
            alt="Post Thumbnail"
          /> -->
          <div class="post-info">
            <h3 @click="navigateToArticle(post.id)">{{ post.title }}</h3>
            <p class="date">{{ post.date }}</p>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 下方其他内容 -->
    <el-card class="card">
      <div
        slot="header"
        class="clearfix"
      >
        <h3>能力</h3>
      </div>
      <div>
        <BasicRadarChart :chartData="chartData" />
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
import { getNewArticlesTwo } from '@/api/ArticleList.api';
import { getlandscapeImages } from '@/api/homePage.api';
import BasicRadarChart from '@/components/ECharts/BasicRadarChart.vue';
export default {
  components: {
    BasicRadarChart
  },
  data() {
    return {
      ImageUrl: this.$store.state.ImageUrl,
      // 图片走马灯的图片数组
      carouselImages: [],
      recentPosts: [],
      chartData: {
        legendData: ['Allocated Budget', 'Actual Spending'],
        indicator: [
          { name: '分析能力', max: 500 },
          { name: '沟通能力', max: 500 },
          { name: '团队合作', max: 500 },
          { name: '解决问题能力', max: 500 },
          { name: '创新思维', max: 500 },
          { name: '学习能力', max: 500 }
        ],
        seriesName: 'Budget vs spending',
        seriesData: [
          {
            value: [250, 250, 250, 250, 250, 250],
            name: '平均'
          },
          {
            value: [500, 500, 500, 500, 500, 500],
            name: '期望'
          }
        ]
      }
    };
  },
  created() {
    // 获取用户列表页面
    this.getImagesList();
    // 获取最近发布的三篇文章
    this.getReportListData();
  },
  methods: {
    // 获取跑马灯照片
    getImagesList() {
      getlandscapeImages()
        .then(res => {
          if (res.status === 200) {
            console.log(res.data.images, 'ssssssss');
            this.carouselImages = res.data.images.map(image => image.image_path);
          } else {
            console.log('报错');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取最近发布的三篇文章
    getReportListData() {
      getNewArticlesTwo()
        .then(res => {
          if (res.status === 200) {
            const ArtList = res.data.articles;
            this.recentPosts = ArtList.map(item => ({
              id: item.id,
              title: item.title,
              date: item.formatted_publish_date,
            }));
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
    // 页面跳转
    navigateToArticle(articleId) {
      // 在这里添加页面跳转逻辑，使用 router.push() 或类似方法进行导航
      // 例如：this.$router.push(`/article/${articleId}`);
      this.$router.push({ name: 'ArticleShow', params: { id: articleId } });
    },
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
</style>
