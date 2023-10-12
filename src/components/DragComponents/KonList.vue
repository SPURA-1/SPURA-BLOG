<template>
  <div>
    <el-row :gutter="20">
      <!-- :xs="24"表示在最小的屏幕尺寸下，卡片应该占用整个屏幕的宽度，
           :sm="12"表示在较小的屏幕尺寸下，卡片应该占用屏幕宽度的一半。
           :md="8" 表示在中等屏幕尺寸下，每一列占据 8 格 -->
      <el-col :xs="24" :sm="12" :md="8" v-for="(o, index) in dataList" :key="index">
        <el-card :body-style="{ padding: '0px' }">
          <div class="image-container">
            <img :src="o.placeholder" alt="TvImage" class="image lazy-load" :data-src="o.cover" />
          </div>
          <div style="padding: 10px">
            <a :href="o.url" target="blank" class="card-title">{{ o.title }}</a>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import VueIntersect from 'vue-intersect';

export default {
  name: "KonList",
  components: {
    // VueIntersect
  },
  data() {
    return {
      dataList: [
        {
          url: "https://search.bilibili.com/all?keyword=%E7%A5%9E%E7%A7%98%E5%8D%9A%E5%A3%AB&from_source=webtop_search&spm_id_from=666.19&search_source=2",
          title: "神秘博士",
          placeholder: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
          cover: 'https://img5.mtime.cn/img1x/pi/d/2008/50/2008121620545.1875159_1000X1000.jpg'
        },
        {
          url: "https://www.bilibili.com/bangumi/play/ss5448?spm_id_from=333.337.0.0",
          title: "洛基",
          placeholder: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
          cover: "https://img2.baidu.com/it/u=843496609,49381352&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=741"
        },
        {
          url: "https://search.bilibili.com/all?keyword=%E7%A5%9E%E7%A7%98%E5%8D%9A%E5%A3%AB&from_source=webtop_search&spm_id_from=666.19&search_source=2",
          title: "博士之日",
          placeholder: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
          cover: "https://img0.baidu.com/it/u=656826553,114856890&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=701"
        }
      ]
    };
  },
  mounted() {
    const images = document.querySelectorAll('.lazy-load');
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(this.loadImage, options);
    images.forEach(img => {
      observer.observe(img);
    });
  },
  methods: {
    loadImage(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const dataSrc = img.getAttribute('data-src');
          if (dataSrc) {
            img.src = dataSrc;
            img.removeAttribute('data-src');
            img.classList.remove('lazy-load');
          }
        }
      });
    },
  },
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
.card-title {
  /* 修改标题文本颜色 */
  color: #96d3f1;
  /* 修改标题字体大小 */
  font-size: 18px;
  /* 去掉下划线 */
  text-decoration: none;
  /* 添加内边距以增加可读性 */
  padding: 10px;
  /* 添加圆角 */
  border-radius: 5px;
  display: flex;
  justify-content: center;
}

.card-title:hover {
  background-color: #ddd; /* 鼠标悬停时修改背景颜色 */
}

.lazy-load {
  /* 设置懒加载图片的占位符，可以使用透明的1x1像素图片或base64编码的透明图片 */
  background: url("data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=")
    no-repeat center center;
  /* 指定图片的尺寸，这个尺寸应该与.image-container的尺寸相同 */
  width: 100%;
  height: 100%;
  /* 使用data-src属性保存真实图片的URL */
}
</style>