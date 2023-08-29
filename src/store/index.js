import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    userRole: null
  },
  getters: {
    userRole: state => state.userRole
  },
  mutations: {
    login(state, role) {
      state.isAuthenticated = true;
      state.userRole = role;
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

  }
})
