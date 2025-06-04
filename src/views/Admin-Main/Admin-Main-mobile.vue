<template>
  <div class="admin-mobile">
    <header
      class="mobile-header"
      :style="{ background: SettingColor || '#66b1ff' }"
    >
      <span class="logo">SPURA 后台</span>
      <button
        class="menu-btn"
        @click="showMenu = !showMenu"
      >
        <span v-if="!showMenu">&#9776;</span>
        <span v-else>&#10005;</span>
      </button>
    </header>
    <nav
      v-if="showMenu"
      class="mobile-nav"
    >
      <ul>
        <li
          v-for="item in menuList"
          :key="item.name"
          @click="goPage(item.path, item)"
        >
          <span>{{ item.title }}</span>
        </li>
      </ul>
    </nav>
    <main class="mobile-main">
      <h2 style="color:#409eff">欢迎来到SPURA小站</h2>
      <!-- 资源总览 -->
      <div class="overview-section">
        <div
          class="overview-card"
          v-for="item in overviewList"
          :key="item.title"
          :style="{background: item.bg}"
          @click="goOverview(item)"
        >
          <div
            class="icon"
            :style="{color: item.color}"
          ><i :class="item.icon"></i></div>
          <div class="info">
            <div class="num">{{ item.value }}</div>
            <div class="label">{{ item.title }}</div>
          </div>
        </div>
      </div>

      <!-- 最近发布 -->
      <div class="recent-section">
        <div class="section-title">最近发布</div>
        <div
          v-for="art in ArtList"
          :key="art.id"
          class="recent-item"
        >
          <div
            class="recent-title"
            @click="goArticle(art.id)"
          >{{ art.title }}</div>
          <div class="recent-meta">
            <span class="category">{{ art.category }}</span>
            <span class="date">{{ art.publish_date }}</span>
          </div>
          <div class="recent-intro">{{ truncateContent(art.Introduction) }}</div>
        </div>
      </div>
    </main>
    <div
      v-if="showConfirm"
      class="mobile-confirm-mask"
    >
      <div class="mobile-confirm-box">
        <div class="mobile-confirm-msg">确定退出吗？</div>
        <div class="mobile-confirm-btns">
          <button
            @click="doLogout"
            class="confirm"
          >确定</button>
          <button
            @click="showConfirm = false"
            class="cancel"
          >取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAdminData } from '@/api/AdminHome.api'
import { getNewArticles, getCategoriesList } from '@/api/ArticleList.api'

export default {
  name: "AdminMobile",
  props: {
    SettingColor: {
      type: String,
      default: "#66b1ff"
    }
  },
  data() {
    return {
      showMenu: false,
      showConfirm: false,
      menuList: [
        { name: "dashboard", title: "仪表盘", path: "/admin/dashboard" },
        { name: "user", title: "用户管理", path: "/admin/user" },
        { name: "article", title: "文章管理", path: "/admin/article" },
        { name: "logout", title: "退出登录", path: "/logout", isLogout: true }
      ],
      overviewList: [],
      ArtList: [],
      categories: [],
      categoryNames: {}
    }
  },
  created() {
    this.getPageListData();
    this.getCategoryList();
    this.getReportListData();
  },
  methods: {
    goPage(path, item) {
      this.showMenu = false;
      if (item.isLogout) {
        this.showConfirm = true;
      } else {
        this.$router.push(path);
      }
    },
    doLogout() {
      this.showConfirm = false;
      this.$message({
        type: "success",
        message: "退出成功!",
      });
      window.sessionStorage.clear();
      this.$router.push("/");
    },
    goArticle(id) {
      this.$router.push({ name: 'ArticleShow', params: { id } });
    },
    goOverview(item) {
      // 根据卡片标题跳转到对应页面
      if (item.title === '文章总数') {
        this.$router.push('/pages/ArticleList');
      } else if (item.title === '游戏总数') {
        this.$router.push('/admin/game');
      } else if (item.title === '留言总数') {
        this.$router.push('/admin/message');
      } else if (item.title === '用户总数') {
        this.$router.push('/user/UserListPhone');
      }
    },
    // 获取资源总览
    getPageListData() {
      getAdminData()
        .then(res => {
          if (res.status === 200) {
            const d = res.data;
            this.overviewList = [
              {
                title: '文章总数',
                value: d.artLength,
                icon: 'el-icon-document',
                color: '#409EFF',
                bg: 'linear-gradient(90deg,#e0e7ff 0%,#f5f6fa 100%)'
              },
              {
                title: '游戏总数',
                value: d.gameLength,
                icon: 'el-icon-s-flag',
                color: '#67C23A',
                bg: 'linear-gradient(90deg,#e0ffe7 0%,#f6faf5 100%)'
              },
              {
                title: '留言总数',
                value: d.commentLength,
                icon: 'el-icon-chat-dot-round',
                color: '#909399',
                bg: 'linear-gradient(90deg,#f7f7fa 0%,#f5f6fa 100%)'
              },
              {
                title: '用户总数',
                value: d.userLength,
                icon: 'el-icon-user',
                color: '#409EFF',
                bg: 'linear-gradient(90deg,#e0e7ff 0%,#f5f6fa 100%)'
              }
            ];
          }
        })
        .catch(() => { });
    },
    // 获取分类
    getCategoryList() {
      getCategoriesList().then(res => {
        if (res.status === 200) {
          this.categories = res.data.categories;
          // 分类id到名称的映射
          this.categoryNames = {};
          this.categories.forEach(c => {
            this.categoryNames[c.id] = c.name;
          });
        }
      });
    },
    // 获取最近发布
    getReportListData() {
      getNewArticles().then(res => {
        if (res.status === 200) {
          const ArtList = res.data.articles;
          this.ArtList = ArtList.map(item => ({
            id: item.id,
            category: this.categoryNames[item.category] || '未分类',
            publish_date: item.formatted_publish_date,
            title: item.title,
            Introduction: item.Introduction
          }));
        }
      });
    },
    // 简介截断
    truncateContent(str) {
      const maxLength = 40;
      if (!str) return '';
      return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
    }
  }
}
</script>

