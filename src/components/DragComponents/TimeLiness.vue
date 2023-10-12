<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp">{{activity.title}}</el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { getNewArticlesTwo } from '@/api/ArticleList.api';
export default {
  data() {
    return {
      activities: [
        {
          title: "",
          timestamp: ""
        }
      ]
    };
  },
  created() {
    this.getReportListData(); // 获取最近发布的三篇文章
  },
  methods: {
    // 获取最近发布的三篇文章
    getReportListData() {
      getNewArticlesTwo()
        .then(res => {
          if (res.status === 200) {
            const ArtList = res.data.articles;
            this.activities = ArtList.map(item => ({
              title: item.title,
              timestamp: item.formatted_publish_date,
            }));
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
  }
};
</script>