<!-- eslint-disable vue/multi-word-component-names -->
<template>

  <body>
    <!-- 条件渲染：如果页面内容未加载完成，则显示加载页面 -->
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
// import layoutBody from '../components/layout/layout-body.vue'
import layoutFooter from '../components/layout/layout-footer.vue'
export default {
  components: {
    Loading,
    layoutHeader,
    // layoutBody,
    layoutFooter
  },
  data() {
    return {
      isLoading: true // 初始状态为加载中
    }
  },
  created() {
  },
  mounted() {
    // 使用 window.onload 事件监听主页内容加载完成
    window.onload = () => {
      // 使用 setTimeout 添加延迟，确保加载页面至少显示 0.5 秒
      setTimeout(() => {
        this.isLoading = false;
      }, 500); // 延迟时间可以根据需要调整
    };
  },
  // methods: {
  //   // 设置加载状态为 true，并监听 window.onload 事件
  //   startLoading() {
  //     this.isLoading = true;
  //     window.onload = () => {
  //       // 使用 setTimeout 添加延迟，确保加载页面至少显示 1 秒
  //       setTimeout(() => {
  //         this.isLoading = false;
  //       }, 1000); // 延迟时间可以根据需要调整
  //     };
  //   }
  // },
  // // 使用 beforeRouteLeave 导航守卫，在路由离开主页前设置加载状态
  // beforeRouteLeave(to, from, next) {
  //   if (to.path === '/') {
  //     this.startLoading();
  //   }
  //   next();
  // }
};
</script>

<style scoped >
</style>
