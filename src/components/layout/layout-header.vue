<template>
  <div>
    <div
      id="layout-header"
      :class="{ 'fixed': fixed, 'hidden': hidden }"
      @click.stop="mobileShow = false"
    >
      <div class="site-logo">
        <router-link to="/">
          <img
            src="@/assets/Main/logo.png"
            style="width:100%;height:100%;"
            alt="Logo"
            title="首页"
          >
        </router-link>
      </div>
      <div
        class="menus-btn"
        @click.stop="mobileShow = !mobileShow"
      >
        Menu
      </div>
      <div
        class="site-menus"
        :class="{ 'mobileShow': mobileShow }"
        @click.stop="mobileShow = !mobileShow"
      >
        <div class="menu-item">
          <router-link to="/">首页</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/ArticleList">文章</router-link>
        </div>
        <div
          class="menu-item"
          v-if="!isMobile"
        >
          <router-link to="/EsBigScreen">可视化大屏</router-link>
        </div>
        <div
          class="menu-item"
          v-if="!isMobile"
        >
          <router-link to="/blockly">编程</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/GameBoard">娱乐</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/MessageBoard">留言板</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/Admin-Main">后台</router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "layout-header",
  data() {
    return {
      lastScrollTop: 0,
      fixed: false,
      hidden: false,
      category: [],
      mobileShow: false,
      isMobile: false, // 用于判断是否为手机端
    }
  },
  mounted() {
    // 开启监听事件
    window.addEventListener("scroll", this.watchScroll);
    // 在组件挂载时判断是否为手机端
    this.isMobile = this.checkIsMobile();
    console.log(this.isMobile, '判断是否为手机端');
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.watchScroll)
  },
  methods: {
    // 监听页面高度，给页头增加粘性位置
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
    checkIsMobile() {
      // 在这里编写判断是否为手机端的逻辑，例如使用窗口宽度来判断
      return window.innerWidth < 768; // 768 可以根据实际情况调整
    }

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
  transition: 0.3s all ease;
  -webkit-transition: 0.3s all ease;
  -moz-transition: 0.3s all linear;
  -o-transition: 0.3s all ease;
  -ms-transition: 0.3s all ease;

  // &.hidden {
  //   top: -100px;
  // }

  &.fixed {
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

.site-logo {
  text-align: center;

  p.site-name {
    font-size: 15px;
    font-weight: bold;
    position: relative;
    top: -10px;
    font-family: "monaco", "Consolas", "Liberation Mono", Courier, monospace;
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
    background-color: #fdfdfd;
    border-radius: 3px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 55px;
    z-index: 2;
    opacity: 0;
    visibility: hidden;
    transition: 0.7s all ease;
    -webkit-transition: 0.6s all ease;
    -moz-transition: 0.6s all linear;
    -o-transition: 0.6s all ease;
    -ms-transition: 0.6s all ease;

    &:before,
    &:after {
      content: "";
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
      transition: all 0.2s linear;

      &:hover {
        color: #ff6d6d;
      }

      &:not(:last-child):after {
        /*position: absolute;*/
        content: "";
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
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
    font-size: 20px;
  }

  .site-menus {
    position: absolute;
    display: none;
    visibility: hidden;
    background-color: #f9f9f9;
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
      background-color: #f3f3f3;
      opacity: 1;
      visibility: visible;
      border: none;
      box-shadow: none;

      &:before,
      &:after {
        content: "";
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
</style>
