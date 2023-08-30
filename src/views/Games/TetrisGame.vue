<template>
  <div class="game">
    <div class="game-div">
      <div class="game-min">
        <div class="row" v-for="(row, i) in frame" :key="i">
          <p class="element" v-for="(col, j) in row" :key="j" :style="{ background: col.bg }"></p>
        </div>
      </div>
      <!-- 小屏幕 -->
      <div class="right-div">
        <div class="ass">
          <div class="row" v-for="(row, i) in ass" :key="i">
            <p class="element" v-for="(col, j) in row" :key="j" :style="{ background: col.bg }"></p>
          </div>
        </div>
        <!-- 分数计算 -->
        <div class="score-div">
          <div>
            <p>
              <span>得分:</span>&emsp;<span style="color: red">{{
                score
              }}</span>
            </p>
          </div>
          <div>
            <p>
              <span>等级:</span>&emsp;<span style="color: red">{{
                level
              }}</span>
            </p>
          </div>
          <div>
            <p>
              <span>消除:</span>&emsp;<span style="color: red">{{
                times
              }}</span>
            </p>
          </div>
          <!-- <div class="ztks" @click="stopGame">暂停/开始</div> -->
          <div class="ztks" @click="toggleGame">{{ stop ? '开始' : '暂停' }}</div>
        </div>
      </div>
    </div>
    <!-- 控制台 -->
    <div class="control" style="display:none;">
      <p @click="change1">变换</p>
      <div class="control-center">
        <div @click="moveLeft">向左</div>
        <div @click="moveRight">向右</div>
      </div>
      <p @click="moveDown">向下</p>
    </div>
  </div>
</template>
 
