<template>
  <div v-if="SettingBar=== 'horizontal'">
    <AdminHorizontal :SettingColor="SettingColor" />
  </div>
  <div v-else>
    <AdminVertical :SettingColor="SettingColor" />
  </div>
</template>

<script>
import AdminHorizontal from "@/views/Admin-Main/Admin-Main-horizontal.vue";
import AdminVertical from "@/views/Admin-Main/Admin-Main-vertical.vue";
export default {
  components: {
    AdminHorizontal,
    AdminVertical
  },
  name: 'MainPage',
  data() {
    return {
      SettingBar: '',
      SettingColor: ''
    }
  },
  computed: {
  },
  created() {
    const storedSetting = localStorage.getItem('SPURA-setting');
    const parsedSetting = JSON.parse(storedSetting);
    // 如果解析成功，则将值应用于组件数据属性，否则使用默认值
    this.SettingBar = parsedSetting && parsedSetting.layout ? parsedSetting.layout : 'vertical';
    this.SettingColor = parsedSetting && parsedSetting.name ? parsedSetting.name : 'gold';
  },
  methods: {
  },
}
</script>

<style>
</style>