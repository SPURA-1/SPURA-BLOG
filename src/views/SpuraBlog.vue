<!-- eslint-disable vue/multi-word-component-names -->
<template>

  <body>
    <layoutHeader></layoutHeader>
    <router-view></router-view>
    <layoutFooter></layoutFooter>

  </body>
</template>

<script>
import layoutHeader from '../components/layout/layout-header.vue'
// import layoutBody from '../components/layout/layout-body.vue'
import layoutFooter from '../components/layout/layout-footer.vue'
export default {
  components: {
    layoutHeader,
    // layoutBody,
    layoutFooter
  },
  data() {
    return {
    }
  },
  created() {
  },
};
</script>

<style scoped >
</style>
