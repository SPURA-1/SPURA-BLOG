<template>
  <el-carousel class="carousel" arrow="never">
    <el-carousel-item v-for="(item,index) in imgs" :key="index">
      <img :src="item.placeholder" class="img lazy-load" :data-src="item.cover">
    </el-carousel-item>
  </el-carousel>
</template>
<script>
export default {
  data() {
    return {
      imgs: [
        {
          placeholder: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
          cover: 'https://cdn.pixabay.com/photo/2023/03/22/10/16/sunset-7869120__340.jpg'
        },
        {
          placeholder: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
          cover: 'https://ts1.cn.mm.bing.net/th/id/R-C.efeea7fe9c2700fcff22483246e448db?rik=2GOGPn7eZvqd7A&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0830%2fxiaguang4.jpg&ehk=WiVr1cmj4u7RnOhKcAbAFDCbcnEuMDMJc1g9GVQAoj8%3d&risl=&pid=ImgRaw&r=0'
        },
        {
          placeholder: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
          cover: 'https://cdn.pixabay.com/photo/2023/03/22/10/44/lake-7869160__340.jpg'
        },
        {
          placeholder: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
          cover: 'https://cdn.pixabay.com/photo/2023/03/17/05/20/magome-juku-7857919__340.jpg'
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
<style lang="scss" scoped>
.img {
  height: 300px;
  display: block;
  margin: 0 auto;
}
</style>

