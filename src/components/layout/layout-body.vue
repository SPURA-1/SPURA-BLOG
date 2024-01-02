<template>
  <div>
    <div v-if="isMobile">
      <!-- 手机端页面内容 -->
      <div id="layout-body">
        <AdminPage></AdminPage>
      </div>
    </div>
    <div v-else>
      <!-- 头部背景图片 -->
      <div class="headImgBox">
        <!-- 我们使用<video>元素来添加视频背景。autoplay属性使视频自动播放，
        muted属性使视频静音，loop属性使视频循环播放。<source>元素用于指定视频文件的路径和类型。 -->
        <video
          autoplay
          muted
          loop
          id="background-video"
        >
          <source
            src="../../assets/Images/headBg.mp4"
            type="video/mp4"
          >
        </video>
        <div class="scene">
          <p>
            <span class="span1">H</span>
            <span class="span1">E</span>
            <span class="span1">L</span>
            <span class="span1">L</span>
            <span class="span1">O</span>
            <span class="span1">W</span>
            <span class="span1">O</span>
            <span class="span1">R</span>
            <span class="span1">L</span>
            <span class="span1">D</span>
          </p>
        </div>
        <div class="h-information">
          <a href="">
            <img
              src="../../assets/Images/preview.jpg"
              alt="Account Image"
            >
          </a>
          <!-- 在主页中添加一个隐藏的img标签，用于预加载登录界面的背景图片 -->
          <img
            src="../../assets/background.jpg"
            alt="Login Background"
            style="display: none;"
          >
          <h2 class="h-description">
            <a>
              {{ "ようこそSPURAのブログへ！" }}
            </a>
          </h2>
        </div>
      </div>
      <div id="layout-body">
        <backTop
          :defaultProps="55"
          :date="1000"
          :color="topColor"
          style="z-index:999;"
        ></backTop>
        <Home></Home>
      </div>
      <div
        v-if="loading"
        class="loading"
      >
        <div class="spinner-container">
          <div class="spinner"></div>
        </div>
        <p class="load">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import backTop from '../nav/ToTap.vue'
import Home from '../../views/HomeSss.vue'
import AdminPage from '@/components/mobilePage/AdminPage.vue'
export default {
  components: { backTop, Home, AdminPage },
  name: "layout-body",
  data() {
    return {
      // 是否为手机端
      isMobile: false,
      // 回到顶部组件颜色
      topColor: '#66ccff',
      loading: true, // 初始状态下显示加载动画
    }
  },
  created() {
    // 在组件创建时检查是否为手机端
    this.checkIsMobile();
    // 添加窗口大小改变事件监听器，以便动态检测
    window.addEventListener('resize', this.checkIsMobile);
  },
  destroyed() {
    // 移除窗口大小改变事件监听器
    window.removeEventListener('resize', this.checkIsMobile);
  },
  beforeMount() {
    this.loading = true; // 在 beforeMount 中显示加载动画
  },
  mounted() {
    setTimeout(() => {
      this.loading = false; // 全部图片加载完成后关闭加载动画
    }, 1000);
  },
  methods: {
    checkIsMobile() {
      // 设置阈值，小于该值认为是手机端
      const mobileThreshold = 768;
      this.isMobile = window.innerWidth < mobileThreshold;
    },
  },
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

@media (max-width: 800px) {
  #layout-body {
  }
}

/* 首页文字缓慢显示 */
p {
  margin: 0;
  padding: 0;
  position: absolute;
  top: 50%;
  transform: translateY(100%);
  width: 100%;
  text-align: center;
  color: #ddd;
  font-size: 80px;
  font-weight: 500;
  letter-spacing: 0.2em;
}

p span {
  opacity: 0;
  display: inline-block;
}

p span:nth-child(1) {
  animation-delay: 1s;
}

p span:nth-child(2) {
  animation-delay: 2s;
}

p span:nth-child(3) {
  animation-delay: 2.5s;
}

p span:nth-child(4) {
  animation-delay: 3s;
}

p span:nth-child(5) {
  animation-delay: 3.5s;
}

p span:nth-child(6) {
  animation-delay: 3.75s;
  margin-left: 50px;
}

p span:nth-child(7) {
  animation-delay: 4s;
}

p span:nth-child(8) {
  animation-delay: 4.5s;
}

p span:nth-child(9) {
  animation-delay: 5s;
}

p span:nth-child(10) {
  animation-delay: 5.5s;
}

p .span1,
p .span2 {
  opacity: 0;
  transform: rotateY(90deg);
  filter: blur(10px);
}

p .span1 {
  animation: textAnimation1 1s linear forwards;
}

p .span2 {
  animation: textAnimation2 1s linear forwards;
}

@keyframes textAnimation1 {
  0% {
    opacity: 0;
    transform: rotateY(90deg);
    filter: blur(10px);
  }

  100% {
    opacity: 1;
    transform: rotateY(0deg);
    filter: blur(0);
  }
}

@keyframes textAnimation2 {
  0% {
    opacity: 0;
    transform: rotateY(90deg);
    filter: blur(10px);
  }

  100% {
    opacity: 1;
    transform: rotateY(0deg);
    filter: blur(0);
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

/* 头像 */
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
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /* color: transparent; */
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

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  background-color: #4fcef8;
}

.spinner-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.spinner {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #4f6cec;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.load {
  margin-top: 20px;
  margin-left: 20px;
  color: #fff;
  font-size: 28px;
}
</style>
