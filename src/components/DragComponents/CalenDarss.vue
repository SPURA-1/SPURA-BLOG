<template>
  <el-calendar v-model="value"></el-calendar>
</template>

<script>
// import calendar from "../DragComponents/calendar";
export default {
  data() {
    return {
      value: new Date()
    };
  }
};
</script>