<template>
<body>
  <Header>
    <Blog></Blog>
    <User></User>
  </Header>
</body>
</template>

<script>
import Header from '../../components/TestAdmin/HeaderH.vue'
import Blog from '../../components/TestAdmin/BlogB.vue'
import User from '../../components/TestAdmin/UserU.vue'
// import '@/assets/admin'

export default  {
  data: function() {
return {
    comName: "user",
    beforeUnload_time: "",
  };
},
  mounted: function () {
    window.addEventListener("beforeunload", (e) => this.beforeunloadHandler(e));
    window.addEventListener("unload", (e) => this.unloadHandler(e));
  },
  destroyed() {
    window.removeEventListener("beforeunload", (e) =>
      this.beforeunloadHandler(e)
    );
    window.removeEventListener("unload", (e) => this.unloadHandler(e));
  },
  methods: {
    beforeunloadHandler() {
      this.beforeUnload_time = new Date().getTime();
    },
    unloadHandler(e) {
      this._gap_time = new Date().getTime() - this.beforeUnload_time;
      //判断是窗口关闭还是刷新
      if (this._gap_time <= 5) {
        localStorage.removeItem("verify");
      }
    },
  },
  components:{
    Blog,
    User,
    Header,
  }
}
</script>



<style scoped src="../../assets/CSS/admin-Header.css"></style>
<style scoped src="../../assets/CSS/admin-Blog.css"></style>
<style scoped src="../../assets/CSS/admin-User.css"></style>
<style scoped>

</style>