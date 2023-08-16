<template>

  <body>
    <div>
      <layoutHeader></layoutHeader>
      <router-view></router-view>
      <layoutFooter></layoutFooter>
    </div>
  </body>
</template>

<script>

import layoutHeader from '../components/layout/layout-header.vue'
import layoutFooter from '../components/layout/layout-footer.vue'
export default {
  components: {
    layoutHeader,
    layoutFooter
  },
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<style scoped>
</style>
