<template>
  <div v-if="SettingBar=== 'horizontal'">
<<<<<<< HEAD
    <AdminHorizontal />
  </div>
  <div v-else>
    <AdminVertical />
=======
    <AdminHorizontal :SettingColor="SettingColor" />
  </div>
  <div v-else>
    <AdminVertical :SettingColor="SettingColor" />
>>>>>>> 02d9f3c5b28fb654aae9b63eb63905a160299830
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
<<<<<<< HEAD
      SettingBar: ''
=======
      SettingBar: '',
      SettingColor: ''
>>>>>>> 02d9f3c5b28fb654aae9b63eb63905a160299830
    }
  },
  computed: {
  },
  created() {
    const storedSetting = localStorage.getItem('SPURA-setting');
    const parsedSetting = JSON.parse(storedSetting);
    this.SettingBar = parsedSetting.layout || 'vertical';
<<<<<<< HEAD
=======
    this.SettingColor = parsedSetting.name || 'gold';
>>>>>>> 02d9f3c5b28fb654aae9b63eb63905a160299830
  },
  methods: {
  },
}
</script>

<style>
</style>