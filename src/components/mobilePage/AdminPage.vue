<template>
  <div>
    <!-- 头部图片走马灯 -->
    <el-carousel
      :interval="4000"
      arrow="always"
    >
      <el-carousel-item
        v-for="(image, index) in carouselImages"
        :key="index"
      >
        <img
          :src="ImageUrl+image"
          alt="Carousel Image"
          style="width: 100%"
        />
      </el-carousel-item>
    </el-carousel>

    <!-- 下方其他内容 -->
    <div>
      <!-- 这里可以放其他你想展示的内容 -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ImageUrl: this.$store.state.ImageUrl,
      // 图片走马灯的图片数组
      carouselImages: [
        'url_to_your_image_1',
        'url_to_your_image_2',
        'url_to_your_image_3',
        // 添加更多图片的 URL
      ],
    };
  },
};
</script>

<style scoped>
/* 可以添加一些样式来调整走马灯的外观 */
/* 例如设置图片宽度、高度等 */
</style>
