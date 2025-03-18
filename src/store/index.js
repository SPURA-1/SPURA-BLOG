import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  // 包含了应用程序的状态，例如用户认证状态、用户信息、异常状态等。
  state: {
    // 用户认证状态，表示用户是否已登录
    isAuthenticated: false,
    // 用户角色
    userRole: null,
    // 用户头像
    userImage: null,
    // 用户昵称
    userNickname: null,
    // 用户名
    useName: null,
    // 图片地址
    ImageUrl: 'http://47.121.187.247:5555',
    // 异常状态，用于存储捕获到的错误日志
    errorLogs: [],
  },
  // 定义了一些用于获取状态的方法
  getters: {
    userRole: state => state.userRole,
    userData: state => {
      return {
        userImage: state.userImage,
        userNickname: state.userNickname,
        useName: state.useName,
      };
    },
    // 获取异常状态
    errorLogs: state => state.errorLogs,
  },
  // 包含了一些用于修改状态的方法，是 Vuex 中唯一修改状态的地方。
  mutations: {
    // 修改用户认证状态和用户角色。
    login(state, role) {
      state.isAuthenticated = true;
      state.userRole = role;
    },
    // 修改用户认证状态和用户信息。
    loginMsg(state, data) {
      state.isAuthenticated = true;
      state.userImage = data.userImg;
      state.userNickname = data.userNickname;
      state.useName = data.useName;
    },
    // 修改用户认证状态为未登录。
    logout(state) {
      state.isAuthenticated = false;
      state.userRole = null;
      console.log('User logged out'); // 在登出时打印信息
    },
    // 更新用户的 token 信息。
    updateToken(state, newToken) {
      // 在这里更新 state 中的 token 信息
      state.token = newToken; // 更新 state 中的 token 信息
    },
    // 添加进异常状态
    addErrorLog(state, errorLog) {
      state.errorLogs.push(errorLog)
    },
    // 清空异常状态
    clearErrorLog: (state) => {
      state.errorLogs.splice(0)
    },
  },
  // 包含了一些用于触发 mutations 的方法。
  actions: {
    // 触发 addErrorLog mutation，将错误日志添加到异常状态中。
    addErrorLog({ commit }, errorLog) {
      commit('addErrorLog', errorLog)
    },
    // 触发 clearErrorLog mutation，清空异常状态。
    clearErrorLog({ commit }) {
      commit('clearErrorLog')
    },
  },
  modules: {
  },
  plugins: [
    // 使用了 vuex-persistedstate 插件，用于将指定的状态持久化到本地存储，以便在页面刷新后保持状态。
    createPersistedState({
      paths: ['userRole', 'userImage', 'userNickname'] // 保存指定的状态到本地存储
    })
  ],
})
