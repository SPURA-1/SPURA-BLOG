<template>
  <div>
    <!-- <Loading v-if="isLoading" /> -->
    <!-- <router-view v-else></router-view> -->
    <router-view></router-view>
  </div>

</template>

<script>
// import Loading from './components/Loading/Loading.vue';
export default {
  // components: {
  //   Loading,
  // },
  name: 'app',
  data() {
    return {
      isLoading: true
    }
  },
  mounted() {
    // this.loadData(); // 在页面加载完成后调用加载数据方法
  },
  methods: {
    // loadData() {
    //   // 模拟加载数据的过程
    //   setTimeout(() => {
    //     this.isLoading = false; // 将加载状态设置为 false，显示实际内容
    //   }, 500); // 延迟时间可以根据需要调整
    // }

  },

}
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
