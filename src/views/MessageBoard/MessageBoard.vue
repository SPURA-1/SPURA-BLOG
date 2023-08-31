<template>
  <div class="body">
    <div class="scene">
      <div class="text-container">
        <span id="luke"></span>
      </div>
    </div>
    <div class="message_board">
      <div v-for="(message, index) in visibleMessages" :key="index" :class="['message', { 'new-message': message.isNew }]" :style="{ top: `${message.top}px` }">{{ message.text }}
      </div>
    </div>
    <div class="content">
      <div class="left-column">
        <!-- 发送评论 -->
        <div class="comment-module">
          <div class="comment-title">发表评论</div>
          <textarea class="comment-input" placeholder="请输入评论内容" v-model="commentContent"></textarea>
          <!-- 表情 -->
          <div class="emoji-selector">
            <button class="emoji-button" @click="toggleEmojiPicker">OwO表情</button>
            <div class="emoji-panel" v-show="showEmojiPicker">
              <picker @select="handleEmojiClick"></picker>
            </div>
          </div>
          <!-- 名称 -->
          <div class="name-option">
            <label class="name-option-label">
              <input type="radio" value="auto" v-model="nameOption">
              自动设置名称
            </label>
            <label class="name-option-label">
              <input type="radio" value="custom" v-model="nameOption">
              留下你的名称
            </label>
            <div v-if="nameOption === 'custom'" class="name-input">
              <input type="text" placeholder="请输入你的名称" v-model="customName">
            </div>
          </div>
          <!-- <button class="submit-button" @click="submitComment">提交评论</button> -->
          <CustomButton buttonText="提交评论" @button-click="handleThrottledStatusChange" />
        </div>
        <!-- 评论列表 -->
        <div class="comment-module">
          <div class="comment-title">评论列表 || 活捉 {{ commentDatas.length }} 条</div>
          <h2 class="comment-title"></h2>
          <div class="comment-list">
            <div v-for="comment in visibleComments" :key="comment.id" class="comment-item">
              <div class="comment-user">{{ comment.username }}</div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-time">{{ formatTime(comment.created_time) }}</div>
              <div class="comment-time">
                <div style="margin-left: 10px;">{{ comment.city }}</div>
              </div>
            </div>
          </div>
          <button class="load-more-button" @click="loadMoreComments" v-if="commentCount < commentDatas.length">查看更多</button>
          <p v-if="noMoreComments" class="no-more-comments">没有更多评论了</p>
        </div>

      </div>
      <div class="right-column">
        <div class="profile-box">
          <div class="comment-title">个人信息展示框</div>
          <div class="userMsg">个人信息展示框内容</div>
        </div>
        <div class="likebox">
          <div class="comment-title">点赞框</div>
          <div class="like-info">
            <div class="heart" @click="handleLikeClick"></div>
            <div class="likecounts">{{ likecounts }}</div>
          </div>
        </div>
        <div class="popular-locations-box">
          <div class="comment-title">热门地区</div>
          <canvas id="ip-chart" style="width: 150px; height: 150px;"></canvas>
        </div>
      </div>
    </div>
    <backTop :defaultProps="55" :date="1000" :color="topColor" style="z-index:999;"></backTop>
  </div>
</template>

<script>
import chart from '../../assets/JS/chart';
import { Typeit } from '../../utils/plugMsg.js';
import backTop from '../../components/nav/ToTap.vue';
import axios from 'axios';
import { sendComment, getComment, getMoreComments, saveLikes, getLikes } from '@/api/MessageBoard.api'
// 引入表情
import { Picker } from 'emoji-mart-vue';
import CustomButton from '@/components/button/ShinButton.vue';

