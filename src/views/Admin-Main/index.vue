<template>
  <div v-if="SettingBar=== 'horizontal'">
    <AdminHorizontal />
  </div>
  <div v-else>
    <AdminVertical />
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
      SettingBar: ''
    }
  },
  computed: {
  },
  created() {
    const storedSetting = localStorage.getItem('SPURA-setting');
    const parsedSetting = JSON.parse(storedSetting);
    this.SettingBar = parsedSetting.layout || 'vertical';
  },
  methods: {
  },
}
</script>

<style>
</style>