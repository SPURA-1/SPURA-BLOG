<template>
  <div>
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
          data: ['Allocated Budget', 'Actual Spending'],
          textStyle: {
            fontSize: 12,
            color: "#1E1E1E",
          },
          // top: 'bottom',
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: '分析能力', max: 500 },
            { name: '沟通能力', max: 500 },
            { name: '团队合作', max: 500 },
            { name: '解决问题能力', max: 500 },
            { name: '创新思维', max: 500 },
            { name: '学习能力', max: 500 }
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [250, 250, 250, 250, 250, 250],
                name: '平均'
              },
              {
                value: [500, 500, 500, 500, 500, 500],
                name: '期望'
              }
            ]
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
