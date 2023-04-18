<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.timestamp"
      >{{activity.content}}</el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activities: [
        {
          content: "《神秘博士》",
          timestamp: "2019-05-23"
        },
        {
          content: "《洛基第一季》",
          timestamp: "2021-06-9"
        },
        {
          content: "《洛基第二季》",
          timestamp: "2023-**-**"
        }
      ]
    };
  }
};
</script>