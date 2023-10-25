<template>
  <div>
    <div ref="BasicRadarChart" style="width:100%;height:17rem;"></div>
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
            color: "#fff",
          },
          // top: 'bottom',
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: 'Sales', max: 500 },
            { name: 'Administration', max: 500 },
            { name: 'Information Technology', max: 500 },
            { name: 'Customer Support', max: 500 },
            { name: 'Development', max: 500 },
            { name: 'Marketing', max: 500 }
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [200, 300, 200, 500, 500, 180],
                name: 'Allocated Budget'
              },
              {
                value: [500, 140, 280, 260, 420, 210],
                name: 'Actual Spending'
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
