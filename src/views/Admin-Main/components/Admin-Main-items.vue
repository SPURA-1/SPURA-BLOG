<template>
  <div>
    <template v-for="(item, i) in menu">
      <!-- 判断没有子路由的 -->
      <el-menu-item
        v-if="!item.children"
        :key="i"
        :index="item.path"
        @click="handleClick(item.path)"
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
        <AsideItem
          :menu="item.children"
          @saveNavState="handleSaveNavState"
        ></AsideItem>
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
  methods: {
    handleClick(index) {
      this.$emit('saveNavState', index);
      this.$router.push({ path: index })
    },
    handleSaveNavState(activePath) {
      this.$emit('saveNavState', activePath);
    },
  },
};
</script>
