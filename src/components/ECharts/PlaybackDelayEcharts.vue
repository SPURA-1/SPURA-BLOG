<template>
  <div>
    <div ref="chartContainer" style="width: 100%; height: 160px;"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chart: null,
      videoData: [], // 虚假的视频数据
      audioData: [], // 虚假的音频数据
    };
  },
  mounted() {
    this.chart = this.$echarts.init(this.$refs.chartContainer);

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
        axisPointer: {
          type: "none"
        },
        formatter: function (params) {
          const time = params[0].axisValue;
          let content = `时间：${time}<br>`;
          params.forEach(param => {
            const seriesName = param.seriesName;
            const value = param.data;
            content += `${seriesName}：${value}MS<br>`;
          });
          return content;
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        min: 0,
        max: 750,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#0066CC',
          },
        },
      },
      legend: {
        data: ['视频数据', '音频数据'],
        icon: 'diamond',
        textStyle: {
          color: 'white', // 标注文本颜色
        },
        right: '0%', // 右上角位置
        top: '0%', // 右上角位置
      },
      series: [
        {
          name: '视频数据',
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
                yAxis: 500,
                name: '视频参考线',
              },
            ],
          },
        },
        {
          name: '音频数据',
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
                yAxis: 500,
                name: '视频参考线',
              },
            ],
          },
        },
      ],
    };

    this.chart.setOption(option);

    // 模拟每秒更新一次数据
    setInterval(() => {
      const newVideoData = {
        time: new Date().toLocaleTimeString(),
        value: Math.floor(Math.random() * 750),
      };

      const newAudioData = {
        time: new Date().toLocaleTimeString(),
        value: Math.floor(Math.random() * 750),
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
            name: '视频数据',
            data: this.videoData.map(data => data.value),
          },
          {
            name: '音频数据',
            data: this.audioData.map(data => data.value),
          },
        ],
      });
    }, 1000);
  },
};
</script>

<style scoped>
</style>
