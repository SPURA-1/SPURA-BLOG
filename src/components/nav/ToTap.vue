<template>
  <div class="backtop" v-show="visible" @click="backTop" v-bind:style="style">
    <canvas id="canvas" width="55" height="55" style="padding: 1.5rem;"></canvas>
  </div>
</template>

<script>
export default {
  data () {
    return {
      'visible': false,
      'ret': 0,
      'obj': null,
      'speed': 0,
      'times': 0,
      'time': 0,
      'style': {
        'position': 'fixed',
        'right': '30px',
        'bottom': '20px',
        'cursor': 'pointer'
      },
      'x': 0,
      'y': 0,
      'translateY': 0,
      'angle': 0
    }
  },
  props: {
    defaultProps: {
      type: Number,
      default: 400
    },
    date: {
      type: Number,
      default: 500
    },
    color: {
      type: String,
      default: '#6495ED'
    }
  },
  mounted () {
    this.darw('#AAD7FF')
    window.addEventListener('scroll',this.hanScroll)
  },
  methods: {
    canvas (ctx,color){
      ctx.save();
      ctx.translate(this.x,this.translateY)
      ctx.lineWidth = 1
      ctx.fillStyle = color
      ctx.strokeStyle = color
      ctx.beginPath()
      ctx.moveTo(this.x-this.x,-(this.y-15))
      ctx.lineTo(-this.x,this.y) //left
      ctx.lineTo(this.x,this.y) //right
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    },
    darw() {
      let canvas = document.getElementById('canvas');
      let ctx = canvas.getContext('2d')
      let vx = 0
      let vy = 0
      this.x = canvas.width /2;
      this.y = canvas.height /2;
      window.requestAnimationFrame(()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height)
        this.darw()
        this.translateY = canvas.height / 2 + Math.sin(this.angle) * 9
        this.angle += 0.1
        this.canvas(ctx, this.color)
      })
      
    },
    hanScroll(){
      const scrollTop = this.getScroll(window)
      this.visible = scrollTop > this.defaultProps
    },
    getScroll(w){
      this.ret = w.pageYOffset
      const method = 'scrollTop'
      if(typeof this.ret !== 'number'){
        let d= w.document;
        this.ret = d.documentElemelnt[method]
        if(typeof this.ret !== 'number'){
          this.ret = d.body[method]
        }
      }
      return this.ret
    },
    backTop(){
      const initerval = 30
      let num = this.date/initerval
      this.time = 0
      this.times = num;
      this.speed = this.ret / num
      this.obj = setInterval(this.setScroll,initerval)
    },
    setScroll(){
      if(this.time > this.times || this.ret<=0){
        clearInterval(this.obj)
        return
      }
      this.time++
      this.ret -= this.speed
      document.documentElement.scrollTop = document.body.scrollTop = this.ret
    }
  }
}
</script>

