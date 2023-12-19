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
    this.SettingBar = parsedSetting.layout || 'vertical';
    this.SettingColor = parsedSetting.name || 'gold';
  },
  methods: {
  },
}
</script>

<style>
</style>