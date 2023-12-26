<template>
  <el-breadcrumb
    class="el-breadcrumb"
    separator-class="el-icon-arrow-right"
  >
    <template v-for="(item, index) in breadcrumbItems">
      <el-breadcrumb-item
        :key="index"
        v-if="item.name"
        :to="item.path"
      ><el-icon :class="item.icon" />{{ item.title }}</el-breadcrumb-item>
      <el-breadcrumb-item
        :key="index"
        v-else
      ><el-icon :class="item.icon" />{{ item.title }}</el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      breadcrumbItems: [],
    };
  },
  created() {
    this.generateBreadcrumb();
  },
  watch: {
    $route: 'generateBreadcrumb',
  },
  methods: {
    generateBreadcrumb() {
      const matched = this.$route.matched;
      this.breadcrumbItems = [
        ...matched.map(route => ({ title: route.meta.title, path: route.path, icon: route.meta.icon, name: route.name })),
      ];
    },
  },
};
</script>

<style scoped>
/* 样式 */
</style>
