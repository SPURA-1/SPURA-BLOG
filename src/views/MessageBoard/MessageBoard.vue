<template>
  <div class="body">
    <div class="scene">
      <div class="text-container">
        <span id="luke"></span>
      </div>
    </div>
    <div class="content">
      <div class="left-column">
        <div class="comment-module">
          <div class="comment-title">发表评论</div>
          <textarea class="comment-input" placeholder="请输入评论内容"></textarea>
          <div class="emoji-selector">
            <button class="emoji-button">OwO表情</button>
            <div class="emoji-panel">
              <!-- 表情选择面板内容 -->
            </div>
          </div>
          <button class="submit-button">提交评论</button>
        </div>
        <div class="comment-module">
          <div class="comment-title">评论列表||活捉 {{ commentCount }} 条</div>
          <h2 class="comment-title"></h2>
          <div class="comment-list">
            <!-- 评论项内容 -->
          </div>
          <button class="load-more-button">查看更多</button>
          <p v-if="noMoreComments" class="no-more-comments">没有更多评论了</p>
        </div>
      </div>
      <div class="right-column">
        <div class="profile-box">
          <div class="comment-title">个人信息展示框内容</div>
          个人信息展示框内容
        </div>
        <div class="likebox">
          <div class="comment-title">点赞框内容</div>
          点赞框内容
        </div>
        <div class="popular-locations-box">
          <div class="comment-title">热门地区展示框内容</div>
          热门地区展示框内容
        </div>
      </div>
    </div>
    <backTop :defaultProps="55" :date="1000" :color="blue"></backTop>
  </div>
</template>

<script>
import {Typeit } from '../../utils/plugMsg.js'
import backTop from '../../components/nav/ToTap.vue'
export default {
  data() {
    return {
      commentCount: 0,
      noMoreComments: false,
      // other data
    };
  },
  components: { backTop },
  mounted() {
    // 监听滚动事件
    window.addEventListener('scroll', this.watchScroll);
    // 初始化 Typeit 函数
    this.initializeTypeit();
  },
  methods: {
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
  },
}
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
  font-weight: 2000;
  color: #fff;
  font-family: 'Sigmar One', Arial;
  background-color: rgba(117, 197, 221, 0.3);
  border-radius: 20px;
  margin-bottom: 20px;
}

.text-container {
  display: inline-block;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0);
  background: linear-gradient(to bottom right, #ffcc00, #ff6699);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.content {
  display: flex;
  justify-content: space-between;
}

.left-column {
  flex-grow: 1;
  margin-right: 20px;
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

.comment-input {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 10px;
}

.emoji-selector {
  margin-bottom: 10px;
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
  display: none;
  /* 表情面板样式 */
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

.popular-locations-box {
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 20px;
}
</style>