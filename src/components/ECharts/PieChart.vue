<template>
  <div>
    <div ref="PieChart" style="width:100%;height:17rem;"></div>
  </div>
</template>

<script>
import { getCategorycount } from '@/api/ArticleList.api';
// 引入基本模板
let Echarts = require("echarts/lib/echarts");
// 按需引入需要的组件模块
require('echarts/lib/component/toolbox');
require('echarts/lib/component/legend');
require('echarts/lib/chart/pie');
export default {
  data() {
    return {
      chart: null,
      CategoryCountdata: [],
    };
  },
  mounted() {
    this.Categorycount();
  },
  methods: {
    // 获取首页数据列表
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
      const categoryNames = this.CategoryCountdata.map(item => ({
        value: item.categoryCount,
        name: item.categoryName
      }));
      this.chart = Echarts.init(this.$refs.PieChart);
      const option = {
        // legend 图表下方的计数数据
        legend: {
          top: 'bottom',
          textStyle: {
            fontSize: 12,
            color: "#fff"
          }
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        tooltip: {
          trigger: 'item', // 设置触发方式为鼠标悬停在数据项上
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // 设置背景色为带透明度的黑色
          textStyle: {
            color: 'white', // 设置文字颜色为白色
          },
          formatter: function (params) { // 自定义提示框内容
            let content = `文章分类<br>`;
            const seriesName = params.name; // 获取数据项的名称
            const value = params.value; // 获取数据项的值
            const percent = params.percent; // 获取数据项的百分比值
            content += `${seriesName}：${value}（${percent}%）<br>`;
            return content;
          },
        },
        series: [
          {
            bottom: '10%',
            name: '文章分类',
            type: 'pie',
            radius: [5, 100],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5,
            },
            label: {
              fontSize: 15,
              color: 'white', // 设置文字颜色为白色
            },
            data: categoryNames,
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
