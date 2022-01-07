import { createRouter, createWebHistory } from 'vue-router'

import NotFound from '@/views/common/NotFound.vue'
import main from './module/main'
import login from './module/login'

/** @type {import('vue-router').RouterOptions['routes']} */
const routes = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    redirect: '/main/index',
    component: ()=>import('@/views/main/MainApp.vue'),
    children: main
  },
  {
    path: '/login',
    redirect: '/login/login',
    component: ()=>import('@/views/login/LoginApp.vue'),
    children: login
  },
  {
    path: '/charts',
    component: ()=>import('@/views/common/Charts.vue')
  },
  { path: '/:path(.*)', component: NotFound },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})