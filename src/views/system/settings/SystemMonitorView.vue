<template>
  <div class="p-6">
    <BaseTabs v-model="activeTab" :tabs="tabs">
      <template #tab="{ tab }">
        <div class="flex items-center gap-2">
          <i :class="(tab as any).icon"></i>
          {{ tab.label }}
        </div>
      </template>

      <template #panel>
        <BasePageHeader
          :title="activeTab === 'api' ? 'مراقب واجهات البرمجة' : 'سجل أعطال النظام'"
          :subtitle="
            activeTab === 'api'
              ? 'مراقبة مسارات الـ APIs وحالة استجابتها في الوقت الفعلي'
              : 'استعراض وتحليل الأخطاء البرمجية المسجلة في السيرفر'
          "
        />

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div class="stat-card">
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
              >
                <i class="bi bi-cpu fs-4"></i>
              </div>
              <span class="text-xs font-mono text-slate-500 dark:text-slate-400"
                >{{ metrics?.cpu?.cores }} Cores</span
              >
            </div>
            <h3 class="text-slate-500 dark:text-slate-400 text-sm mb-1 uppercase tracking-wider">
              CPU Load
            </h3>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-slate-900 dark:text-white">{{
                metrics?.cpu?.loadAvg?.toFixed(2) || '0.00'
              }}</span>
              <span class="text-xs text-slate-400 dark:text-slate-500">Avg (1min)</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400"
              >
                <i class="bi bi-memory fs-4"></i>
              </div>
              <span class="text-xs font-mono text-slate-500 dark:text-slate-400"
                >{{ metrics?.memory?.percentage?.toFixed(1) }}% used</span
              >
            </div>
            <h3 class="text-slate-500 dark:text-slate-400 text-sm mb-1 uppercase tracking-wider">
              RAM Usage
            </h3>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-slate-900 dark:text-white">{{
                formatBytes(metrics?.memory?.used || 0)
              }}</span>
              <span class="text-xs text-slate-400 dark:text-slate-500"
                >/ {{ formatBytes(metrics?.memory?.total || 0) }}</span
              >
            </div>
          </div>

          <div class="stat-card">
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
              >
                <i class="bi bi-clock-history fs-4"></i>
              </div>
            </div>
            <h3 class="text-slate-500 dark:text-slate-400 text-sm mb-1 uppercase tracking-wider">
              Uptime
            </h3>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-slate-900 dark:text-white">{{
                formatUptime(metrics?.uptime || 0)
              }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400"
              >
                <i class="bi bi-hdd-network fs-4"></i>
              </div>
              <span class="text-xs font-mono text-slate-500 dark:text-slate-400">{{
                metrics?.platform
              }}</span>
            </div>
            <h3 class="text-slate-500 dark:text-slate-400 text-sm mb-1 uppercase tracking-wider">
              Environment
            </h3>
            <div class="flex items-baseline gap-2">
              <span class="text-xl font-bold text-slate-900 dark:text-white">Production</span>
            </div>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="mt-8">
          <!-- API Monitor Panel -->
          <div v-if="activeTab === 'api'" class="fade-in">
            <BaseTable
              :columns="apiColumns"
              :rows="routes"
              :loading="isLoading"
              row-key="path"
              loading-text="جاري فحص الـ APIs..."
              empty-text="لا توجد APIs لعرضها"
              :show-edit-action="false"
              :show-delete-action="false"
            >
              <template #cell-path="{ value }">
                <code
                  class="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {{ value }}
                </code>
              </template>

              <template #cell-statusCode="{ value, row }">
                <span
                  class="px-2 py-1 rounded-md text-xs font-bold font-mono border"
                  :class="getStatusCodeClass(value, row.status)"
                >
                  {{ value }}
                </span>
              </template>

              <template #cell-method="{ value }">
                <span
                  class="px-2 py-1 rounded text-[10px] font-bold uppercase"
                  :class="getMethodClass(value)"
                >
                  {{ value }}
                </span>
              </template>

              <template #cell-status="{ value }">
                <div class="flex items-center gap-2">
                  <span
                    class="h-2 w-2 rounded-full"
                    :class="value === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
                  ></span>
                  <span
                    class="text-xs font-medium"
                    :class="
                      value === 'online'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    "
                  >
                    {{ value === 'online' ? 'يعمل جيدا' : 'يوجد مشكلة' }}
                  </span>
                </div>
              </template>
            </BaseTable>
          </div>

          <!-- System Faults Panel -->
          <div v-else-if="activeTab === 'faults'" class="fade-in">
            <BaseTable
              :columns="faultColumns"
              :rows="faults"
              :loading="isLoading"
              row-key="id"
              loading-text="جاري تحميل الأعطال..."
              empty-text="لا توجد أعطال مسجلة حالياً"
              :show-edit-action="false"
              :show-delete-action="false"
            >
              <template #cell-timestamp="{ value }">
                <span class="text-xs text-slate-500">{{ formatDate(value) }}</span>
              </template>

              <template #cell-statusCode="{ value }">
                <span
                  v-if="value"
                  class="px-2 py-1 rounded-md text-xs font-bold font-mono bg-red-50 text-red-600 border border-red-100"
                >
                  {{ value }}
                </span>
              </template>

              <template #cell-message="{ value }">
                <div class="max-w-[400px] truncate" :title="value">
                  {{ value }}
                </div>
              </template>

              <template #cell-path="{ value, row }">
                <div v-if="value" class="flex items-center gap-2">
                  <span
                    class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                    :class="getMethodClass(row.method)"
                  >
                    {{ row.method }}
                  </span>
                  <code class="text-[11px] font-mono text-slate-500">{{ value }}</code>
                </div>
                <span v-else class="text-slate-400">-</span>
              </template>

              <template #cell-stack="{ value }">
                <button
                  @click="showStack(value)"
                  v-if="value"
                  class="text-xs text-blue-600 hover:underline"
                >
                  عرض الـ Stack Trace
                </button>
              </template>
            </BaseTable>
          </div>
        </div>
      </template>
    </BaseTabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import BasePageHeader from '@/components/base/BasePageHeader.vue'
