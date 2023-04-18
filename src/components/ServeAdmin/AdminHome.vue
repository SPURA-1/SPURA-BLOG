<template>
<div class="div1">
  <h1>这里是首页</h1>
  <div class="chart-box" style="width: 100%; overflow: auto">
    <EChart />
    <p id="htmer_time" style="color: #fd7286;font-size: large;font-weight: bolder;"></p>

  </div>
  
</div>
</template>

<script>
import EChart from '../ECharts/EChart.vue'
import TimeOut from '../../assets/JS/TimeOut'
export default {
  components: {
    EChart
  },
  data() {
    return {
      
    }
    
  },
  created() {
  
  },
  methods: {
    
  }
}
</script>


<style lang="less" scoped>
  .div1 {
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  

</style>