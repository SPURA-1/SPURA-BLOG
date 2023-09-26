<template>
  <div>
    <div ref="BarChart" style="width:100%;height:17rem;"></div>
  </div>
</template>

<script>
import { getCategorycount } from '@/api/ArticleList.api';
import { getComment } from '@/api/MessageBoard.api';
// 引入基本模板
let Echarts = require("echarts/lib/echarts");
// 按需引入需要的组件模块
require('echarts/lib/component/grid');
require('echarts/lib/chart/bar');
export default {
  data() {
    return {
      chart: null,
      CategoryCountdata: [],
      cityCounts: {},
      uniqueMapData: [],
      // 将地址转为中文
      cityMapping: {
        Beijing: '北京',
        Shanghai: '上海',
        Guangzhou: '广州',
        Chengdu: '成都',
        Shenzhen: '深圳',
        Hangzhou: '杭州',
        Xian: '西安',
        Wuhan: '武汉',
        Chongqing: '重庆',
        Nanjing: '南京',
        Tianjin: '天津',
        Suzhou: '苏州',
        Dalian: '大连',
        Qingdao: '青岛',
        Xiamen: '厦门',
        Kunming: '昆明',
        Zhengzhou: '郑州',
        Changsha: '长沙',
        Shenyang: '沈阳',
        Ningbo: '宁波',
        Fuzhou: '福州',
        Hefei: '合肥',
        Jinan: '济南',
        Nanning: '南宁',
        Changchun: '长春',
        Harbin: '哈尔滨',
        Urumqi: '乌鲁木齐',
        Lanzhou: '兰州',
        Guiyang: '贵阳',
        Haikou: '海口',
        Taiyuan: '太原',
        Xining: '西宁',
        Hohhot: '呼和浩特',
        Nanchang: '南昌',
        Yinchuan: '银川',
        Shijiazhuang: '石家庄',
        Wenzhou: '温州',
        Tangshan: '唐山',
        Luoyang: '洛阳',
        Jilin: '吉林',
        Foshan: '佛山',
        Wuxi: '无锡',
        Nantong: '南通',
        Xuzhou: '徐州',
        Weifang: '潍坊',
        Taizhou: '泰州',
        Yantai: '烟台',
        Huizhou: '惠州',
        Bengbu: '蚌埠',
        Huaian: '淮安',
        Datong: '大同',
        Yichang: '宜昌',
        Zibo: '淄博',
        Anshan: '鞍山',
        Fushun: '抚顺',
        Zhenjiang: '镇江',
        Zhuhai: '珠海',
        Liuzhou: '柳州',
        Jinhua: '金华',
        Shaoxing: '绍兴',
        Linyi: '临沂',
        Yangzhou: '扬州',
        Huainan: '淮南',
        Quanzhou: '泉州',
        Xiangtan: '湘潭',
        Nanyang: '南阳',
        Wuhu: '芜湖',
        Handan: '邯郸',
        Luan: '六安',
        Leshan: '乐山',
        Yiwu: '义乌',
        Changzhou: '常州',
        Zhanjiang: '湛江',
        Qujing: '曲靖',
        Suqian: '宿迁',
        Benxi: '本溪',
        Huaihua: '怀化',
        Jiaxing: '嘉兴',
        Zunyi: '遵义',
        Xiangyang: '襄阳',
        Zhuzhou: '株洲',
        Taizhou: '台州',
        Xuchang: '许昌',
        Loudi: '娄底',
        Fuyang: '阜阳',
        Panjin: '盘锦',
        Zigong: '自贡',
        Yueyang: '岳阳',
        Jiujiang: '九江',
        Yibin: '宜宾',
        Maanshan: '马鞍山',
        Zhangzhou: '漳州',
        Anyang: '安阳',
        Linfen: '临汾',
        Huaibei: '淮北',
        Nanchong: '南充',
        Pingdingshan: '平顶山',
        Neijiang: '内江',
        Fuling: '涪陵',
        Xinyang: '信阳',
        Xianyang: '咸阳',
        Yancheng: '盐城',
        Jingzhou: '荆州',
        Pingxiang: '萍乡',
        Jinzhou: '锦州',
        Zhaotong: '昭通',
        Wuhai: '乌海',
        Tongliao: '通辽',
        Qinhuangdao: '秦皇岛',
        Jiangmen: '江门',
        Dandong: '丹东',
        Putian: '莆田',
        Hengyang: '衡阳',
        Zhangjiakou: '张家口',
        Qiqihar: '齐齐哈尔',
        Jingdezhen: '景德镇',
        Jining: '济宁',
        Yangjiang: '阳江',
        Xinxiang: '新乡',
        Dongying: '东营',
        Liaocheng: '聊城',
        Quzhou: '衢州',
        Shangqiu: '商丘',
        Anqing: '安庆',
        Xingtai: '邢台',
        Bazhong: '巴中',
        Jiaozuo: '焦作',
        Xuancheng: '宣城',
        Zhongshan: '中山',
        Yingkou: '营口',
        Chifeng: '赤峰',
        Luzhou: '泸州',
        Jiamusi: '佳木斯',
        Shantou: '汕头',
        Jinjiang: '晋江',
        Dongguan: '东莞',
        Zhuhai: '珠海',
        Shenzhen: '深圳',
        Guangzhou: '广州',
        Foshan: '佛山',
        Huainan: '淮南',
        Hefei: '合肥',
        Maoming: '茂名',
      },
    };
  },
  mounted() {
    this.getMapListData(); // 获取评论地区信息
  },
  methods: {
    // 获取评论数据，将城市名称转换为中文
    getMapListData() {
      getComment()
        .then(res => {
          if (res.status === 200) {
            const comments = res.data.comments;
            // 遍历评论数据，将城市名称转换为中文
            const transformedComments = comments.map((comment) => {
              const chineseCity = this.cityMapping[comment.city];
              return {
                ...comment,
                city: chineseCity || comment.city, // 使用中文城市名称，如果映射关系不存在，则保持原始值
              };
            });
            // 使用辅助对象计算每个城市的数量
            transformedComments.forEach(item => {
              const cityName = item.city;
              this.cityCounts[cityName] = (this.cityCounts[cityName] || 0) + 1;
            });
            // 使用转换后的数据配置地图图表
            this.createChart();
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
    createChart() {
      this.chart = Echarts.init(this.$refs.BarChart);
      // 从数据对象中提取标签和值
      const categories = Object.keys(this.cityCounts);
      const values = Object.values(this.cityCounts);
      const option = {
        xAxis: {
          type: 'category',
          data: categories,
          axisLabel: {
            textStyle: {
              color: '#fff' // 设置 x 轴文字颜色
            }
          }
        },
        yAxis: {
          type: 'value',
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
        tooltip: {
          trigger: 'item', // 设置触发方式为鼠标悬停在数据项上
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // 设置背景色为带透明度的黑色
          textStyle: {
            color: 'white', // 设置文字颜色为白色
          },
          formatter: function (params) { // 自定义提示框内容
            let content = `留言分类<br>`;
            const seriesName = params.name; // 获取数据项的名称
            const value = params.value; // 获取数据项的值
            content += `${seriesName}：${value}<br>`;
            return content;
          },
        },
        series: [
          {
            data: values,
            type: 'bar',
            itemStyle: {
              borderRadius: 5,
            },
            label: {
              fontSize: 15,
              color: 'white', // 设置文字颜色为白色
            },
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
