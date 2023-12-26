<template>
  <div class="div1">
    <!-- 资源视图 -->
    <div class="top-wrap">
      <el-card
        class="box-card"
        shadow="hover"
      >
        <div style="display:flex;justify-content: space-between">
          <p style="margin-bottom:20px;">资源总览</p>
          <div style="display:flex;flex-direction: column;">
            <p>账号：{{userData.userNickname !== '' ?userData.userNickname :  userData.useName}}</p>
            <div style="display:flex;">
              <p>权限：</p>
              <p :style="{ color: userRoleName === '管理员' ? '#00cc00' : '' }">{{userRoleName }}</p>
            </div>
          </div>
        </div>
        <div class="top-box">
          <div class="box-wrap">
            <div>文章总数</div>
            <div style="font-size:30px; color:#0066cc;">{{ this.data.artLength }}</div>
          </div>
          <div class="box-wrap">
            <div>游戏总数</div>
            <div style="font-size:30px; color:#009933;">{{ this.data.gameLength }}</div>
          </div>
          <div class="box-wrap">
            <div>留言总数</div>
            <div style="font-size:30px; color:#a1a1a1;">{{ this.data.commentLength }}</div>
          </div>
          <div class="box-wrap">
            <div>用户总数</div>
            <div style="font-size:30px; color:#0066cc;">{{ this.data.userLength }}</div>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 下半部分容器 -->
    <div class="bottom-wrap">
      <!-- 左边容器 -->
      <div class="left-box">
        <el-card shadow="hover">
          <div class="left-container">
            <p style="color:#02abe9;margin-bottom:5px;">最近发布</p>
            <div
              v-for="newArt in ArtList"
              :key="newArt.id"
            >
              <h4
                class="artTitle"
                @click="navigateToArticle(newArt.id)"
              >{{ newArt.title }}</h4>
              <p style="text-indent: 2em;">{{ truncateContent(newArt.Introduction) }}</p>
              <div>
                <p style="display:flex;justify-content: flex-end;">{{ newArt.category }}</p>
                <p style="display:flex;justify-content: flex-end;">{{ newArt.publish_date }}</p>
              </div>
            </div>
          </div>
        </el-card>
        <!-- 最近任务结果视图 接口为报告数据-->
        <el-card shadow="hover">
          <div class="right-container">
            <p style="color:#02abe9;margin-bottom:10px;">名人名言</p>
            <div class="all-test-box">
              <div
                v-for="quote in famousQuote"
                :key="quote.id"
              >
                <h4>{{ quote.aphorism }}</h4>
                <div>
                  <p style="display:flex;justify-content: flex-end;flex-direction: column;">{{ quote.author }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <!-- 右边容器 -->
      <div class="right-box">
        <div
          ref="echart"
          id="map"
        ></div>
      </div>

    </div>
    <footer
      class="chart-box"
      style="width: 100%; overflow: auto"
    >
      <p
        id="htmer_time"
        style="color: #fd7286;font-size: large;font-weight: bolder;"
      ></p>
    </footer>

  </div>
</template>

<script>
import { getAdminData } from '@/api/AdminHome.api'
import { getComment } from '@/api/MessageBoard.api'
import { getAphorisms } from '@/api/aphorisms.api'
import { getNewArticles, getCategoriesList } from '@/api/ArticleList.api';
// import * as echarts from "echarts";
// 引入基本模板
let Echarts = require("echarts/lib/echarts");
// 按需引入需要的组件模块
require("echarts/lib/component/tooltip");
require("echarts/lib/component/geo");
require("echarts/lib/chart/scatter");

import TimeOut from '../../assets/JS/TimeOut'
import china from "@/assets/JS/china.json"
import { mapGetters } from 'vuex'; // 导入 mapGetters
export default {
  // components: {
  // },
  data() {
    return {
      famousQuote: [],  // 名人名言
      data: {},         // 数据总览
      mapData: [],
      ArtList: [],
      categories: [], // 假设你从后端获取文章分类列表
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
      // 地址的经纬度
      cityIPMessage: {
        北京: [116.4074, 39.9042],
        上海: [121.4737, 31.2304],
        广州: [113.2644, 23.1291],
        成都: [104.06667, 30.66667],
        深圳: [114.0579, 22.5431],
        杭州: [120.1551, 30.2741],
        西安: [108.9398, 34.3416],
        武汉: [114.3055, 30.5928],
        重庆: [106.55073, 29.56471],
        南京: [118.7969, 32.0603],
        天津: [117.2008, 39.084],
        苏州: [120.6199, 31.3179],
        大连: [121.6147, 38.914],
        青岛: [120.3826, 36.0671],
        厦门: [118.1102, 24.4905],
        昆明: [102.7123, 25.0406],
        郑州: [113.6254, 34.7466],
        长沙: [112.9389, 28.2282],
        沈阳: [123.4315, 41.8057],
        宁波: [121.5439, 29.8683],
        福州: [119.2965, 26.0745],
        合肥: [117.2272, 31.8206],
        济南: [117.1205, 36.6512],
        南宁: [108.3669, 22.817],
        长春: [125.3235, 43.8171],
        哈尔滨: [126.535, 45.8028],
        乌鲁木齐: [87.6177, 43.7928],
        兰州: [103.8343, 36.0611],
        贵阳: [106.6302, 26.647],
        海口: [110.1999, 20.0442],
        太原: [112.5489, 37.8706],
        西宁: [101.7782, 36.6171],
        呼和浩特: [111.7499, 40.8426],
        南昌: [115.8645, 28.687],
        银川: [106.2309, 38.4872],
        石家庄: [114.4995, 38.1006],
        温州: [120.6994, 27.9943],
        唐山: [118.1802, 39.6304],
        洛阳: [112.4345, 34.6634],
        吉林: [126.553, 43.8436],
        佛山: [113.1214, 23.0215],
        无锡: [120.3119, 31.4912],
        南通: [120.8943, 31.9802],
        徐州: [117.1881, 34.2715],
        潍坊: [119.1618, 36.7068],
        泰州: [119.9296, 32.4601],
        烟台: [121.4479, 37.4638],
        惠州: [114.4168, 23.1115],
        蚌埠: [117.3632, 32.9396],
        淮安: [119.0153, 33.6104],
        大同: [113.6124, 40.1001],
        宜昌: [111.2861, 30.6919],
        淄博: [118.0591, 36.8047],
        鞍山: [123.0005, 41.1145],
        抚顺: [123.9572, 41.8797],
        镇江: [119.4528, 32.2044],
        珠海: [113.5767, 22.2707],
        柳州: [109.4344, 24.3317],
        金华: [119.6521, 29.1107],
        绍兴: [120.5821, 29.9971],
        临沂: [118.3564, 35.1046],
        扬州: [119.4129, 32.3942],
        淮南: [117.0183, 32.5875],
        泉州: [118.682, 24.8801],
        湘潭: [112.9441, 27.8297],
        南阳: [112.5283, 32.9908],
        芜湖: [118.4329, 31.3526],
        邯郸: [114.4905, 36.6123],
        六安: [116.5077, 31.7529],
        乐山: [103.7722, 29.5582],
        义乌: [120.0759, 29.3064],
        常州: [119.9737, 31.8101],
        湛江: [110.3594, 21.2707],
        曲靖: [103.7961, 25.489999],
        宿迁: [118.2755, 33.963],
        本溪: [123.7665, 41.2941],
        怀化: [109.9985, 27.5549],
        嘉兴: [120.7509, 30.7627],
        遵义: [106.9274, 27.7254],
        襄阳: [112.1224, 32.0082],
        株洲: [113.1404, 27.8336],
        台州: [121.4206, 28.6564],
        许昌: [113.8261, 34.0226],
        娄底: [112.0015, 27.7034],
        阜阳: [115.8145, 32.8908],
        盘锦: [122.0707, 41.1199],
        自贡: [104.7784, 29.339],
        岳阳: [113.1325, 29.3703],
        九江: [115.9999, 29.7196],
        宜宾: [104.6433, 28.7513],
        马鞍山: [118.5066, 31.6704],
        漳州: [117.6536, 24.518],
        安阳: [114.3924, 36.0975],
        临汾: [111.5263, 36.0943],
        淮北: [116.7984, 33.9548],
        南充: [106.1107, 30.8378],
        平顶山: [113.3008, 33.7453],
        内江: [105.0584, 29.5807],
        涪陵: [107.3944, 29.703],
        信阳: [114.0913, 32.147],
        咸阳: [108.7052, 34.3333],
        盐城: [120.1616, 33.3479],
        荆州: [112.2397, 30.3352],
        萍乡: [113.8599, 27.6395],
        锦州: [121.127, 41.0951],
        昭通: [103.7172, 27.3369],
        乌海: [106.8256, 39.6737],
        通辽: [122.2604, 43.6338],
        秦皇岛: [119.6005, 39.9354],
        江门: [113.0888, 22.584],
        丹东: [124.3568, 40.0005],
        莆田: [119.0077, 25.454],
        衡阳: [112.6077, 26.9004],
        张家口: [114.8943, 40.8302],
        齐齐哈尔: [123.9182, 47.354],
        景德镇: [117.1846, 29.2749],
        济宁: [116.5872, 35.4142],
        阳江: [111.9826, 21.8579],
        新乡: [113.9268, 35.303],
        东营: [118.6757, 37.434],
        聊城: [115.9915, 36.4627],
        衢州: [118.8698, 28.9569],
        商丘: [115.6621, 34.4202],
        安庆: [117.0635, 30.543],
        邢台: [114.5048, 37.0708],
        巴中: [106.7539, 31.8588],
        焦作: [113.2418, 35.2159],
        宣城: [118.7655, 30.9462],
        中山: [113.3824, 22.521],
        营口: [122.2352, 40.6674],
        赤峰: [118.8869, 42.2578],
        泸州: [105.4423, 28.8718],
        佳木斯: [130.3189, 46.7998],
        汕头: [116.7287, 23.3839],
        晋江: [118.5524, 24.7818],
        东莞: [113.7518, 23.0206],
        中山: [113.3926, 22.515],
        深圳: [114.0579, 22.5431],
        广州: [113.2644, 23.1291],
        佛山: [113.1214, 23.0215],
        淮南: [117.0183, 32.5875],
        合肥: [117.2272, 31.8206],
        茂名: [110.9312, 21.6682],
      },
    };
  },
  created() {
    this.fetchCategoryList(); // 获取分类
    this.getMapListData(); // 获取评论地区信息
    this.getPageListData(); // 获取首页数据列表
    this.getReportListData(); // 获取最近发布的三篇文章
    this.getTaskListData(); // 获取随机三句名人名言
  },
  computed: {
    ...mapGetters(['userData', 'userRole']),
    userRoleName() {
      const options = [
        { value: 1, label: '管理员' },
        { value: 2, label: '用户' }
      ];

      const userRole = this.userRole;
      // 查找对应的中文权限名称
      const role = options.find(option => option.value === userRole)?.label;

      return role;
    },
    categoryNames() {
      const categoryMap = {}; // 使用一个对象来存储分类 id 到名称的映射
      this.categories.forEach(category => {
        categoryMap[category.id] = category.name;
      });
      return categoryMap;
    }
  },
  beforeDestroy() {

  },
  methods: {
    // 获取首页数据列表
    getPageListData() {
      getAdminData()
        .then(res => {
          if (res.status === 200) {
            this.data = res.data
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
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
            const cityCounts = {};
            transformedComments.forEach(item => {
              const cityName = item.city;
              cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
            });
            // 将评论转换为弹幕数据格式
            this.mapData = transformedComments.map(item => ({
              name: item.city,
              value: this.getCityCoordinates(item.city).concat(cityCounts[item.city] || 0),
            }));
            // 使用转换后的数据配置地图图表
            this.initCharts();
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
    // 假设这里是一个函数，用于根据城市名获取经纬度信息
    getCityCoordinates(cityName) {
      // 在这里根据城市名返回对应的经纬度信息
      // 你可能需要维护一个城市名称到经纬度的映射表
      // 返回的数据格式为 [经度, 纬度]
      // 例如：
      const cityCoordinates = this.cityIPMessage;
      return cityCoordinates[cityName] || [0, 0]; // 默认为 [0, 0]
    },
    // 获取分类列表
    fetchCategoryList() {
      getCategoriesList()
        .then(res => {
          if (res.status === 200) {
            this.categories = res.data.categories;
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'axios报错');
        })
    },
    // 获取最近发布的三篇文章
    getReportListData() {
      getNewArticles()
        .then(res => {
          if (res.status === 200) {
            const ArtList = res.data.articles;
            this.ArtList = ArtList.map(item => ({
              id: item.id,
              category: this.categoryNames[item.category],
              publish_date: item.formatted_publish_date,
              title: item.title,
              Introduction: item.Introduction
            }));
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
    // 页面跳转
    navigateToArticle(articleId) {
      // 在这里添加页面跳转逻辑，使用 router.push() 或类似方法进行导航
      // 例如：this.$router.push(`/article/${articleId}`);
      this.$router.push({ name: 'ArticleShow', params: { id: articleId } });
    },
    // 限制最大字数
    truncateContent(Introduction) {
      const maxLength = 40; // 限制内容显示的最大长度
      if (Introduction.length <= maxLength) {
        return Introduction;
      } else {
        return Introduction.slice(0, maxLength) + '...';
      }
    },
    // 获取随机三句名人名言
    getTaskListData() {
      getAphorisms()
        .then(res => {
          if (res.status === 200) {
            this.famousQuote = res.data.aphorism
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
    initCharts() {
      // 初始化 echarts 实例，将图表绑定到 this.$refs["charts"] 元素上
      const charts = Echarts.init(this.$refs["echart"]);
      // 配置图表的 option（选项）
      const option = {
        // 背景颜色
        // backgroundColor: "#404a59",
        // 配置提示浮窗样式
        tooltip: {
          show: true,                          // 是否显示提示浮窗
          trigger: "item",                     // 触发方式，'item' 表示数据项触发
          alwaysShowContent: false,           // 是否一直显示浮窗的内容
          backgroundColor: "#0C121C",         // 浮窗的背景颜色
          borderColor: "rgba(0, 0, 0, 0.16);", // 浮窗的边框颜色
          hideDelay: 100,                    // 隐藏延迟
          triggerOn: "mousemove",             // 触发方式，'mousemove' 表示鼠标移动时触发
          enterable: true,                   // 是否允许鼠标进入浮窗
          textStyle: {
            color: "#DADADA",                   // 浮窗文本颜色
            fontSize: "12",                     // 浮窗字体大小
            width: 20,                          // 浮窗宽度
            height: 30,                         // 浮窗高度
            overflow: "break",                  // 文本溢出处理方式
          },
          showDelay: 100, // 显示延迟
          formatter(params) {
            return `地区：${params.name}</br>数值：${params.value[2]}`;
          }
        },
        // 地图配置
        geo: {
          zoom: 1, // 设置地图默认大小
          "left": 0,
          "right": 0,
          "bottom": '-260px',
          "top": 0,
          map: "china",            // 使用的地图名称，要与 echarts.registerMap 注册的地图名一致
          label: {
            // 通常状态下的样式
            normal: {
              show: true,         // 是否显示标签
              textStyle: {
                color: "#fff",     // 标签文本颜色
              },
            },
            // 鼠标放上去的样式
            emphasis: {
              textStyle: {
                color: "#fff",      // 鼠标放上去时的标签文本颜色
              },
            },
          },
          // 地图区域的样式设置
          itemStyle: {
            normal: {
              borderColor: "rgba(147, 235, 248, 1)",   // 边框颜色
              borderWidth: 1,        // 边框宽度
              borderColor: "transparent", // 边框颜色设置为透明
              // borderWidth: 0, // 边框宽度设置为0
              areaColor: {
                type: "radial",         // 渐变类型
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(63, 191, 127, 1)", // 渐变起始颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(63, 191, 127, .2)", // 渐变结束颜色
                  },
                ],
                globalCoord: false, // 是否使用全局坐标
              },
              shadowColor: "rgba(128, 217, 248, 1)",     // 阴影颜色
              shadowOffsetX: -2,                         // 阴影 X 偏移
              shadowOffsetY: 2,                          // 阴影 Y 偏移
              shadowBlur: 10,                            // 阴影模糊半径
            },
            // 鼠标放上去高亮的样式
            emphasis: {
              areaColor: "#02abe9",                      // 鼠标放上去时的区域颜色
              borderWidth: 0,                            // 鼠标放上去时的边框宽度
            },
          },
        },
        series: [
          {
            type: "scatter", // 类型为散点图
            coordinateSystem: "geo", // 使用地理坐标系
            symbol: "pin", // 使用图钉形状的符号
            legendHoverLink: true, // 图例与散点图之间是否有联动效果
            symbolSize: [60, 60], // 符号大小，可以设置为数组，分别表示宽和高
            label: {
              show: true, // 是否显示标签
              formatter(value) {
                return value.data.value[2]; // 标签的格式化函数，这里显示第三个数据值
              },
              color: "#fff", // 标签颜色
            },
            itemStyle: {
              normal: {
                color: "rgba(255,0,0,0.7)", // 符号的颜色
                shadowBlur: 2, // 阴影模糊半径
                shadowColor: "D8BC37", // 阴影颜色
              },
            },
            // 数据格式，其中 name 和 value 是必要的
            data: this.mapData,
            showEffectOn: "render", // 效果显示的触发方式
            rippleEffect: {
              brushType: "stroke", // 波纹绘制方式，可以设置为 'stroke' 或 'fill'
            },
            hoverAnimation: true, // 鼠标悬停时是否有动画效果
            zlevel: 1, // 图层叠加顺序
          },
          // {
          //   type: "effectScatter",
          //   coordinateSystem: "geo",
          //   effectType: "ripple",
          //   showEffectOn: "render",
          //   rippleEffect: {
          //     period: 10,
          //     scale: 10,
          //     brushType: "fill",
          //   },

          //   hoverAnimation: true,
          //   itemStyle: {
          //     normal: {
          //       color: "rgba(255, 235, 59, .7)",
          //       shadowBlur: 10,
          //       shadowColor: "#333",
          //     },
          //   },
          //   zlevel: 1,
          //   data: [
          //     { name: "西藏", value: [91.23, 29.5, 2333] },
          //     { name: "黑龙江", value: [128.03, 47.01, 1007] },
          //   ],
          // },
        ],

      };
      // 地图注册，第一个参数的名字必须和option.geo.map一致
      Echarts.registerMap("china", china)
      // 将配置应用到图表实例
      charts.setOption(option);
    },

  },
};
</script>



<style lang="scss" scoped>
// 滚动条隐藏
::v-deep .all-test-box::-webkit-scrollbar {
  display: none;
}
.div1 {
  height: 100%;
  .top-wrap {
    height: 160px;
    .box-card {
      height: 100%;
      .top-box {
        height: 100%;
        width: 70%;
        min-width: 600px;
        display: flex;
        justify-content: space-between;
        .box-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
  .bottom-wrap {
    height: calc(100% - 170px);
    // min-width: 1200px;
    padding-top: 10px;
    display: flex;
    // justify-content: space-between;
    .left-box {
      width: 40%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .left-container {
        width: 100%;
        height: 220px;
        background-color: #fff;
        .artTitle {
          cursor: pointer;
        }
        .artTitle:hover {
          color: deepskyblue;
        }
      }
      .right-container {
        width: 100%;
        height: 270px;
        background-color: #fff;
        .all-test-box {
          height: calc(100% - 20px);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          overflow: auto;
        }
      }
    }
    .right-box {
      padding-left: 80px;
      #map {
        width: 800px;
        height: 100%;
      }
    }
  }
}
</style>