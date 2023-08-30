<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <div style="">
    <!-- 头部背景图片 -->
    <div class="headImgBox">
      <!-- 我们使用<video>元素来添加视频背景。autoplay属性使视频自动播放，
        muted属性使视频静音，loop属性使视频循环播放。<source>元素用于指定视频文件的路径和类型。 -->
      <video autoplay muted loop id="background-video">
        <source src="../../assets/Images/headBg.mp4" type="video/mp4">
      </video>
      <div class="scene">
        <div style="margin-top: 150px;"><span id="luke"></span></div>
      </div>
      <div class="h-information">
        <a href="">
          <img src="../../assets/Images/preview.jpg">
        </a>
        <!-- 在主页中添加一个隐藏的img标签，用于预加载登录界面的背景图片 -->
        <img src="../../assets/background.jpg" alt="Login Background" style="display: none;">
        <h2 class="h-description">
          <a>
            {{ "ようこそSPURAのブログへ！" }}
          </a>
        </h2>
      </div>
    </div>
    <div id="layout-body">
      <!-- <router-view></router-view> -->
      <backTop :defaultProps="55" :date="1000" :color="topColor" style="z-index:999;"></backTop>
      <Home></Home>
    </div>
  </div>
</template>

<script>
import backTop from '../nav/ToTap.vue'
import Home from '../../views/HomeSss.vue'
import { Typeit } from '../../utils/plug.js'
export default {
  name: "layout-body",
  data() {
    return {
      show: true,
      minHeight: 600,
      test: '',
      // 回到顶部组件颜色
      topColor: '#66ccff',
    }
  },
  components: { backTop, Home },
  mounted() {
    //页面元素加载完成
    window.addEventListener('scroll', this.watchScroll)
    // 首页字体
    var that = this;
    /*
    在 mounted() 钩子函数中的回调函数中，this 不再指向 Vue 实例，
    所以 Typeit 函数无法找到。
    你可以在回调函数之前先将 this 存储在另一个变量中，
    然后在回调函数中使用该变量
    */
    var timer = setTimeout(function () {
      Typeit(that.test, "#luke"); //打字机效果
      clearTimeout(timer);
    }, 500);
  },
  methods: {},
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

/*头部背景图*/

.headImgBox {
  /* background-image: url(../../assets/Images/headBg.mp4); */
  height: 100vh;
  position: relative;
  width: 100%;
  background-size: cover;
  background-position: center 50%;
  background-repeat: no-repeat;
  /* margin-top: 80px; */
  margin-bottom: 90px;
}

.headVideoBox {
  position: relative;
  overflow: hidden;
}
/* 
    样式中，我们使用position: relative和overflow: hidden来确保视频不会溢出容器。
    #background-video的样式使其占满容器，通过z-index: -1将其放在其他内容下方。
 */
#background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: -1;
}

.h-information {
  text-align: center;
  width: 70%;
  margin: auto;
  position: relative;
  top: 480px;
  padding: 40px 0;
  font-size: 16px;
  opacity: 0.98;
  background: rgba(230, 244, 249, 0.6);
  border-radius: 5px;
  z-index: 1;
  animation: b 1s ease-out;
  -webkit-animation: b 1s ease-out;
}

@-webkit-keyframes b {
  0% {
    -webkit-transform: translateY(90px);
    transform: translateY(90px);
  }

  80% {
    -webkit-transform: translateY(5px);
    transform: translateY(5px);
  }

  90% {
    -webkit-transform: translateY(-5px);
    transform: translateY(-5px);
  }

  to {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
}

@keyframes b {
  0% {
    -webkit-transform: translateY(90px);
    transform: translateY(90px);
  }

  80% {
    -webkit-transform: translateY(5px);
    transform: translateY(5px);
  }

  90% {
    -webkit-transform: translateY(-5px);
    transform: translateY(-5px);
  }

  to {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
}

.h-information img {
  width: 100px;
  height: 100px;
  border-radius: 100%;
  transition: all 0.4s ease-in-out;
  -webkit-transition: all 0.4s ease-in-out;
  object-fit: cover;
}

.h-information img:hover {
  transform: rotate(360deg);
  -webkit-transform: rotate(360deg);
}

.h-information h2 {
  margin-top: 20px;
  font-size: 18px;
  font-weight: 700;
  /*font-family: 'Sigmar One';*/
}

.h-information h2 a {
  background: linear-gradient(to right, #df2050, #48456d);
  -webkit-background-clip: text;
  color: transparent;
}

.headImgBox .scene {
  width: 100%;
  /*height:300px;*/
  text-align: center;
  font-size: 100px;
  font-weight: 200;
  color: #fff;
  position: absolute;
  left: 0;
  top: 160px;
  font-family: "Sigmar One", Arial;
  text-shadow: 0 2px 2px #47456d;
}

.headImgBox .scene span {
  transform: matrix(1, 0, 0, 1, 0, 0);
  -webkit-transform: matrix(1, 0, 0, 1, 0, 0);
  text-shadow: 1px 1px 0 #ff3f1a, -1px -1px 0 #00a7e0;
}

.headImgBox .scene .saying:after {
  content: "|";
  font-family: Arial, sans-serif;
  font-size: 1em;
  /*line-height: 0;*/
  display: inline-block;
  vertical-align: baseline;
  opacity: 1;
  text-shadow: 1px 1px 0 #ff3f1a, -1px -1px 0 #00a7e0;
  animation: caret 500ms infinite;
}

@keyframes caret {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}
</style>
