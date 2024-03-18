<!--
 * @Autor: yangxh 1269825764@qq.com
 * @Date: 2024-01-09 14:24:16
 * @LastEditors: yangxh 1269825764@qq.com
 * @LastEditTime: 2024-03-18 16:32:47
 * @FilePath: \SPURA-BLOG\src\components\ECharts\BasicRadarChart.vue
 * @Description: Do not edit
-->
<template>
  <div :style="{width: chartWidth, height: chartHeight}">
    <div
      ref="BasicRadarChart"
      style="width:100%;height:17rem;"
    ></div>
  </div>
</template>

<script>
// 引入基本模板
let Echarts = require("echarts/lib/echarts");
// 按需引入需要的组件模块
require('echarts/lib/component/legend');
require('echarts/lib/chart/radar');
export default {
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartWidth: {
      type: String,
      default: '100%'
    },
    chartHeight: {
      type: String,
      default: '17rem'
    }
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.createChart();
  },
  methods: {

    createChart() {
      this.chart = Echarts.init(this.$refs.BasicRadarChart);
      const option = {
        legend: {
          left: '1%',
          orient: "vertical", // 垂直排列
          data: this.chartData.legendData || [],
          textStyle: {
            fontSize: 12,
            color: "#1E1E1E",
          },
          // top: 'bottom',
        },
        radar: {
          // shape: 'circle',
          indicator: this.chartData.indicator || []
        },
        series: [
          {
            name: this.chartData.seriesName || '',
            type: 'radar',
            data: this.chartData.seriesData || []
          }
        ]
      };
      this.chart.setOption(option)
    }
  }
};
</script>

<style scoped>
</style>
