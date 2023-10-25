
<template>
  <el-image :src="imgs.placeholder" alt="TvImage" class="img lazy-load" :data-src="item.cover">
  </el-image>
  <!-- <div>
    这里放什么
  </div> -->
</template>

<script>
export default {
  data() {
    return {
      imgs: [
        {
          placeholder: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
          cover: 'https://globestudiogallery.com/wp-content/uploads/2021/07/65605.jpg'
        },
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
    //  IntersectionObserver 交叉观察器
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