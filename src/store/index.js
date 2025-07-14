import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    role: localStorage.getItem('role') || null
  },
  mutations: {
    setAuth(state, { token, refreshToken, role }) {
      state.token = token;
      state.refreshToken = refreshToken;
      state.role = role;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', role);
    },
    logout(state) {
      state.token = null;
      state.refreshToken = null;
      state.role = null;
      localStorage.clear();
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    isAdmin: state => state.role === 'Admin'
  }
});
