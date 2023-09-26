<template>
  <div>
    <div ref="chartContainer" style="width: 100%; height: 17rem;"></div>
  </div>
</template>

<script>
// 引入基本模板
let Echarts = require("echarts/lib/echarts");
// 按需引入需要的组件模块
require("echarts/lib/chart/line"); // 导入折线图
require("echarts/lib/component/tooltip"); // 导入提示框组件
require("echarts/lib/component/grid"); // 导入网格组件
require("echarts/lib/component/legend"); // 导入图例组件
require("echarts/lib/component/markLine"); // 导入标线组件
export default {
  data() {
    return {
      chart: null,
      videoData: [], // 虚假的视频数据
      audioData: [], // 虚假的音频数据
    };
  },
  mounted() {
    this.chart = Echarts.init(this.$refs.chartContainer);
    // 添加全屏事件监听器
    document.addEventListener('fullscreenchange', this.handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullScreenChange);

    const option = {
      grid: {
        top: '20%',
        left: '1%',
        right: '6%',
        bottom: '10%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // 设置背景色为带透明度的黑色
        textStyle: {
          color: 'white', // 设置文字颜色为白色
        },
        axisPointer: {
          type: "none"
        },
        formatter: function (params) {
          const time = params[0].axisValue;
          let content = `时间：${time}<br>`;
          params.forEach(param => {
            const seriesName = param.seriesName;
            const value = param.data;
            content += `${seriesName}：${value}<br>`;
          });
          return content;
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLabel: {
          textStyle: {
            color: '#fff' // 设置 x 轴文字颜色为红色
          }
        }
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        min: 0,
        max: 600,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#0066CC',
          },
        },
        axisLabel: {
          textStyle: {
            color: '#fff' // 设置 x 轴文字颜色为红色
          }
        }
      },
      legend: {
        data: ['A数据', 'B数据'],
        icon: 'diamond',
        textStyle: {
          color: 'white', // 标注文本颜色
        },
        right: '0%', // 右上角位置
        top: '0%', // 右上角位置
      },
      series: [
        {
          name: 'A数据',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: [],
          z: 10,
          lineStyle: {
            color: '#AC8CF7', // 视频数据线颜色
          },
          itemStyle: {
            color: '#AC8CF7'  // 图表图列(legend)的颜色
          },
          markLine: {
            z: 0,
            symbol: 'none',
            silent: true,
            lineStyle: {
              color: 'yellow',
              type: 'dashed',
            },
            label: {
              position: 'middle',
              formatter: '{c}MS',
              color: 'yellow',
            },
            data: [
              {
                yAxis: 300,
                name: '参考线',
              },
            ],
          },
        },
        {
          name: 'B数据',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: [],
          z: 10,
          lineStyle: {
            color: '#3BCCF9', // 音频数据线颜色
          },
          itemStyle: {
            color: '#3BCCF9'  // 图表图列(legend)的颜色
          },
          markLine: {
            z: 0,
            symbol: 'none',
            silent: true,
            lineStyle: {
              color: 'yellow',
              type: 'dashed',
            },
            label: {
              position: 'middle',
              formatter: '{c}MS',
              color: 'yellow',
            },
            data: [
              {
                yAxis: 300,
                name: '参考线',
              },
            ],
          },
        },
      ],
    };

    this.chart.setOption(option);

    // 模拟每秒更新一次数据
    const updateData = () => {
      // 检查是否全屏，如果不是，则停止数据更新
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        clearInterval(intervalId);
      }

      const newVideoData = {
        time: new Date().toLocaleTimeString(),
        value: Math.floor(Math.random() * 600),
      };

      const newAudioData = {
        time: new Date().toLocaleTimeString(),
        value: Math.floor(Math.random() * 600),
      };

      this.videoData.push(newVideoData);
      this.audioData.push(newAudioData);

      if (this.videoData.length > 20) {
        this.videoData.shift();
      }

      if (this.audioData.length > 20) {
        this.audioData.shift();
      }

      this.chart.setOption({
        xAxis: {
          data: this.videoData.map(data => data.time),
        },
        series: [
          {
            name: 'A数据',
            data: this.videoData.map(data => data.value),
          },
          {
            name: 'B数据',
            data: this.audioData.map(data => data.value),
          },
        ],
      });
    };

    const intervalId = setInterval(updateData, 1000);
  },
  methods: {
    // 处理全屏状态变化
    handleFullScreenChange() {
      // 如果退出全屏，销毁图表
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        this.chart.dispose();
      }
    },
  },
  beforeDestroy() {
    // 移除全屏事件监听器，以防止内存泄漏
    document.removeEventListener('fullscreenchange', this.handleFullScreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullScreenChange);
  },
};
</script>

<style scoped>
</style>
