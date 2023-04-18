<template>
  <el-carousel class="carousel" arrow="never">
    <el-carousel-item v-for="item in imgs" :key="item">
      <img :src="item" class="img">
    </el-carousel-item>
  </el-carousel>
</template>
<script>
export default {
  data() {
    return {
      imgs: [
        "https://cdn.pixabay.com/photo/2023/03/22/10/16/sunset-7869120__340.jpg",
        "https://ts1.cn.mm.bing.net/th/id/R-C.efeea7fe9c2700fcff22483246e448db?rik=2GOGPn7eZvqd7A&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0830%2fxiaguang4.jpg&ehk=WiVr1cmj4u7RnOhKcAbAFDCbcnEuMDMJc1g9GVQAoj8%3d&risl=&pid=ImgRaw&r=0",
        "https://cdn.pixabay.com/photo/2023/03/22/10/44/lake-7869160__340.jpg",
        "https://cdn.pixabay.com/photo/2023/03/17/05/20/magome-juku-7857919__340.jpg"
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.img {
  height: 300px;
  display: block;
  margin: 0 auto;
}
</style>

