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
            { name: 'Sales', max: 6500 },
            { name: 'Administration', max: 16000 },
            { name: 'Information Technology', max: 30000 },
            { name: 'Customer Support', max: 38000 },
            { name: 'Development', max: 52000 },
            { name: 'Marketing', max: 25000 }
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
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
