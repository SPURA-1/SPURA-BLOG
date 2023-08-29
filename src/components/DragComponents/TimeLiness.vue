<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp">{{activity.content}}</el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { getNewArticles } from '@/api/ArticleList.api';
import moment from 'moment';
export default {
  data() {
    return {
      // activities: [
      //   {
      //     content: "《神秘博士》",
      //     timestamp: "2019-05-23"
      //   },
      //   {
      //     content: "《洛基第一季》",
      //     timestamp: "2021-06-9"
      //   },
      //   {
      //     content: "《洛基第二季》",
      //     timestamp: "2023-**-**"
      //   }
      // ]
      activities: [
        {
          content: "",
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
      getNewArticles()
        .then(res => {
          if (res.status === 200) {
            const ArtList = res.data.articles;
            console.log(ArtList);
            this.activities = ArtList.map(item => ({
              id: item.id,
              content: item.title,
              timestamp: moment(item.publish_date).format('YYYY-MM-DD HH:mm:ss'), // 使用 moment.js 格式化日期
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