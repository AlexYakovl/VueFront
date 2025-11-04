import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AccountView from '@/views/AccountView.vue'
import ProfileView from '@/views/ProfileView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: AccountView,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
