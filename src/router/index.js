import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/views/Index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/categoryList',
    name: 'CategoryList',
    component: () => import('@/views/CategoryList.vue')
  },
  {
    path: '/businessList',
    name: 'BusinessList',
    component: () => import('@/views/BusinessList.vue')
  },
  {
    path: '/mine',
  name: 'Mine',
  component: () => import('@/views/Mine.vue')
  },
  {
  path: '/cart',
  name: 'Cart',
  component: () => import('@/views/Cart.vue')
  },
  {
  path: '/orders',
  name: 'Orders',
  component: () => import('@/views/Orders.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