export default {
  components: { backTop, Picker, CustomButton },
  data() {
    return {
      // 评论区
      commentContent: '',
      nameOption: 'auto',
      customName: '',
      sendname: '',   // 保存的名称
      likecounts: null,
      commentDatas: [],  // 评论数据
      barrageData: [],  // 弹幕数据
      visibleMessages: [], // 用于显示的消息数组
      currentIndex: 0, // 当前显示的消息索引
      interval: null, // 定时器
      commentCount: 5,  // 当前显示的评论数量
      // visibleComments: [],
      noMoreComments: false,  // 是否没有更多评论了
      // 回到顶部组件颜色
      topColor: '#66ccff',
      // 表情包
      showEmojiPicker: false,
      // 饼图
      ipChart: null,
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
      // 节流
      lastUpdateTimestamp: 0, //上次点击时间
      throttleInterval: 2000, // 节流时间间隔，单位：毫秒
    };
  },
  created() {
    // 在页面创建时重置滚动条位置
    window.scrollTo(0, 0);
  },
  computed: {
    visibleComments() {
      return this.commentDatas.slice(0, this.commentCount);
    }
  },
  mounted() {
    // 监听滚动事件
    window.addEventListener('scroll', this.watchScroll);
    // 监听表情包点击事件
    document.addEventListener('click', this.handleOutsideClick);
    // 初始化 Typeit 函数
    this.initializeTypeit();
    // 获取评论列表
    this.getComments();
    // 获取点赞数量
    this.getLikeCounts();
    // 设置定时器，每隔5秒显示下一条消息（根据需要调整间隔时间）
    this.interval = setInterval(this.showNextMessage, 5000);
  },
  methods: {
    // 时间格式
    formatTime(time) {
      const formattedTime = new Date(time).toLocaleString();
      return formattedTime;
    },
    initializeTypeit() {
      const that = this;
      // 延迟执行 Typeit 函数，以防止找不到 Vue 实例
      setTimeout(function () {
        Typeit(that.test, "#luke"); // 打字机效果
      }, 500);
    },
    watchScroll() {
      // 滚动事件逻辑
    },
    // 表情包 
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker; // 切换 showEmojiPicker 的值
    },
    handleEmojiClick(emoji) {
      // 处理选中的表情
      this.commentContent += emoji.native; // 将选中的表情添加到输入框中
      this.showEmojiPicker = false

    },
    handleOutsideClick(event) {
      const emojiButton = document.querySelector('.emoji-button');
      const emojiPanel = document.querySelector('.emoji-panel');

      // 检查点击的位置是否在表情包栏以外
      if (emojiButton && emojiPanel && !emojiButton.contains(event.target) && !emojiPanel.contains(event.target)) {
        this.showEmojiPicker = false; // 关闭表情包
      }
    },
    // 节流
    handleThrottledStatusChange() {
      const currentTime = Date.now(); // 获取当前时间戳
      // 检查当前时间与上次更新时间的间隔是否超过节流时间间隔
      if (currentTime - this.lastUpdateTimestamp >= this.throttleInterval) {
        this.submitComment(); // 执行实际的状态更新逻辑
        this.lastUpdateTimestamp = currentTime; // 更新上次更新时间戳
      }
    },
    // 评论区
    submitComment() {
      // 检查评论内容是否为空
      if (!this.commentContent) {
        this.$message.error('评论内容不能为空');
        return;
      }
      // 定义卡通名称数组
      const cartoonNames = ['Tom', 'Jerry', 'Mickey', 'Donald', 'Goofy'];
      // 从卡通名称数组中随机选择一个名称
      const randomIndex = Math.floor(Math.random() * cartoonNames.length);
      const randomCartoonName = cartoonNames[randomIndex];
      // 将随机卡通名称赋给 this.commentUsername
      const commentUsername = randomCartoonName;
      if (this.nameOption === 'custom') {
        this.sendname = this.customName
      } else {
        this.sendname = commentUsername
      }
      const listData = {
        'content': this.commentContent,
        'username': this.sendname
      }

      sendComment(listData)
        .then(res => {
          if (res.status === 200) {
            this.$message.success('评论成功');
            // 添加评论到弹幕消息数组，并设置isNew为true
            this.visibleMessages.unshift({
              text: this.commentContent.trim(),
              isNew: true,
              top: Math.floor(Math.random() * 170)
            });
            // 清空评论输入框
            this.commentContent = '';
            // 更新评论列表
            this.getComments();
            //   // 清除之前的定时器
            //   clearInterval(this.interval);

            //   // 设置新的定时器，以确保新的弹幕消息会立即显示
            //   this.currentIndex = 0;
            //   this.interval = setInterval(this.showNextMessage, 5000);
          } else {
            this.$message.error(res.data.message);
            console.log('错误！')
          }
        })
        .catch((error) => {
          this.$message.error('评论失败，请稍后再试', error);
          console.log(error, 'AXIOS报错');
        });
    },
    // 获取评论列表
    getComments() {
      getComment()
        .then(response => {
          const comments = response.data.comments;
          // 将评论转换为弹幕数据格式
          this.barrageData = comments.map(comment => ({
            text: comment.content.trim(),
            isNew: false,
            top: Math.floor(Math.random() * 180) + 10
          }));
          // 遍历评论数据，将城市名称转换为中文
          const transformedComments = comments.map((comment) => {
            const chineseCity = this.cityMapping[comment.city];
            return {
              ...comment,
              city: chineseCity || comment.city, // 使用中文城市名称，如果映射关系不存在，则保持原始值
            };
          });

          this.commentDatas = transformedComments;
          // 绘制IP地址的饼状图
          this.drawIPChart();
        })
        .catch(error => {
          console.error(error);
        });
    },
    // 第一种做法：在前端获取所有评论在进行分页
    loadMoreComments() {
      this.commentCount += 5;  // 每次点击"查看更多"按钮，增加5条评论的显示数量
      if (this.commentCount >= this.commentDatas.length) {
        this.noMoreComments = true;  // 如果评论全部显示完毕，则显示"没有更多评论了"的提示
      }
    },
    // 第二种做法：在后端分页请求指定的评论数量
    // loadMoreComments() {
    //   const params = { offset: this.commentCount }
    //   getMoreComments(params)
    //     .then(response => {
    //       const newComments = response.data.comments;
    //       console.log(newComments, 'sssssssssssssss');
    //       this.visibleComments = newComments
    //       // 将新获取的评论添加到现有评论列表中
    //       this.comments = [...this.comments, ...newComments];

    //       // 增加评论数量
    //       this.commentCount += newComments.length;

    //       // 检查是否没有更多评论了
    //       if (newComments.length === 0) {
    //         this.noMoreComments = true;  // 如果评论不足五条或没有更多评论，则显示提示
    //       }
    //     })
    //     .catch(error => {
    //       console.error("Error fetching comments:", error);
    //     });
    // },

    // 点赞区
    handleLikeClick() {
      this.saveLikeCounts();
    },
    saveLikeCounts() {
      // 将counts发送到后台保存
      // axios.post('http://47.115.231.184:5555/likes/like')
      // axios.post('http://127.0.0.1/likes/like')
      saveLikes()
        .then(response => {
          // 请求成功处理
          this.getLikeCounts();
        })
        .catch(error => {
          // 请求失败处理
          console.error('点赞数保存失败', error);
        });
    },
    getLikeCounts() {
      // .get('http://47.115.231.184:5555/likes/likeCounts')
      // axios.get('http://127.0.0.1/likes/likeCounts')
      getLikes()
        .then((response) => {
          this.likecounts = response.data.counts;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 绘制IP地址的饼状图
    drawIPChart() {
      // 销毁之前的图表实例
      if (this.ipChart) {
        this.ipChart.destroy();
      }
      // 获取所有 IP 地址
      const ipAddresses = this.commentDatas.map(comment => comment.city);
      // 计算每个 IP 地址的数量
      const ipAddressCounts = ipAddresses.reduce((counts, ipAddress) => {
        counts[ipAddress] = (counts[ipAddress] || 0) + 1;
        return counts;
      }, {});

      // 提取 IP 地址和对应的数量
      const labels = Object.keys(ipAddressCounts);
      const data = Object.values(ipAddressCounts);

      // 创建饼状图
      this.ipChart = new Chart('ip-chart', {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#33FF99',
              '#FF6384',
              '#FF8C00',
              '#8A2BE2',
              '#00FF7F',
              '#FF1493',
              '#00BFFF',
              '#FFD700',
              // 添加更多颜色...
            ],
          }],
        },
      });
    },
    // 弹幕区
    showNextMessage() {
      if (this.currentIndex < this.barrageData.length) {
        this.visibleMessages.push(this.barrageData[this.currentIndex]);
        this.currentIndex++;
      } else {
        clearInterval(this.interval); // 当所有消息显示完毕后，清除定时器
      }
    },
  },
};
</script>

