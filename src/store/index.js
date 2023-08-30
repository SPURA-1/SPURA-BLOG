import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    userRole: null,
    userImage: null,
    userNickname: null,
    useName: null,
  },
  getters: {
    userRole: state => state.userRole,
    userData: state => {
      return {
        userImage: state.userImage,
        userNickname: state.userNickname,
        useName: state.useName,
      };
    }
  },
  mutations: {
    login(state, role) {
      state.isAuthenticated = true;
      state.userRole = role;
    },
    loginMsg(state, data) {
      state.isAuthenticated = true;
      state.userImage = data.userImg;
      state.userNickname = data.userNickname;
      state.useName = data.useName;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userRole = null;
      console.log('User logged out'); // 在登出时打印信息
    },
    updateToken(state, newToken) {
      // 在这里更新 state 中的 token 信息
      state.token = newToken; // 更新 state 中的 token 信息
    },
  },
  actions: {
  },
  modules: {

  },
  plugins: [
    createPersistedState({
      paths: ['userRole', 'userImage', 'userNickname'] // 保存指定的状态到本地存储
    })
  ],
})
