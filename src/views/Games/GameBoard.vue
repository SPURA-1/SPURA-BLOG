<template>
  <div class="main_wrapper">
    <div class="game_page">
      <div class="game_area">
        <div class="game_container" v-for="game in games" :key="game.id" @mouseover="showDescription(game)" @touchstart="handleTouchStart(game)" @touchend="handleTouchEnd()" @click="showGame(game)">
          <div class="game_cover">
            <img :src="game.cover" alt="Game Cover">
          </div>
        </div>
      </div>
      <div class="description_area" v-if="selectedGame && !isMobile">
        <div class="description_container">
          <div class="game_description">
            <h3>{{ selectedGame.name }}</h3>
            <p>{{ selectedGame.description }}</p>
          </div>
        </div>
      </div>
      <div class="description_area" v-if="!selectedGame">
        <p>外部触摸游戏封面以查看游戏介绍</p>
      </div>
    </div>
    <!-- 游戏界面组件 -->
    <!-- 游戏弹出界面过渡 -->
    <transition name="game-popup">
      <div v-if="showGamePopup" class="game-popup">
        <h3>{{ selectedGame.name }}</h3>
        <!-- 放置游戏比如马里奥的内容 -->
        <!-- 在主页面中显示你的游戏组件 -->
        <!-- <KillPlanetGame /> -->
        <button @click="closeGamePopup" class="close-button">X</button>
      </div>
    </transition>
    <!-- 遮罩层 -->
    <div v-if="showGamePopup" class="overlay"></div>
  </div>
</template>

<script>
// import KillPlanetGame from "@/views/Games/KillPlanetGame.vue";
export default {
  // components: {
  //   KillPlanetGame,
  // },
  data() {
    return {
      games: [
        {
          id: 1,
          name: "Game 1",
          cover: "https://example.com/game1.jpg",
          description: "This is the description for Game 1.",
        },
        {
          id: 3,
          name: "Game 2",
          cover: "https://example.com/game2.jpg",
          description: "This is the description for Game 2.",
        },
        {
          id: 4,
          name: "Game 3",
          cover: "https://example.com/game2.jpg",
          description: "This is the description for Game 3.",
        },
        {
          id: 5,
          name: "Game 4",
          cover: "https://example.com/game2.jpg",
          description: "This is the description for Game 4.",
        },
        {
          id: 6,
          name: "Game 5",
          cover: "https://example.com/game2.jpg",
          description: "This is the description for Game 5.",
        },
        {
          id: 7,
          name: "Game 6",
          cover: "https://example.com/game2.jpg",
          description: "This is the description for Game 6.",
        },
        {
          id: 8,
          name: "Game 7",
          cover: "https://example.com/game2.jpg",
          description: "This is the description for Game 7.",
        },
        {
          id: 9,
          name: "Game 8",
          cover: "https://example.com/game2.jpg",
          description: "This is the description for Game 8.",
        },
        {
          id: 10,
          name: "Game 9",
          cover: "https://example.com/game2.jpg",
          description: "This is the description for Game 9.",
        },
      ],
      selectedGame: null,
      touchStartTime: 0,
      isMobile: false,
      showGamePopup: false, // 控制游戏弹出界面的显示与隐藏
    };
  },
  created() {
    // 在页面创建时重置滚动条位置
    window.scrollTo(0, 0);
  },
  mounted() {
    this.isMobile = this.isMobileDevice();
  },
  methods: {
    showDescription(game) {
      if (!this.isMobile) {
        this.selectedGame = game;
      }
    },
    hideDescription() {
      this.selectedGame = null;
    },
    handleTouchStart(game) {
      if (this.isMobile) {
        this.touchStartTime = new Date().getTime();
        this.showDescription(game);
      }
    },
    handleTouchEnd() {
      if (this.isMobile) {
        const touchEndTime = new Date().getTime();
        // 设置延迟隐藏游戏介绍，避免在短时间内即使触摸离开也立即隐藏
        setTimeout(() => {
          if (touchEndTime - this.touchStartTime > 100) {
            this.hideDescription();
          }
        }, 100);
      }
    },
    isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
    // 游戏界面
    // 打开游戏弹出界面
    showGame(game) {
      this.selectedGame = game;
      this.showGamePopup = true;
      this.stopScroll();
      console.log(game)
      // document.body.style.overflow = 'hidden'; // 禁止页面滚动,两个办法都可以
      console.log(this.selectedGame, 'showgame');
    },

    // 关闭游戏弹出界面
    closeGamePopup() {
      this.selectedGame = null;
      this.showGamePopup = false;
      this.canScroll();
    },
    //禁止滚动

    stopScroll() {
      var mo = function (e) { e.preventDefault(); };
      document.body.style.overflow = 'hidden';
      document.addEventListener("touchmove", mo, false);//禁止页面滑动
    },

    /***取消滑动限制***/
    canScroll() {
      var mo = function (e) { e.preventDefault(); };
      document.body.style.overflow = '';//出现滚动条
      document.removeEventListener("touchmove", mo, false);
    },

  },
};
</script>

<style>
.main_wrapper {
  /* display: flex; */
  justify-content: center;
  padding-top: 80px;
  margin-left: 200px;
  margin-right: 200px;
  margin-bottom: 10px;
  min-height: calc(100vh - 80px);
  background-color: #f9f9f9;
}

.game_page {
  display: flex;
  justify-content: space-between;
}

.game_area {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 10px 50px;
  height: 100%;
}

.game_container {
  width: 150px;
  height: 150px;
  margin: 10px;
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.game_container:hover {
  transform: rotateY(10deg);
}

.game_cover {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.game_cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.description_area {
  flex-basis: 350px; /* 设置介绍区的初始宽度为300px */
  margin-top: 20px;
  margin-right: 50px;
  height: 740px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}

.description_container {
  min-height: 200px; /* 设置固定高度 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.game_description {
  flex: 1;
}

.game_description h3 {
  margin-bottom: 10px;
}

/* 移动设备样式调整 */
@media (max-width: 768px) {
  .main_wrapper {
    display: flex;
    justify-content: center;
    padding-top: 80px;
    margin-left: 0px;
    margin-right: 0px;
    min-height: auto;
    width: 100%;
    background-color: #f9f9f9;
  }

  .game_page {
    display: block;
  }
  .game_container {
    width: calc(50% - 20px); /* 在一行中显示两个元素并留有间距 */
    height: 200px; /* 设置适合移动设备的高度 */
  }
  .game_area {
    display: flex;
    flex-wrap: wrap; /* 将元素换行为多行 */
    justify-content: center; /* 水平居中显示元素 */
    height: auto;
  }

  .description_area {
    height: auto;
    margin: 0px;
  }
}

/* 点击游戏后展开游戏界面的过渡效果 */
.game-popup-enter-active,
.game-popup-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.game-popup-enter,
.game-popup-leave-to {
  opacity: 0;
  transform: scale(0);
}

/* 游戏界面样式 */
/* 游戏弹出界面样式 */
.game-popup {
  width: 80%;
  height: 80%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
}

/* 关闭按钮样式 */
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  cursor: pointer;
  background: none;
  border: none;
}

/* 遮罩层样式 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
}
</style>
