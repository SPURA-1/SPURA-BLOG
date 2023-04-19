<template>
  <div>
  <div id="layout-header" :class="{ 'fixed': fixed, 'hidden': hidden }" @click.stop="mobileShow = false">
    <div class="site-logo">
      <router-link to="/">
        <img src="@/assets/Main/logo.png" alt="Logo" title="首页">
        <!--        <img :src="websiteInfo.avatar" alt="Logo" title="首页">-->
      </router-link>
    </div>
    <div class="menus-btn" @click.stop="mobileShow = !mobileShow">
      Menus
    </div>
    <div class="site-menus" :class="{ 'mobileShow': mobileShow }" @click.stop="mobileShow = !mobileShow">
      <div class="menu-item header-search">
        <header-search />
      </div>

      <div class="menu-item">
        <router-link to="/Admin-Main">首页</router-link>
      </div>
      <div class="menu-item hasChild">
        <!-- target="_blank" 在新窗口中打开链接 -->
        <a><router-link to="/Test" target="_parent">文章</router-link></a>
        <div class="childMenu" v-if="category.length">
          <div class="sub-menu" v-for="item in category" :key="item.id" @click="goCategory(item)">
            <span>{{ item.sort_name }}</span>
          </div>
        </div>
      </div>
      <div class="menu-item">
        <router-link to="/blockly">编程</router-link>
      </div>
      <div class="menu-item">
        <router-link to="/MessageBoard">友链</router-link>
      </div>
      <div class="menu-item">
        <router-link to="/about">关于</router-link>
      </div>
    </div>
  </div>
    <div class="headImgBox">
      <div class="scene">
        <div><span id="luke"></span></div>
      </div>
      <div class="h-information" >
        <a href="">
          <img src="../../assets/Images/headBg.jpg">
        </a>
        <h2 class="h-description">
          <a>
            {{"ようこそSPURAのブログへ！"}}
          </a>
        </h2>
      </div>
    </div>
  
</div>
</template>

<script>
import HeaderSearch from '../nav/header-search.vue'

export default {
  name: "layout-header",
  components: { HeaderSearch },
  data() {
    return {
      lastScrollTop: 0,
      fixed: false,
      hidden: false,
      category: [],
      websiteInfo: {},
      mobileShow: false,
      test:'6546456'
    }
  },
  mounted() {//页面元素加载完成
    window.addEventListener('scroll', this.watchScroll)
    this.getWebSiteInfo()
    // 首页字体
    var timer = setTimeout(function() {
			Typeit(this.test, "#luke"); //打字机效果
			clearTimeout(timer);
		}, 500);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.watchScroll)
  },
  methods: {
    goCategory(val) {
      localStorage.removeItem("category");
      localStorage.setItem("category", JSON.stringify(val));
      this.$router.push({ name: 'category', params: { cateId: val.id, cate: val.sort_name } });
    },
    watchScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop === 0) {
        this.fixed = false;
      } else if (scrollTop >= this.lastScrollTop) {
        this.fixed = false;
        this.hidden = true;
      } else {
        this.fixed = true
        this.hidden = false
      }
      this.lastScrollTop = scrollTop
    },
    getWebSiteInfo() {
      this.$store.dispatch('getSiteInfo').then(data => {
        this.websiteInfo = data
      }).catch(err => {
        console.log(err)
      })
    },

  }
}
</script>

