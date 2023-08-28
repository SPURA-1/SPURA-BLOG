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
    login(state, { role }) {
      state.isAuthenticated = true;
      state.userRole = role;
      console.log('User role set to:', role); // 在登录时打印角色信息
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userRole = null;
      console.log('User logged out'); // 在登出时打印信息
    }
  },
  actions: {
  },
  modules: {

  }
})
