<template>
  <div>
    <div ref="capsuleBarChart" style="width:100%;height:17rem;"></div>
  </div>
</template>

<script>
import { getAdminData } from '@/api/AdminHome.api';
import { getCategorycount } from '@/api/ArticleList.api';
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
      Alldata: {},         // 数据总览
      CategoryCountdata: [],
    };
  },
  mounted() {
    this.getPageListData();
  },
  methods: {
    // 获取首页数据列表
    getPageListData() {
      getAdminData()
        .then(res => {
          if (res.status === 200) {
            this.Alldata = res.data;
            this.Categorycount();
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
    // 
    Categorycount() {
      getCategorycount()
        .then(res => {
          if (res.status === 200) {
            this.CategoryCountdata = res.data.categories;
            this.createChart(); // 在获取数据后创建图表
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
    createChart() {
      //柱条的颜色，每个柱条颜色不同
      const lineColor = ["#9999FF", "#0066FF", "#FF9900", "#FA1660", "#8B78F6"];
      this.chart = Echarts.init(this.$refs.capsuleBarChart);
      // 从给定数据中提取分类名称和数量
      const categoryNames = this.CategoryCountdata.map(item => item.categoryName);
      const categoryCounts = this.CategoryCountdata.map(item => item.categoryCount);
      // 创建一个包含空字符串的数组，长度与分类数量相同
      const emptyData = new Array(categoryCounts.length).fill('');
      // 根据 CategoryCountdata 数组的长度生成相应数量的 this.Alldata.artLength
      const BarDataCounts = new Array(this.CategoryCountdata.length).fill(this.Alldata.artLength);
      const option = {
        // tooltip: {//item和line搭配，将实现鼠标放置柱条上即可显示提示框，无阴影或者线条
        //   trigger: 'item',
        //   axisPointer: {
        //     type: 'line'
        //   }
        // },
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
            data: categoryNames, // 使用提取的分类名称
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
            data: emptyData, // 使用包含空字符串的数组
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
            //   name: '人数',
            type: 'bar',
            yAxisIndex: 0,
            data: categoryCounts, // 使用提取的分类数量
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
              },
            },
            // 使用 emphasis 属性设置鼠标移入时的样式
            emphasis: {
              itemStyle: {
                // 在这里设置鼠标移入时的样式，比如放大柱形图
                color: '#0224B9', // 放大时的颜色
                borderColor: 'white', // 边框颜色
                borderWidth: 2, // 边框宽度
              },
            },
            z: 10
          },
          {
            name: '',
            type: 'bar',
            yAxisIndex: 1,//使两个柱状图重合的效果
            barWidth: '30%',
            data: BarDataCounts,
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
  }
};
</script>

<style scoped>
</style>
