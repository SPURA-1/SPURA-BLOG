<template>
  <div v-if="isMobile">
    <AdminMobile :SettingColor="SettingColor" />
  </div>
  <div v-else-if="SettingBar === 'horizontal'">
    <AdminHorizontal :SettingColor="SettingColor" />
  </div>
  <div v-else>
    <AdminVertical :SettingColor="SettingColor" />
  </div>
</template>

<script>
import AdminHorizontal from "@/views/Admin-Main/Admin-Main-horizontal.vue";
import AdminVertical from "@/views/Admin-Main/Admin-Main-vertical.vue";
import AdminMobile from "@/views/Admin-Main/Admin-Main-mobile.vue"; // 你需要新建这个组件

export default {
  components: {
    AdminHorizontal,
    AdminVertical,
    AdminMobile
  },
  name: 'MainPage',
  data() {
    return {
      SettingBar: '',
      SettingColor: '',
      isMobile: false
    }
  },
  created() {
    const storedSetting = localStorage.getItem('SPURA-setting');
    const parsedSetting = JSON.parse(storedSetting);
    this.SettingBar = parsedSetting && parsedSetting.layout ? parsedSetting.layout : 'vertical';
    this.SettingColor = parsedSetting && parsedSetting.name ? parsedSetting.name : 'gold';
    this.checkIsMobile();
    window.addEventListener('resize', this.checkIsMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIsMobile);
  },
  methods: {
    checkIsMobile() {
      this.isMobile = window.innerWidth <= 768;
    }
  },
}
</script>

<style>
</style>