<style scoped lang="less">
#layout-header {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 80px;
  padding: 0 80px;
  display: flex;
  background-color: #ffffff;
  justify-content: space-between;
  align-items: center;
  transition: .3s all ease;
  -webkit-transition: .3s all ease;
  -moz-transition: .3s all linear;
  -o-transition: .3s all ease;
  -ms-transition: .3s all ease;

  &.hidden {
    top: -100px;
  }

  &.fixed {
    background-color: #FFFFFF;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

.site-logo {
  text-align: center;

  // overflow: hidden;
  img {
    width: 200px;
    height: 65px;
  }

  p.site-name {
    font-size: 15px;
    font-weight: bold;
    position: relative;
    top: -10px;
    font-family: 'monaco', 'Consolas', "Liberation Mono", Courier, monospace;
  }
}

.menus-btn {
  display: none;
  visibility: hidden;
}

.site-menus {
  display: flex;
  align-items: center;

  .menu-item {
    min-width: 60px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: relative;

    a {
      padding: 12px 10px;
      color: #545454;
      font-weight: 500;
      font-size: 16px;
      text-decoration: none;

      &:hover {
        color: #ff6d6d;
      }
    }

    &:not(:last-child) {
      margin-right: 15px;
    }

    &.hasChild:hover .childMenu {
      opacity: 1;
      visibility: visible;
      transform: translateY(-5px);
    }
  }

  .childMenu {
    width: 130px;
    background-color: #FDFDFD;
    border-radius: 3px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 55px;
    z-index: 2;
    opacity: 0;
    visibility: hidden;
    transition: .7s all ease;
    -webkit-transition: .6s all ease;
    -moz-transition: .6s all linear;
    -o-transition: .6s all ease;
    -ms-transition: .6s all ease;

    &:before,
    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 8px solid white;
      top: -8px;
      left: 20px;
    }

    &:before {
      top: -9px;
      border-bottom: 8px solid #ddd;
    }

    .sub-menu {
      height: 40px;
      line-height: 40px;
      position: relative;
      cursor: pointer;
      transition: all .2s linear;

      &:hover {
        color: #ff6d6d;
      }

      &:not(:last-child):after {
        /*position: absolute;*/
        content: '';
        width: 50%;
        height: 1px;
        color: #ff6d6d;
        bottom: 0;
        left: 25%;
        z-index: 99;
      }
    }
  }
}

@media (max-width: 960px) {
  #layout-header {
    padding: 0 20px;
  }
}

@media (max-width: 600px) {
  #layout-header {
    padding: 0 10px;
  }

  .menus-btn {
    display: block;
    visibility: visible;
  }

  .site-menus {
    position: absolute;
    display: none;
    visibility: hidden;
    background-color: #F9F9F9;
    width: 100%;
    left: 0;
    top: 80px;
    z-index: -9;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .menu-item {
      position: relative;
      height: unset;

      &:not(:last-child) {
        margin-right: 0;
      }
    }

    .childMenu {
      position: relative;
      width: 100%;
      top: 0;
      background-color: #F3F3F3;
      opacity: 1;
      visibility: visible;
      border: none;
      box-shadow: none;

      &:before,
      &:after {
        content: '';
        position: relative;
        width: 0;
        height: 0;
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
      }
    }
  }

  .site-menus.mobileShow {
    display: inline-block;
    visibility: visible;
    z-index: 99;
  }
}


/*头部背景图*/

.headImgBox {
  background-image: url(../../assets/Images/headBg.jpg);
  height: 100vh;
  width: 100vw;
  position: relative;
  width: 100%;
  background-size: cover;
  background-position: center 50%;
  background-repeat: no-repeat;
  // margin-top: 80px;
  margin-bottom: 90px;
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
  background: rgba(230, 244, 249, 0.8);
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
    transform: translateY(5px)
  }

  90% {
    -webkit-transform: translateY(-5px);
    transform: translateY(-5px)
  }

  to {
    -webkit-transform: translateY(0);
    transform: translateY(0)
  }
}

@keyframes b {
  0% {
    -webkit-transform: translateY(90px);
    transform: translateY(90px);
  }

  80% {
    -webkit-transform: translateY(5px);
    transform: translateY(5px)
  }

  90% {
    -webkit-transform: translateY(-5px);
    transform: translateY(-5px)
  }

  to {
    -webkit-transform: translateY(0);
    transform: translateY(0)
  }
}

.h-information img {
  width: 100px;
  height: 100px;
  border-radius: 100%;
  transition: all .4s ease-in-out;
  -webkit-transition: all .4s ease-in-out;
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
  background: linear-gradient(to right, #DF2050, #48456D);
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
  font-family: 'Sigmar One', Arial;
  text-shadow: 0 2px 2px #47456d;

}

.headImgBox .scene span {
  transform: matrix(1, 0, 0, 1, 0, 0);
  -webkit-transform: matrix(1, 0, 0, 1, 0, 0);
  text-shadow: 1px 1px 0 #ff3f1a, -1px -1px 0 #00a7e0;
}

.saying:after {
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
}</style>
