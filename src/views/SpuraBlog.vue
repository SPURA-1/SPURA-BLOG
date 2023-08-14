<template>

  <body>
    <Loading v-if="isLoading" />
    <div v-else>
      <layoutHeader></layoutHeader>
      <router-view></router-view>
      <layoutFooter></layoutFooter>
    </div>
  </body>
</template>

<script>
import Loading from '../components/Loading/Loading.vue';
import layoutHeader from '../components/layout/layout-header.vue'
import layoutFooter from '../components/layout/layout-footer.vue'
export default {
  components: {
    Loading,
    layoutHeader,
    layoutFooter
  },
  data() {
    return {
      isLoading: true
    }
  },
  mounted() {
    this.loadData(); // 在页面加载完成后调用加载数据方法
  },
  methods: {
    loadData() {
      // 模拟加载数据的过程
      setTimeout(() => {
        this.isLoading = false; // 将加载状态设置为 false，显示实际内容
      }, 500); // 延迟时间可以根据需要调整
    }
  }
};
</script>

<style scoped>
</style>