<style scoped>
.body {
  padding-top: 80px;
  margin-left: 200px;
  margin-right: 200px;
  min-height: calc(100vh - 80px);
  scroll-behavior: smooth;
  background-color: #fff;
}

@media (max-width: 800px) {
  .body {
    padding-top: 60px;
  }
}

.scene {
  position: relative;
  text-align: center;
  margin-top: 0px;
  font-size: 80px;
  height: 106px;
  color: #fff;
  font-family: "Sigmar One", Arial;
  background-color: rgba(117, 197, 221, 0.3);
  border-radius: 20px;
  margin-bottom: 10px;
}

.text-container {
  display: inline-block;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0);
  background: linear-gradient(to bottom right, #ffcc00, #ff6699);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 弹幕区 */
.message_board {
  position: relative;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}

/* 文字留言 */
.message {
  position: absolute;
  left: 100%;
  white-space: nowrap;
  animation: marquee 20s linear infinite;
  font-size: 16px; /* 设置合适的字号 */
  color: #000000;
  padding: 5px;
}

@keyframes marquee {
  from {
    left: 100%;
    /* 动画从容器的最右边开始 */
  }

  to {
    left: -100%;
    /* 消失到容器的最左边 */
  }
}

.new-message {
  padding: 2px;
  border: 2px solid rgb(221, 218, 15);
  animation: scrollIn 5s linear; /* 5秒内从右侧滚动进入屏幕 */
}

.content {
  display: flex;
  justify-content: space-between;
}

.left-column {
  flex-grow: 1;
  margin-right: 20px;
  max-width: 900px;
}

.right-column {
  flex-basis: 40%;
}

.comment-module {
  margin-bottom: 20px;
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 20px;
}

.comment-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

canvas {
  width: 150px;
  height: 150px;
}

.comment-input {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 10px;
}

/* 表情面板样式 */
.emoji-selector {
  margin-bottom: 10px;
  position: relative;
}

.emoji-button {
  background-color: #ffcc00;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}

.emoji-panel {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
}

/* 留下名称 */
.name-option {
  display: flex;
  height: 25px;
  align-items: center;
  margin: 10px 0 10px 0;
}

.name-option-label {
  margin-right: 10px;
  cursor: pointer;
}

.name-input {
  display: flex;
  align-items: center;
}

.name-input input {
  width: 200px;
  height: 30px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  background-color: #ffcc00;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
}

.comment-list {
  /* 评论列表样式 */
}

.comment-item {
  position: relative;
  padding: 10px;
  background-color: #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 198, 255, 0.5);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.comment-item:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(0, 198, 255, 0.2),
    rgba(0, 198, 255, 0.5)
  );
  pointer-events: none;
  z-index: -1;
}

.comment-user {
  font-weight: bold;
  color: #333;
}

.comment-content {
  margin-top: 5px;
  color: #555;
  margin-left: 20px;
  word-wrap: break-word;
}

.comment-time {
  display: flex;
  justify-content: flex-end;
}

.load-more-button {
  margin-top: 10px;
  background-color: #ffcc00;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
}

.no-more-comments {
  font-size: 14px;
  color: #888;
  text-align: center;
  padding: 10px;
  background-color: #f2f2f2;
  /* Add any other styles you want */
}

.profile-box {
  margin-bottom: 20px;
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 20px;
}

.likebox {
  margin-bottom: 20px;
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 20px;
}

.likebox .comment-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.likebox .like-info {
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 150px;
}

.likebox .heart {
  width: 100px;
  height: 100px;
  position: relative;
  animation: pulsate 2s infinite;
  margin-left: 50px;
  margin-top: 20px;
  /* 爱心与标题之间的间距 */
}

.likebox .likecounts {
  text-align: center;
  font-weight: bold;
  color: rgba(23, 20, 219, 0.3);
}

.likebox .heart::before,
.likebox .heart::after {
  content: "";
  position: absolute;
  top: 0;
  width: 52px;
  height: 80px;
  border-radius: 50px 50px 0 0;
  background-color: red;
}

.likebox .heart::before {
  left: 50px;
  transform: rotate(-45deg);
  transform-origin: 0 100%;
}

.likebox .heart::after {
  left: 0;
  transform: rotate(45deg);
  transform-origin: 100% 100%;
}

@keyframes pulsate {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
.userMsg:hover {
  animation: wobble 2s infinite;
}
/* 摆动的动画 */
@keyframes wobble {
  0% {
    transform: translateY(0%);
  }

  15% {
    transform: translateY(-25%);
  }

  30% {
    transform: translateY(20%);
  }

  45% {
    transform: translateY(-15%);
  }

  60% {
    transform: translateY(10%);
  }

  75% {
    transform: translateY(-5%);
  }

  100% {
    transform: translateY(0%);
  }
}
.popular-locations-box {
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 20px;
}
</style>