<template>
  <div>
    <div ref="GaugeBasicChart" style="width:100%;height:17rem;"></div>
  </div>
</template>

<script>
// 引入基本模板
let Echarts = require("echarts/lib/echarts");
// 按需引入需要的组件模块
require('echarts/lib/component/title');
require('echarts/lib/chart/gauge');
export default {
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.createChart();
    // 设置每秒更新图表数据
    this.startUpdatingChart();
  },
  beforeDestroy() {
    this.stopUpdatingChart(); // 在组件销毁前停止更新图表
  },
  methods: {
    createChart() {
      this.chart = Echarts.init(this.$refs.GaugeBasicChart);
      var placeHolderStyle = {
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        color: 'rgba(0,0,0,0)',
        borderWidth: 0,
      };
      const option = {
        // backgroundColor: "#000",
        title: {
          text: "MBPs",
          left: '45%',
          top: "90%",
          textStyle: {
            color: '#74757a',
            fontSize: '15'
          }
        },
        series: [
          // 仪表盘
          {
            type: 'gauge',
            top: '2%',
            // 控制表盘大小
            radius: "90%",
            min: 0,
            max: 100,
            splitNumber: 5,
            // 进度
            progress: {
              show: true,
              width: 18,
              roundCap: true,
              itemStyle: {
                color: new Echarts.graphic.LinearGradient(1, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#4f61d5',
                  },
                  {
                    offset: 1,
                    color: '#8191f9',
                  },
                ]),
              }
            },
            // 仪表盘轴线相关配置
            axisLine: {
              // 仪表盘轴线样式
              lineStyle: {
                width: 18,
                // 阴影模糊
                shadowBlur: 5,
                shadowColor: '#9a9696',
                color: [[1, '#54565c']]
              },
              // 是否在两端显示成圆形
              roundCap: true,
            },
            // 刻度样式
            axisTick: {
              show: false,
            },
            // 分隔线样式
            splitLine: {
              show: false,
            },
            //   刻度标签
            axisLabel: {
              distance: 25,
              color: '#999',
              fontSize: 20,
            },
            //   指针
            pointer: {
              length: "80%",
              width: 12,
              itemStyle: {
                shadowColor: "#404247",
                shadowOffsetY: '2',
                shadowBlur: 10,
                color: new Echarts.graphic.LinearGradient(1, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#4f61d5',
                  },
                  {
                    offset: 1,
                    color: '#8191f9',
                  },
                ]),
              }
            },
            // 仪表盘详情
            detail: {
              // 是否开启标签的数字动画
              valueAnimation: true,
              fontSize: 20,
              offsetCenter: [0, '80%'],
              color: '#fff',
            },
            data: [
              {
                value: 20,
              },
            ],
          },
          // 外圆线
          {
            type: 'pie',
            radius: ['95%', '94%'],
            center: ['50%', '50%'],
            hoverAnimation: false, //鼠标移入变大
            startAngle: 225,
            labelLine: {
              show: false,
            },
            label: {
              position: 'center',
            },
            data: [
              {
                value: 75,
                itemStyle: {
                  shadowBlur: 30,
                  shadowColor: '#fff',
                  color: '#4e576f'
                },
              },
              {
                value: 25,
                itemStyle: placeHolderStyle,
              },
            ],
          },
        ],
      };
      this.chart.setOption(option)
    },
    startUpdatingChart() {
      this.updateInterval = setInterval(this.updateChartValue, 2000);
    },
    stopUpdatingChart() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval); // 清除定时器
      }
    },
    updateChartValue() {
      // 更新图表数据
      const newValue = Math.floor(Math.random() * 100); // 随机生成一个值
      this.chart.setOption({
        series: [
          {
            data: [{ value: newValue }],
          },
        ],
      });
    },
  }
};
</script>

<style scoped>
</style>
