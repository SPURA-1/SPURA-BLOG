<template>
  <div>
    <h1>弹珠游戏</h1>
    <div id="board">
      <div id="paddle" :style="{ left: paddleX + 'px' }"></div>
      <div id="ball" :style="{ left: ballX + 'px', top: ballY + 'px' }" @click="hitBrick"></div>
      <div id="brick-container">
        <div v-for="brick in bricks" :key="brick.id" class="brick" :style="brick.style"></div>
      </div>
    </div>
    <div id="score">{{ score }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      board: null,
      paddleX: 0,
      ballX: 0,
      ballY: 0,
      brickWidth: 75,
      brickHeight: 20,
      brickPadding: 10,
      brickOffsetTop: 30,
      brickOffsetLeft: 30,
      brickRowCount: 3,
      brickColumnCount: 5,
      x: 3,
      y: -3,
      leftPressed: false,
      rightPressed: false,
      score: 0,
      bricks: []
    };
  },
  methods: {
    startGame() {
      this.score = 0;
      this.board = this.$el.querySelector('#board');
      this.paddleX = this.board.offsetWidth / 2 - 40;
      this.ballX = this.board.offsetWidth / 2 - 5;
      this.ballY = this.board.offsetHeight - 20;
      this.createBricks();
      this.addEventListeners();
      this.gameLoop = setInterval(this.update, 20);
    },
    createBricks() {
      this.bricks = [];
      for (let i = 0; i < this.brickRowCount; i++) {
        for (let j = 0; j < this.brickColumnCount; j++) {
          const brick = {
            id: i * this.brickColumnCount + j,
            style: {
              left: j * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft + 'px',
              top: i * (this.brickHeight + this.brickPadding) + this.brickOffsetTop + 'px'
            }
          };
          this.bricks.push(brick);
        }
      }
    },
    addEventListeners() {
      document.addEventListener('keydown', this.keyDownHandler);
      document.addEventListener('keyup', this.keyUpHandler);
    },
    keyDownHandler(e) {
      if (e.keyCode === 37) {
        this.leftPressed = true;
      } else if (e.keyCode === 39) {
        this.rightPressed = true;
      }
    },
    keyUpHandler(e) {
      if (e.keyCode === 37) {
        this.leftPressed = false;
      } else if (e.keyCode === 39) {
        this.rightPressed = false;
      }
    },
    update() {
      this.ballX += this.x;
      this.ballY += this.y;

      // 判断球是否碰到边界
      if (this.ballX < 0 || this.ballX + 10 > this.board.offsetWidth) {
        this.x = -this.x;
      }
      if (this.ballY < 0) {
        this.y = -this.y;
      } else if (this.ballY + 10 > this.board.offsetHeight) {
        // 判断球是否碰到底部，游戏结束
        clearInterval(this.gameLoop);
        alert('游戏结束，你的得分是：' + this.score);
        // this.startGame();
      }

      if (
        this.ballY + 10 > this.board.offsetHeight - 10 &&
        this.ballX + 10 > this.paddleX &&
        this.ballX < this.paddleX + 80
      ) {
        this.y = -this.y;
        this.score += 10; // 碰到挡板加10分
      }
      // 更新挡板位置
      if (this.leftPressed && this.paddleX > 0) {
        this.paddleX -= 5;
      } else if (this.rightPressed && this.paddleX + 80 < this.board.offsetWidth) {
        this.paddleX += 5;
      }

      // 碰撞检测和砖块消失
      this.bricks = this.bricks.filter((brick) => {
        const brickCenterX = parseInt(brick.style.left) + this.brickWidth / 2;
        const brickCenterY = parseInt(brick.style.top) + this.brickHeight / 2;
        const ballCenterX = this.ballX + 5;
        const ballCenterY = this.ballY + 5;
        const dx = Math.abs(ballCenterX - brickCenterX) - this.brickWidth / 2;
        const dy = Math.abs(ballCenterY - brickCenterY) - this.brickHeight / 2;

        if (dx <= 5 && dy <= 5) {
          // 球与砖块碰撞
          this.y = -this.y;
          this.score += 20; // 碰到砖块加20分
          return false; // 移除被撞击的砖块
        }
        return true; // 保留未被撞击的砖块
      });

      if (this.bricks.length === 0) {
        clearInterval(this.gameLoop); // 清除游戏循环
        alert('恭喜你赢得了游戏，你的得分是：' + this.score);
      }
    },
    hitBrick() {
      // 通过 @click 事件触发的方法，无需实现任何具体逻辑，因为碰撞逻辑已经在 update 方法中处理
    }
  },
  mounted() {
    this.startGame();
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyDownHandler);
    document.removeEventListener('keyup', this.keyUpHandler);
  }
};
</script>

<style scoped>
#board {
  width: 480px;
  height: 320px;
  border: 1px solid black;
  position: relative;
  margin: 0 auto;
}
#paddle {
  width: 80px;
  height: 10px;
  background-color: black;
  position: absolute;
  bottom: 0;
}
#ball {
  width: 10px;
  height: 10px;
  background-color: red;
  position: absolute;
  cursor: pointer;
}
.brick {
  width: 75px;
  height: 20px;
  background-color: blue;
  border: 1px solid black;
  position: absolute;
}
#brick-container {
  margin-top: 30px;
}
#score {
  font-size: 24px;
  text-align: center;
}
</style>
