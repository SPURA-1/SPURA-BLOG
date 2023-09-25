<template>
  <div>
    <div ref="capsuleBarChart" style="width:100%;height:17rem;"></div>
  </div>
</template>

<script>
// 引入基本模板
let Echarts = require("echarts/lib/echarts");
// 按需引入需要的组件模块
require("echarts/lib/chart/line"); // 导入折线图
require("echarts/lib/chart/bar"); // 导入柱形图（BarChart）
require("echarts/lib/component/tooltip"); // 导入提示框组件
require("echarts/lib/component/grid"); // 导入网格组件
export default {
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    //柱条的颜色，每个柱条颜色不同
    const lineColor = ["#9999FF", "#0066FF", "#FF9900", "#FA1660"];
    this.chart = Echarts.init(this.$refs.capsuleBarChart);
    const option = {
      tooltip: {//item和line搭配，将实现鼠标放置柱条上即可显示提示框，无阴影或者线条
        trigger: 'item',
        axisPointer: {
          type: 'line'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: 10,
        top: 0,
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',
          splitLine: {//坐标轴在grid区域的分割线
            show: false
          },
          axisLabel: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: ['未分类', 'Vue', 'Javascript', 'CSS'],
          inverse: true,//数组翻转显示
          axisTick: {
            alignWithLabel: true,
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              fontSize: 15,
              color: "#fff"
            }
          }
        },
        {
          type: 'category',
          data: ['', '', '', ''],
          inverse: true,//数组翻转显示
          axisTick: {
            alignWithLabel: true,
            show: false
          },
          axisLine: {
            show: false//不显示y轴的线
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: "#fff"
            }
          }
        }
      ],
      series: [
        {
          //   name: '及格人数',
          type: 'bar',
          yAxisIndex: 0,
          data: [1, 2, 2, 2],
          barWidth: '20%',//柱条的宽度
          label: {
            show: true,
            textStyle: {
              fontSize: 15,
              color: "#fff",
            },
            formatter: function (params) {//柱条上的文字
              return params.data;
            }
          },
          itemStyle: {
            borderRadius: 5,//圆角
            color: function (params) {
              return lineColor[params.dataIndex]
            }
          },
          z: 10
        },
        {
          name: '',
          type: 'bar',
          yAxisIndex: 1,//使两个柱状图重合的效果
          barWidth: '30%',
          data: [7, 7, 7, 7],
          label: {
            show: false
          },
          itemStyle: {
            color: "none",
            borderColor: "#00c1de",
            borderWidth: 2,
            borderRadius: 5,//圆角
          },
          z: 1
        }
      ]
    }
    this.chart.setOption(option)
  }
};
</script>

<style scoped>
</style>
