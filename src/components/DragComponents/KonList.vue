<template>
  <div>
    <el-row :gutter="20">
      <!-- :xs="24"表示在最小的屏幕尺寸下，卡片应该占用整个屏幕的宽度，
           :sm="12"表示在较小的屏幕尺寸下，卡片应该占用屏幕宽度的一半。
           :md="8" 表示在中等屏幕尺寸下，每一列占据 8 格 -->
      <el-col :xs="24" :sm="12" :md="8" v-for="(o, index) in dataList" :key="index">
        <el-card :body-style="{ padding: '0px' }">
          <div class="image-container">
            <img :src="o.cover" class="image" />
          </div>
          <div style="padding: 14px">
            <a :href="o.url" target="blank">{{ o.title }}</a>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "KonList",
  data() {
    return {
      dataList: [
        {
          url: "https://search.bilibili.com/all?keyword=%E7%A5%9E%E7%A7%98%E5%8D%9A%E5%A3%AB&from_source=webtop_search&spm_id_from=666.19&search_source=2",
          title: "神秘博士",
          cover:'https://img5.mtime.cn/img1x/pi/d/2008/50/2008121620545.1875159_1000X1000.jpg'
        },
        {
          url: "https://www.bilibili.com/bangumi/play/ss5448?spm_id_from=333.337.0.0",
          title: "洛基",
          cover: "https://img2.baidu.com/it/u=843496609,49381352&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=741"
        },
        {
          url: "https://search.bilibili.com/all?keyword=%E7%A5%9E%E7%A7%98%E5%8D%9A%E5%A3%AB&from_source=webtop_search&spm_id_from=666.19&search_source=2",
          title: "博士之日",
          cover: "https://img0.baidu.com/it/u=656826553,114856890&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=701"
        }
      ]
    };
  }
};
</script>

<style scoped>
.image-container {
  position: relative;
  height: 0;
  overflow: hidden;
  padding-bottom: 140%;
}
.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
a {
  text-decoration: none;
}
</style>
