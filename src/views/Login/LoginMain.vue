<template>
  <component :is="isMobile ? 'login-phone' : 'login-pc'" />
</template>

<script>
import LoginPhone from './loginPhone.vue'
import LoginPc from './loginPc.vue'

export default {
  name: 'LoginMain',
  components: {
    'login-phone': LoginPhone,
    'login-pc': LoginPc
  },
  data() {
    return {
      isMobile: false
    }
  },
  created() {
    this.checkIsMobile()
    window.addEventListener('resize', this.checkIsMobile)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIsMobile)
  },
  methods: {
    checkIsMobile() {
      // 判断UA或窗口宽度
      this.isMobile =
        /Android|webOS|iPhone|iPod|BlackBerry|iPad|Windows Phone/i.test(navigator.userAgent) ||
        window.innerWidth < 768
    }
  }
}
</script>