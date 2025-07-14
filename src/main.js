import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

Vue.config.productionTip = false;
axios.defaults.baseURL = 'http://localhost:5000';
// Attach token to every request
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Function to decode token and get expiry time
function getTokenExpiry(token) {
  const decoded = jwtDecode(token);
  return decoded.exp * 1000; // convert to milliseconds
}

// Refresh token logic
async function refreshTokenBeforeExpiry() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const expiryTime = getTokenExpiry(token);
  const now = Date.now();
  const refreshThreshold = 5 * 60 * 1000; // 5 minutes
  const timeToRefresh = expiryTime - now - refreshThreshold;

  if (timeToRefresh > 0) {
    setTimeout(() => refreshAndReschedule(), timeToRefresh);
  } else {
    refreshAndReschedule(); // immediate refresh if already near expiry
  }

  async function refreshAndReschedule() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post('/refresh-token', { refreshToken });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      console.log('Token refreshed automatically');
      refreshTokenBeforeExpiry(); // Schedule again
    } catch (err) {
      console.error('Auto refresh failed', err.message);
      localStorage.clear();
      window.location = '/login';
    }
  }
}

// Call the function on app startup
refreshTokenBeforeExpiry();

new Vue({
  router,
  store,  // 
  render: h => h(App)
}).$mount('#app');
