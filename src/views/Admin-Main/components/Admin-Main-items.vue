<template>
  <div>
    <template v-for="(item, i) in menu">
      <!-- 判断没有子路由的 -->
      <el-menu-item
        v-if="!item.children"
        :key="i"
        :index="item.path"
        @click="$router.push({ path: item.path })"
      >
        <i :class="'' + (item.meta?.icon || 'default-icon')"></i>
        <span>{{ item.meta?.title || 'Default Title' }}</span>
      </el-menu-item>
      <!-- 有子路由的导航 -->
      <el-submenu
        v-else
        :key="i"
        :index="item.path"
      >
        <template slot="title">
          <i :class="'' + (item.meta?.icon || 'default-icon')"></i>
          <span>{{ item.meta?.title || 'Default Title' }}</span>
        </template>
        <!-- 子路由 -->
        <AsideItem :menu="item.children"></AsideItem>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: "AsideItem",
  props: {
    menu: { type: Array },
  },
};
</script>