<script>
import { color, blockMod, transition } from "@/utils/ykdata.js";
export default {
  data() {
    return {
      row: 20, //行
      col: 10, //列
      frame: [], //界面
      ass: [], //副屏幕
      bg: "#eee",
      block: [], //基本方块集合
      now: { b: 0, c: 0 }, //当前方块以及其旋转角度
      next: { b: 0, c: 0 }, //下一个方块以及其旋转角度
      nowBlock: [], //当前形状数据
      nextBlock: [], //下一个形状数据
      xz: 0, //当前旋转角度
      timer: "", //自动下落
      speed: 800, //速度
      score: 0, //得分
      level: 1, //等级
      times: 0, //消除次数
      stop: true, //是否停止
      removeRow: [], //消除的行记录
    };
  },
  mounted() {
    // 监听键盘事件
    window.addEventListener("keydown", this.handleKeyDown);
    this.gameFrame();
    this.getBlock(0);
    this.getNext();
    this.init();
  },
  methods: {
    // 键盘事件处理函数
    handleKeyDown(event) {
      if (!this.stop) { // 只有在游戏已开始时才处理键盘事件
        switch (event.keyCode) {
          case 37: // 左箭头键
            this.moveLeft();
            break;
          case 38: // 上箭头键
            this.change1();
            break;
          case 39: // 右箭头键
            this.moveRight();
            break;
          case 40: // 下箭头键
            this.moveDown();
            break;
          // 可以添加其他按键的处理
        }
      }
    },
    // 游戏框架
    gameFrame() {
      //主屏幕
      for (let i = 0; i < this.row; i++) {
        let a = [];
        for (let j = 0; j < this.col; j++) {
          let b = {
            data: 0,
            bg: this.bg,
          };
          a.push(b);
        }
        this.frame.push(a);
      }
      //副屏幕
      for (let i = 0; i < 4; i++) {
        let a = [];
        for (let j = 0; j < 4; j++) {
          let b = {
            data: 0,
            bg: this.bg,
          };
          a.push(b);
        }
        this.ass.push(a);
      }
      // 模拟格子被占用
      // this.frame[4][4].bg = "#00aaee";
      // this.frame[4][4].data = 1;
    },
    // 渲染方块
    getBlock(e) {
      this.block = blockMod(color[e]);
    },
    // 下一个形状
    async getNext() {
      // 随机获取形状
      this.next.b = Math.floor(Math.random() * this.block.length);
      this.next.c = Math.floor(Math.random() * 4);
    },
    // 渲染当前形状
    init() {
      // 获取到下一个形状数据
      this.now = JSON.parse(JSON.stringify(this.next));
      this.xz = this.now.c;
      // 当前形状数据
      this.nowBlock = JSON.parse(JSON.stringify(this.block[this.now.b]));
      //   渲染形状数据
      //   let c = this.nowBlock.site;
      //   for (let i = 0; i < c.length; i += 2) {
      //     this.frame[c[i]][c[i + 1]].bg = this.nowBlock.color;
      //   }
      this.renderBlock(this.nowBlock, this.frame, 1);
      // 旋转
      if (this.now.c > 0) {
        for (let i = 0; i < this.now.c; i++) {
          this.change(this.nowBlock, this.frame, this.now, i);
        }
      }
      this.getNext().then(() => {
        if (this.nextBlock.site) {
          this.renderBlock(this.nextBlock, this.ass, 0);
        }
        //   下一个形状
        this.nextBlock = JSON.parse(JSON.stringify(this.block[this.next.b]));
        this.renderBlock(this.nextBlock, this.ass, 1);
        // 旋转
        if (this.next.c > 0) {
          for (let i = 0; i < this.next.c; i++) {
            this.change(this.nextBlock, this.ass, this.next, i);
          }
        }
      });
    },
    // 渲染形状
    // b:方块,d:位置,n:0擦除,1生成,2确定落到最下层
    renderBlock(b, d, n) {
      let c = b.site;
      if (n == 0) {
        for (let i = 0; i < c.length; i += 2) {
          d[c[i]][c[i + 1]].bg = this.bg; //0擦除
        }
      } else if (n == 1) {
        for (let i = 0; i < c.length; i += 2) {
          d[c[i]][c[i + 1]].bg = b.color; //1生成
        }
      } else if (n == 2) {
        for (let i = 0; i < c.length; i += 2) {
          d[c[i]][c[i + 1]].data = 1; //2确定落到最下层
        }
      }
    },
    // 旋转 b:当前方块   d:渲染的位置   z:渲染的对象现在还是下一个  xz:当前旋转角度
    change(b, d, z, xz) {
      this.renderBlock(b, d, 0); //先清空再旋转
      // 记录第一块位置
      const x = b.site[0];
      const y = b.site[1];
      for (let i = 0; i < b.site.length; i += 2) {
        let a = b.site[i];
        b.site[i] = b.site[i + 1] - y + x + transition[z.b][xz].x;
        b.site[i + 1] = -(a - x) + y + transition[z.b][xz].y;
      }
      xz++;
      if (xz == 4) {
        xz = 0;
      }
      this.renderBlock(b, d, 1);
    },
    // 向下移动
    moveDown() {
      if (this.canMove(3)) {
        // 先清空
        this.renderBlock(this.nowBlock, this.frame, 0);
        for (let i = 0; i < this.nowBlock.site.length; i += 2) {
          // 向下移动一位
          this.nowBlock.site[i]++;
        }
        this.renderBlock(this.nowBlock, this.frame, 1); //再渲染数据
      } else {
        // 已经不能下落了
        this.renderBlock(this.nowBlock, this.frame, 2);
        // 判断是否可以消除
        this.removeBlock();
      }
    },
    // 向左移动
    moveLeft() {
      if (this.canMove(2)) {
        // 先清空
        this.renderBlock(this.nowBlock, this.frame, 0);
        for (let i = 0; i < this.nowBlock.site.length; i += 2) {
          // 向左移动一位
          this.nowBlock.site[i + 1]--;
        }
        this.renderBlock(this.nowBlock, this.frame, 1); //再渲染数据
      }
    },
    // 向右移动
    moveRight() {
      if (this.canMove(1)) {
        this.renderBlock(this.nowBlock, this.frame, 0);
        for (let i = 0; i < this.nowBlock.site.length; i += 2) {
          this.nowBlock.site[i + 1]++;
        }
        this.renderBlock(this.nowBlock, this.frame, 1); //再渲染数据
      }
    },
    // 是否可移动判断
    // 预判能否移动或变化   e:1右移  2左移  3下移  4变化
    canMove(e) {
      let c = this.nowBlock.site;
      let d = 0;
      switch (e) {
        case 1:
          for (let i = 0; i < c.length; i += 2) {
            if (c[i + 1] >= this.col - 1) {
              return false;
            }
            // 判断下一个位置是否被占用
            d += this.frame[c[i]][c[i + 1] + 1].data;
          }
          if (d > 0) {
            return false;
          }
          break;
        case 2:
          for (let i = 0; i < c.length; i += 2) {
            if (c[i + 1] <= 0) {
              return false;
            }
            // 判断下一个位置是否被占用
            d += this.frame[c[i]][c[i + 1] - 1].data;
          }
          if (d > 0) {
            return false;
          }
          break;
        case 3:
          for (let i = 0; i < c.length; i += 2) {
            if (c[i] >= this.row - 1) {
              return false;
            }
            // 判断下一个位置是否被占用(防穿透)
            d += this.frame[c[i] + 1][c[i + 1]].data;
          }
          if (d > 0) {
            return false;
          }
          break;
        // case 4:
        //   for (let i = 0; i < c.length; i += 2) {
        //     if (c[i + 1] >= this.col - 1) {
        //       return false;
        //     }
        //   }
        //   break;
      }
      return true;
    },
    // 下落时旋转
    // 旋转 b:当前方块  xz:当前旋转角度
    change1() {
      const b = JSON.parse(JSON.stringify(this.nowBlock));
      // 记录第一块位置
      const x = b.site[0];
      const y = b.site[1];
      let n = true;
      for (let i = 0; i < b.site.length; i += 2) {
        let a = b.site[i];
        b.site[i] = b.site[i + 1] - y + x + transition[this.now.b][this.xz].x;
        b.site[i + 1] = -(a - x) + y + transition[this.now.b][this.xz].y;
        // 判断旋转后该点是否合理
        if (
          b.site[i + 1] < 0 ||
          b.site[i + 1] >= this.col ||
          b.site[i] >= this.row ||
          this.frame[b.site[i]][b.site[i + 1]].data > 0
        ) {
          n = false;
        }
      }
      // 符合条件
      if (n) {
        this.renderBlock(this.nowBlock, this.frame, 0); //先清空
        this.xz++;
        if (this.xz == 4) {
          this.xz = 0;
        }
        this.nowBlock = b;
        this.renderBlock(this.nowBlock, this.frame, 1); //再旋转
      }
    },
    // 到底部：确定位置不能再动，保证上面其他方块下落时不会将它穿透
    // 自动下落
    autoMoveDown() {
      this.timer = setInterval(() => {
        this.moveDown();
      }, this.speed);
    },
    // 开始与暂停
    toggleGame() {
      this.stop = !this.stop;
      if (this.stop) {
        clearInterval(this.timer); // 暂停时清除定时器
      } else {
        this.autoMoveDown(); // 继续游戏时启动自动下落
      }
    },
    // 判断是否可以消除
    removeBlock() {
      // 遍历整个界面
      for (let i = 0; i < this.row; i++) {
        let a = 0;
        for (let j = 0; j < this.col; j++) {
          if (this.frame[i][j].data == 1) {
            a++;
          }
        }
        if (a == this.col) {
          // 说明该行已经占满可以消除
          this.removeRow.push(i);
        }
      }
      // 获取是否可以消除行
      if (this.removeRow.length > 0) {
        let l = this.removeRow;
        for (let i = 0; i < l.length; i++) {
          let j = 0;
          let timer = setInterval(() => {
            this.frame[l[i]][j] = { bg: this.bg, data: 0 };
            j++;
            if (j == this.col) {
              clearInterval(timer);
            }
          }, 20);
        }
        setTimeout(() => {
          // 上面方块下移，从下往上判断
          for (let i = this.row - 1; i >= 0; i--) {
            let a = 0;
            for (let j = 0; j < l.length; j++) {
              if (l[j] > i) {
                a++;
              }
            }
            if (a > 0) {
              for (let k = 0; k < this.col; k++) {
                if (this.frame[i][k].data == 1) {
                  // 先向下移动
                  this.frame[i + a][k] = this.frame[i][k];
                  // 再清除当前
                  this.frame[i][k] = { bg: this.bg, data: 0 };
                }
              }
            }
          }
          this.removeRow = []; //清除行记录
          // 生成下一个
          this.init();
        }, 20 * this.col);
        // 数据处理
        // 消除次数+1
        this.times++;
        // 等级向下取整+1
        let lev = Math.floor(this.times / 10) + 1;
        if (lev > this.level) {
          this.level = lev;
          // 速度
          if (this.level < 21) {
            // 20级以内做减法
            this.speed = 800 - (this.level - 1) * 40;
          } else {
            this.speed = 30;
          }
          // 清除当前下落
          clearInterval(this.timer);
          // 加速
          this.autoMoveDown();
        }
        this.level = this.times;
        // 分数消除一行100，两行300，三行600，四行1000
        this.score += ((l.length * (l.length + 1)) / 2) * 100 * this.level;
      } else {
        this.init();
      }
    },
  },
  beforeDestroy() {
    // 在组件销毁前移除事件监听
    window.removeEventListener("keydown", this.handleKeyDown);
  }
};
</script>
 
<style lang='less' scoped>
.game {
  .game-div {
    display: flex;
    .game-min {
      .row {
        display: flex;
        padding-top: 2px;
        .element {
          width: 20px;
          height: 20px;
          padding: 0;
          margin: 0 2px 0 0;
        }
      }
    }
    .right-div {
      padding-left: 20px;
      .ass {
        .row {
          display: flex;
          padding-top: 2px;
          .element {
            width: 20px;
            height: 20px;
            padding: 0;
            margin: 0 2px 0 0;
          }
        }
      }
      .score-div {
        div {
          height: 20px;
          line-height: 20px;
        }
        .ztks {
          width: 100px;
          height: 40px;
          margin-bottom: 10px;
          background-color: palevioletred;
          text-align: center;
          line-height: 40px;
        }
      }
    }
  }
  .control {
    width: 220px;
    p {
      width: 220px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background-color: #b940ef;
      margin-bottom: 20px;
    }
    .control-center {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      div {
        width: 90px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background-color: #b940ef;
      }
    }
  }
}
</style>