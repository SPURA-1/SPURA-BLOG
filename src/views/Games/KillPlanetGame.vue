<template>
  <div class="container" ref="boxRef" @mousedown="onMouseDown" :style="{
    width: '100%',
    height: '100%',
    backgroundColor: [gameStatus === GameStaus.toPlay] ? '#000' : 'transparent',
  }">
    <canvas id="myCanvas2">
      {{ t("common.browserTooLow") }}
    </canvas>
    <button class="startBtn" v-if="gameStatus === GameStaus.toPlay" @click="startGame">
      {{ t("page.canvasDynamicEffect.startGame") }}
    </button>
    <div class="scoreBox" v-else>
      <span>
        {{ t("page.canvasDynamicEffect.score") }}：
      </span>
      <span class="score">{{ score }}</span>
    </div>
    <div class="pauseBtn" v-if="[GameStaus.playing, GameStaus.pause].includes(gameStatus)" @click="pauseGame">
      {{ t("page.canvasDynamicEffect.pause") }}
    </div>
    <div class="gamepause" v-if="gameStatus === GameStaus.pause">
      <h1>
        {{ t("page.canvasDynamicEffect.gameHasPaused") }}
      </h1>
      <button class="continueBtn" @click="continueGame">
        {{ t("page.canvasDynamicEffect.continueTheGame") }}
      </button>
    </div>
    <div class="gameover" v-if="gameStatus === GameStaus.gameover">
      <h1>
        {{ t("page.canvasDynamicEffect.score") }}
        ：<span class="finallyScore">{{ score }}</span>
      </h1>
      <button class="restartBtn" @click="restartGame">
        {{ t("page.canvasDynamicEffect.restart") }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import SphereCollision from "sphere-collision";
// import { SphereCollisionC, GlobuleC } from "sphere-collision/types";
import { SphereCollisionC, GlobuleC } from "sphere-collision";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const canvasBgColor = "rgba(0, 0, 0, .2)"; // 动画时背景颜色
const playerRadius = 20; // 玩家小球半径
const bulletRadius = 5; // 子弹半径
const bulletV = 5; // 子弹速度
const planetInitV = 2.5; // 行星的初始速度
let planetV = planetInitV; // 行星的速度
let canvasWidth = 0; // 画布宽度
let canvasHeight = 0; // 画布高度
let boxOffetLeft = 0; // 该组件离窗口左边的距离
let boxOffetTop = 0; // 该组件离窗口上边的距离

const GameStaus = {
  toPlay: 0,
  playing: 1,
  pause: 2,
  gameover: 3,
};

const Role = {
  player: 0,
  bullet: 1,
  planet: 2,
  particle: 3,
};

const boxRef = ref(null);
let sphereCollisionRef = null;
let timer = null;
let incrementVTimer = null;

const gameStatus = ref(GameStaus.toPlay);
const score = ref(0);

const drawBg = (ctx) => {
  ctx.fillStyle = canvasBgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
};

const beforeDrawGlobules = (sphereCollision) => {
  const { ctx } = sphereCollision;
  drawBg(ctx);
};

const afterDrawGlobules = (sphereCollision) => {
  const { globuleList } = sphereCollision;

  const newGlobuleList = globuleList.filter((global) => {
    const { id, alpha, x, y, radius } = global;

    if (id.role === Role.particle && alpha === 0) {
      return false;
    }

    if (id.role === Role.bullet) {
      if (
        x < -radius ||
        y < -radius ||
        x > canvasWidth + radius ||
        y > canvasHeight + radius
      ) {
        return false;
      }
    }
    return true;
  });

  sphereCollision.updateGlobuleList(newGlobuleList);
};

const checkoutPlayerCollision = (nextFrameGlobule) => {
  const { inCollisionGlobule, inCollisionGlobuleList } = nextFrameGlobule;
  if (inCollisionGlobule) {
    for (let i = 0, l = inCollisionGlobuleList.length; i < l; i++) {
      const otherGlobule = inCollisionGlobuleList[i];
      if (otherGlobule.id.role === Role.planet) {
        sphereCollisionRef?.stop();
        gameStatus.value = GameStaus.gameover;
        return;
      }
    }
  }
};

const checkoutBulletCollision = (nextFrameGlobule) => {
  const { inCollisionGlobule, inCollisionGlobuleList } = nextFrameGlobule;
  if (sphereCollisionRef && inCollisionGlobule) {
    for (let i = 0, l = inCollisionGlobuleList.length; i < l; i++) {
      const otherGlobule = inCollisionGlobuleList[i];
      const { id, x, y, vx, vy, radius, color } = otherGlobule;
      if (id.role === Role.planet) {
        let shouldAddPlanet = false;
        if (radius - 16 > 10) {
          shouldAddPlanet = true;
          score.value += 100;
        } else {
          score.value += 250;
        }

        const newGlobuleList = sphereCollisionRef.globuleList.filter(
          (global) => {
            if (global === nextFrameGlobule || global === otherGlobule) {
              return false;
            }
            return true;
          }
        );

        if (shouldAddPlanet) {
          const newPlanet = sphereCollisionRef.createGlobule({
            id: { role: Role.planet },
            initX: x,
            initY: y,
            radius: radius - 16,
            color,
            vx,
            vy,
            receiveOutForce: false,
            receiveWallForce: false,
          });
          newGlobuleList.unshift(newPlanet);
        }

        for (let i = 0; i < radius * 8; i++) {
          const vx = (Math.random() - 0.5) * (Math.random() * 8);
          const vy = (Math.random() - 0.5) * (Math.random() * 8);
          const particle = sphereCollisionRef.createGlobule({
            id: { role: Role.particle },
            initX: x,
            initY: y,
            radius: Math.random() * 4,
            color,
            alphaChangeV: -0.02,
            vx,
            vy,
            moveLossV: 0.03,
            receiveOutForce: false,
            receiveWallForce: false,
          });
          newGlobuleList.unshift(particle);
        }

        sphereCollisionRef.updateGlobuleList(newGlobuleList);
        return;
      }
    }
  }
};

const initGame = () => {
  canvasWidth = 0;
  canvasHeight = 0;
  boxOffetLeft = 0;
  boxOffetTop = 0;
  const canvas = document.getElementById("myCanvas2");
  if (canvas) {
    if (score.value !== 0) {
      score.value = 0;
    }
    planetV = planetInitV;
    if (boxRef.value) {
      const { offsetWidth, offsetHeight, offsetLeft, offsetTop } =
        boxRef.value;
      canvasWidth = offsetWidth;
      canvasHeight = offsetHeight;
      boxOffetLeft = offsetLeft;
      boxOffetTop = offsetTop;
    } else {
      return;
    }
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d");
    drawBg(ctx);

    sphereCollisionRef = new SphereCollision(
      ctx,
      canvas,
      [
        {
          id: { role: Role.player },
          initX: canvasWidth / 2,
          initY: canvasHeight / 2,
          radius: playerRadius,
          color: "#ffffff",
          fixedPos: true,
          receiveOutForce: false,
          onlyCheckCollision: true,
          afterCalculateNextFrameGlobule: checkoutPlayerCollision,
        },
      ],
      {
        beforeDrawGlobules,
        afterDrawGlobules,
      }
    );
  }
};

const onMouseDown = (e) => {
  if (gameStatus.value !== GameStaus.playing || !sphereCollisionRef) return;
  const angle = Math.atan2(
    e.clientY - boxOffetTop - canvasHeight / 2,
    e.clientX - boxOffetLeft - canvasWidth / 2
  );
  const vx = Math.cos(angle) * bulletV;
  const vy = Math.sin(angle) * bulletV;

  const bullet = sphereCollisionRef.createGlobule({
    id: { role: Role.bullet },
    initX: canvasWidth / 2,
    initY: canvasHeight / 2,
    radius: bulletRadius,
    color: "#ffffff",
    vx,
    vy,
    receiveWallForce: false,
    receiveOutForce: false,
    onlyCheckCollision: true,
    afterCalculateNextFrameGlobule: checkoutBulletCollision,
  });
  sphereCollisionRef.globuleList.unshift(bullet);
};

const startGame = () => {
  gameStatus.value = GameStaus.playing;
  if (sphereCollisionRef) {
    sphereCollisionRef.start();

    if (timer) {
      clearInterval(timer);
      timer = 0;
    }
    timer = window.setInterval(() => {
      if (
        gameStatus.value !== GameStaus.playing ||
        !sphereCollisionRef
      )
        return;

      const radius = Math.random() * (35 - 15) + 15;
      const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
      let initX, initY;
      if (Math.random() < 0.5) {
        initX = Math.random() < 0.5 ? 0 - radius : canvasWidth + radius;
        initY = Math.random() * canvasHeight + radius;
      } else {
        initX = Math.random() * canvasWidth + radius;
        initY = Math.random() < 0.5 ? 0 - radius : canvasHeight + radius;
      }
      const angle = Math.atan2(
        canvasHeight / 2 - initY,
        canvasWidth / 2 - initX
      );
      const vx = Math.cos(angle) * planetV;
      const vy = Math.sin(angle) * planetV;
      const planet = sphereCollisionRef.createGlobule({
        id: { role: Role.planet },
        initX,
        initY,
        radius,
        color,
        vx,
        vy,
        receiveOutForce: false,
        receiveWallForce: false,
      });
      sphereCollisionRef.globuleList.unshift(planet);
    }, 1500);

    if (incrementVTimer) {
      clearInterval(incrementVTimer);
      incrementVTimer = 0;
    }
    incrementVTimer = window.setInterval(function () {
      planetV += 1;
    }, 1000 * 20);
  }
};

const pauseGame = () => {
  if (gameStatus.value !== GameStaus.playing) return;
  gameStatus.value = GameStaus.pause;
  sphereCollisionRef?.stop();
};

const continueGame = () => {
  gameStatus.value = GameStaus.playing;
  sphereCollisionRef?.start();
};

const restartGame = () => {
  gameStatus.value = GameStaus.toPlay;
  initGame();
};

export default {
  data() {
    return {
      gameStatus,
      score,
      GameStaus,
    };
  },
  methods: {
    initGame,
    onMouseDown,
    startGame,
    pauseGame,
    continueGame,
    restartGame,
  },
  mounted() {
    initGame();
  },
  beforeUnmount() {
    sphereCollisionRef?.stop();
    if (timer) {
      clearInterval(timer);
    }
    if (incrementVTimer) {
      clearInterval(incrementVTimer);
    }
  },
};
</script>

<style scoped lang="scss">
.container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  position: relative;

  .startBtn,
  .continueBtn,
  .restartBtn {
    min-width: 200px;
    height: 60px;
    padding: 0 10px;
    background-color: black;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    outline: none;
    border: none;
    border-radius: 20px;
    color: white;
    font-size: 22px;
    cursor: pointer;
    transition: all 0.2s linear;
  }

  .startBtn {
    background-color: white;
    color: black;
  }

  .continueBtn,
  .restartBtn {
    margin-top: 50px;
    font-size: 22px;
  }

  .gamepause,
  .gameover {
    padding: 50px;
    width: 500px;
    height: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    text-align: center;
    border-radius: 20px;

    h1 {
      color: black;
      font-size: 24px;
    }
  }

  .scoreBox {
    font-size: 30px;
    color: white;
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .pauseBtn {
    font-size: 30px;
    color: white;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
}
</style>