<style scoped>
.admin-mobile {
  min-height: 100vh;
  background: #f5f6fa;
  display: flex;
  flex-direction: column;
}
.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  color: #fff;
  font-size: 18px;
}
.logo {
  font-weight: bold;
  letter-spacing: 2px;
}
.menu-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 26px;
  cursor: pointer;
}
.mobile-nav {
  position: absolute;
  top: 48px; /* 与header高度一致 */
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.mobile-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.mobile-nav li {
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  cursor: pointer;
}
.mobile-nav li:hover {
  background: #f5f6fa;
}
.mobile-main {
  flex: 1;
  padding: 24px 16px;
}
.quick-actions {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.quick-actions button {
  flex: 1 1 40%;
  padding: 12px 0;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.quick-actions button:hover {
  background: #66b1ff;
}
.overview-section {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin: 28px 0 18px 0;
  justify-content: space-between;
}
.overview-card {
  flex: 1 1 45%;
  min-width: 140px;
  display: flex;
  align-items: center;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.06);
  padding: 18px 14px;
  background: #fff;
  margin-bottom: 8px;
  transition: box-shadow 0.2s;
}
.overview-card .icon {
  font-size: 32px;
  margin-right: 16px;
}
.overview-card .info .num {
  font-size: 22px;
  font-weight: bold;
  color: #222;
}
.overview-card .info .label {
  font-size: 15px;
  color: #888;
  margin-top: 2px;
}
.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 14px;
  letter-spacing: 1px;
}
.recent-section {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.06);
  padding: 18px 14px;
}
.recent-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 0;
}
.recent-item:last-child {
  border-bottom: none;
}
.recent-title {
  font-size: 16px;
  font-weight: bold;
  color: #222;
  cursor: pointer;
  margin-bottom: 4px;
  transition: color 0.2s;
}
.recent-title:hover {
  color: #409eff;
}
.recent-meta {
  font-size: 13px;
  color: #888;
  margin-bottom: 6px;
  display: flex;
  gap: 12px;
}
.category {
  background: #e0e7ff;
  color: #409eff;
  border-radius: 8px;
  padding: 2px 10px;
  font-size: 12px;
}
.date {
  color: #aaa;
}
.recent-intro {
  font-size: 14px;
  color: #666;
  margin-top: 2px;
  line-height: 1.5;
}
.mobile-confirm-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}
.mobile-confirm-box {
  background: #fff;
  margin: 5vw;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}
.mobile-confirm-msg {
  margin-bottom: 16px;
  font-size: 18px;
}
.mobile-confirm-btns {
  display: flex;
  justify-content: space-around;
  gap: 16px; /* 增加按钮间距 */
}
.confirm {
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.2s;
}
.confirm:hover {
  background: #66b1ff;
}
.cancel {
  background: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.2s;
}
.cancel:hover {
  background: #e0e0e0;
}
</style>