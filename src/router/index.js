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
    { path: '*', component: NotFound }
  ]
})

// Route Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token && to.path !== '/login') {
    return next('/login')
  }

  if (to.path === '/summary' && role !== 'Admin') {
    return next('/products') // or show unauthorized
  }

  next()
})

export default router
