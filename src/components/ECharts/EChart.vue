<template>
  <div class="home">
      <!-- 定义图表外层容器 -->
    <div id="myHomeChart" ref="homeEcharts"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  mounted() {
    // 调用当前图表
    this.dataChart();
  },
  methods: {
    // 绘制图表
    dataChart() {
      //初始化图表，this.$refs.homeEcharts获取到图表容器
      var myChart = this.$echarts.init(this.$refs.homeEcharts)
      // 初始化配置
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical', //控制横纵方向展示
          left: 10,            //距离左边距离
          data: [
            '直达',
            '营销广告',
            '搜索引擎',
            '邮件营销',
            '联盟广告',
            '视频广告',
            '百度',
            '谷歌',
            '必应',
            '其他'
          ]                   //必须和下面name一致，否则不显示
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
              position: 'inner'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: '直达', selected: true },  //value是显示的数据，selected属性表示开始就选中
              { value: 679, name: '营销广告' },
              { value: 1548, name: '搜索引擎' }
            ]
          },
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '55%'],
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee', //访问来源面板颜色
              borderColor: '#aaa',     //访问来源面板外边框颜色
              borderWidth: 1,          //访问来源面板外边框大小
              borderRadius: 4,         //访问来源面板外边框设置圆角
              // shadowBlur:3,
              // shadowOffsetX: 2,
              // shadowOffsetY: 2,
              // shadowColor: '#999',
              // padding: [0, 7],
              rich: {
                a: {
                  color: 'red',      //访问来源面板标题的颜色
                  lineHeight: 22,    //访问来源面板标题栏的长度
                  align: 'center'    //访问来源面板标题的居中
                },
                // abg: {
                //     backgroundColor: '#333',
                //     width: '100%',
                //     align: 'right',
                //     height: 22,
                //     borderRadius: [4, 4, 0, 0]
                // },
                hr: {
                  borderColor: '#aaa',   //访问来源面板下面分割线的颜色
                  width: '100%',         //访问来源面板下面分割线占整个格子的百分比
                  borderWidth: 0.5,      //访问来源面板下面分割线的大小
                  height: 0
                },
                b: {
                  fontSize: 16,          //访问来源面板下半表格标题的大小
                  lineHeight: 33
                },
                per: {
                  color: 'red',                //访问来源面板下半表格百分比的颜色
                  backgroundColor: 'yellow',   //访问来源面板下半表格百分比的底色
                  padding: [2, 4],
                  borderRadius: 2              ////访问来源面板下半表格百分比底色设置圆角
                }
              }
            },
            data: [
              { value: 335, name: '直达' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1048, name: '百度' },
              { value: 251, name: '谷歌' },
              { value: 147, name: '必应' },
              { value: 102, name: '其他' }
            ]  //value是显示的数据，name是显示的名字 要和上面的name保持一致
          }
        ]
      }
      // 把参数配置放到容器里
      myChart.setOption(option)
    },
    // 销毁实例(看项目需要进行销毁实例)
    destroyChart() {
      this.$echarts.init(this.$refs.homeEcharts).dispose();
    }
  }
}
</script>
<style>
/* 给图表容器定义宽高 */
#myHomeChart {
  width: 800px;
  height: 800px;
}
</style>



