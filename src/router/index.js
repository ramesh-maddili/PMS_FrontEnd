import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/UserLogin.vue'
import Products from '../views/UserProducts.vue'
import Summary from '../views/UserSummary.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/products' },
    { path: '/login', component: Login },
    { path: '/products', component: Products },
    { path: '/summary', component: Summary },
    { path: '*', component: NotFound } // catch-all route
  ]
})

// Route Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
