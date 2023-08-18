<template>
  <!-- 回到顶部按钮容器 -->
  <div class="backtop" v-show="visible" @click="backTop" :style="style">
    <!-- 画布用于绘制三角形 -->
    <canvas id="canvas" width="55" height="55" style="padding: 1.5rem;"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false, // 控制按钮的显示与隐藏
      ret: 0,
      obj: null,
      speed: 0,
      times: 0,
      time: 0,
      style: {
        position: 'fixed',
        right: '30px',
        bottom: '20px',
        cursor: 'pointer'
      },
      x: 0,
      y: 0,
      translateY: 0,
      angle: 0
    };
  },
  props: {
    defaultProps: {
      type: Number,
      default: 400 // 滚动高度达到多少时显示按钮
    },
    duration: {
      type: Number,
      default: 500 // 返回顶部的动画持续时间
    },
    color: {
      type: String,
      default: '#6495ED' // 三角形的颜色
    }
  },
  mounted() {
    this.draw('#AAD7FF'); // 初始化绘制
    window.addEventListener('scroll', this.handleScroll); // 监听滚动事件
  },
  methods: {
    // 绘制三角形
    canvas(ctx, color) {
      ctx.save();
      ctx.translate(this.x, this.translateY);
      ctx.lineWidth = 1;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(this.x - this.x, -(this.y - 15));
      ctx.lineTo(-this.x, this.y); // left
      ctx.lineTo(this.x, this.y); // right
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    },
    // 循环绘制三角形
    draw() {
      let canvas = document.getElementById('canvas');
      let ctx = canvas.getContext('2d');
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      window.requestAnimationFrame(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.draw();
        this.translateY = canvas.height / 2 + Math.sin(this.angle) * 9;
        this.angle += 0.1;
        this.canvas(ctx, this.color);
      });
    },
    // 监听滚动事件
    handleScroll() {
      const scrollTop = this.getScroll(window);
      this.visible = scrollTop > this.defaultProps;
    },
    // 获取滚动高度
    getScroll(w) {
      this.ret = w.pageYOffset;
      const method = 'scrollTop';
      if (typeof this.ret !== 'number') {
        let d = w.document;
        this.ret = d.documentElement[method];
        if (typeof this.ret !== 'number') {
          this.ret = d.body[method];
        }
      }
      return this.ret;
    },
    // 返回顶部的动画
    backTop() {
      const interval = 30;
      let num = this.duration / interval;
      this.time = 0;
      this.times = num;
      this.speed = this.ret / num;
      this.obj = setInterval(this.setScroll, interval);
    },
    // 设置滚动高度
    setScroll() {
      if (this.time > this.times || this.ret <= 0) {
        clearInterval(this.obj);
        return;
      }
      this.time++;
      this.ret -= this.speed;
      document.documentElement.scrollTop = document.body.scrollTop = this.ret;
    }
  }
};
</script>

<style scoped>
.container {
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1); /* 给容器添加阴影 */
}
</style>