import BaseTable, { type BaseTableColumn } from '@/components/base/BaseTable.vue'
import BaseTabs, { type BaseTabItem } from '@/components/base/BaseTabs.vue'
import {
  systemService,
  type ApiRoute,
  type SystemMetrics,
  type SystemFault,
} from '@/services/APIs/system/system.service'
import swalService from '@/services/swal.service'

const activeTab = ref('api')
const routes = ref<ApiRoute[]>([])
const metrics = ref<SystemMetrics | null>(null)
const faults = ref<SystemFault[]>([])
const isLoading = ref(true)
let refreshInterval: ReturnType<typeof setInterval> | null = null

interface ExtendedTab extends BaseTabItem {
  icon: string
}

const tabs: ExtendedTab[] = [
  { value: 'api', label: 'واجهات البرمجة (APIs)', icon: 'bi bi-hdd-network' },
  { value: 'faults', label: 'الأعطال (Faults)', icon: 'bi bi-bug' },
]

const apiColumns: BaseTableColumn[] = [
  { key: 'method', label: 'النوع', headerClass: 'text-right', class: 'text-right min-w-[80px]' },
  { key: 'path', label: 'المسار', headerClass: 'text-right', class: 'text-right' },
  { key: 'statusCode', label: 'كود الحالة', headerClass: 'text-right', class: 'text-right' },
  { key: 'status', label: 'الحالة', headerClass: 'text-right', class: 'text-right' },
]

const faultColumns: BaseTableColumn[] = [
  { key: 'timestamp', label: 'الوقت', headerClass: 'text-right', class: 'text-right' },
  { key: 'statusCode', label: 'الكود', headerClass: 'text-right', class: 'text-right' },
  { key: 'path', label: 'المصدر', headerClass: 'text-right', class: 'text-right' },
  { key: 'message', label: 'الرسالة', headerClass: 'text-right', class: 'text-right' },
  { key: 'stack', label: 'التفاصيل', headerClass: 'text-right', class: 'text-right' },
]

const getMethodClass = (method: string = '') => {
  const m = method.toUpperCase()
  if (m.includes('GET'))
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
  if (m.includes('POST'))
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800'
  if (m.includes('PUT') || m.includes('PATCH'))
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
  if (m.includes('DELETE'))
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800'
  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
}

const getStatusCodeClass = (code: number, status: string) => {
  if (status === 'offline')
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
  if (code >= 200 && code < 300)
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
  if (code >= 400)
    return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
  return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatUptime = (seconds: number) => {
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${d}d ${h}h ${m}m`
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const showStack = (stack: string) => {
  swalService.popup({
    title: 'Stack Trace',
    html: `<pre class="text-start bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-xs font-mono" style="max-height: 400px">${stack}</pre>`,
    width: '800px',
    confirmButtonText: 'إغلاق',
    confirmButtonColor: '#3085d6',
  })
}

const fetchData = async () => {
  try {
    const fetchTasks: [
      Promise<ApiRoute[]> | ApiRoute[],
      Promise<SystemMetrics>,
      Promise<SystemFault[]>,
    ] = [
      routes.value.length === 0 ? systemService.getApiRoutes() : routes.value,
      systemService.getSystemMetrics(),
      systemService.getSystemFaults(),
    ]
    const [routeData, metricsData, faultData] = await Promise.all(fetchTasks)
    routes.value = routeData
    metrics.value = metricsData
    faults.value = faultData
  } catch (error) {
    console.error('Error fetching monitoring data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
  // Refresh every 5 seconds
  refreshInterval = setInterval(fetchData, 5000)
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>
