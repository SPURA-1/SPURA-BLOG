<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <div id="layout-body" >
    <router-view></router-view>
    <backTop :defaultProps="55" :date="1000" :color="blue"></backTop>
    <Home></Home>
    <ArtLists></ArtLists>
    <MyDemo></MyDemo>
  </div>
  
    
</template>

<script>
import backTop from '../nav/ToTap.vue'
import ArtLists from '../Body/ArtLists.vue'
import MyDemo from '../Body/MyDemo.vue'
import Home from '../../views/HomeSss.vue'
export default {
  name: "layout-body",
  data() {
    return {
      show:true,
      minHeight: 600
    }
  },
  components: { backTop,ArtLists,MyDemo,Home },
  methods:{}
}
</script>

<style scoped>
#layout-body {
  /* header = 80px */
  padding-top: 80px;
  margin-left: 10px;
  margin-right: 10px;
  min-height: -moz-calc(100vh - 80px);
  min-height: -webkit-calc(100vh - 80px);
  min-height: calc(100vh - 80px);
  /*使也页面滚动更顺滑*/
  scroll-behavior: smooth;
}
  /*overflow: hidden;*/

/*****/
@media (max-width: 800px) {
  #layout-body {
    padding-top: 60px;
  }
}

</style>
