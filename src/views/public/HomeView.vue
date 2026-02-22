<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">الصفحة الرئيسية</h1>
      <p class="text-slate-600 dark:text-slate-300">مرحباً بك في نظام الإدارة</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <!-- عمود الإدارة العامة -->
      <div
        v-if="authStore.isAdmin"
        class="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
            >
              <i class="bi bi-gear-fill text-2xl text-blue-600 dark:text-blue-400"></i>
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">الإدارة العامة</h2>
          </div>
        </div>

        <div class="p-4 space-y-2">
          <router-link
            to="/system/users"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
          >
            <div
              class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors"
            >
              <i
                class="bi bi-people-fill text-xl text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              ></i>
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-slate-900 dark:text-white">إدارة المستخدمين</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">عرض وإدارة حسابات المستخدمين</p>
            </div>
            <i class="bi bi-chevron-left text-slate-400"></i>
          </router-link>
          <router-link
            to="/system/settings/system-monitor"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
          >
            <div
              class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors"
            >
              <i
                class="bi bi-people-fill text-xl text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              ></i>
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-slate-900 dark:text-white">مراقب النظام</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">مراقبة موارد الخادم، حالة الـ APIs، والأعطال البرمجية</p>
            </div>
            <i class="bi bi-chevron-left text-slate-400"></i>
          </router-link>
        </div>
      </div>

      <!-- يمكن إضافة أعمدة أخرى هنا -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
            >
              <i class="bi bi-card-list text-2xl text-blue-600 dark:text-blue-400"></i>
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">المخزون</h2>
          </div>
        </div>

        <div class="p-4 space-y-2">
          <router-link
            to="/inventory/item-cards"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
          >
            <div
              class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors"
            >
              <i
                class="bi bi-card-list text-xl text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              ></i>
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-slate-900 dark:text-white">كروت الأصناف</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">عرض وإدارة بيانات الأصناف</p>
            </div>
            <i class="bi bi-chevron-left text-slate-400"></i>
          </router-link>
          <router-link
            to="/inventory/warehouses"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
          >
            <div
              class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors"
            >
              <i
                class="bi bi-box-seam text-xl text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              ></i>
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-slate-900 dark:text-white">المخازن</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">عرض وإدارة بيانات المخازن</p>
            </div>
            <i class="bi bi-chevron-left text-slate-400"></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
const authStore = useAuthStore()
</script>
