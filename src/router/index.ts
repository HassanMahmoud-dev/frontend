import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/public/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/public/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/system/profile',
      name: 'system-profile',
      component: () => import('@/views/system/users/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/system/users',
      name: 'users',
      component: () => import('@/views/system/users/UserManagementView.vue'),
      meta: { requiresAuth: true, adminOnly: true },
    },
    {
      path: '/system/settings/system-monitor',
      name: 'system-monitor',
      component: () => import('@/views/system/settings/SystemMonitorView.vue'),
      meta: { requiresAuth: true, adminOnly: true },
    },
    {
      path: '/inventory/item-cards',
      name: 'item-cards',
      component: () => import('@/views/module/inventory/ItemCardsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/inventory/warehouses',
      name: 'warehouses',
      component: () => import('@/views/module/inventory/WarehousesView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next('/')
  } else if (to.meta.adminOnly && !authStore.isAdmin) {
    // Redirect to home or 403 page if not admin
    next('/')
  } else {
    next()
  }
})

export default router
