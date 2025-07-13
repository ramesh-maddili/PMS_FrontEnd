import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://localhost:5000'

// Request Interceptor - Attach access token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Flag to avoid infinite loops
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response Interceptor - Auto-refresh token on 401
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // If 401 and request hasn't been retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axios(originalRequest)
        })
      }

      isRefreshing = true

      try {
        const res = await axios.post('/refresh', {
          refreshToken: localStorage.getItem('refreshToken')
        })

        const newAccessToken = res.data.token
        localStorage.setItem('token', newAccessToken)
        axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`

        processQueue(null, newAccessToken)
        return axios(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.clear()
        router.push('/login')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// Make axios available globally
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
