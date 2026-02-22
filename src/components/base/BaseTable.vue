<template>
  <div
    class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
  >
    <div v-if="showRefreshButton" class="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
      <div class="flex justify-end">
        <button
          @click="$emit('refresh')"
          :disabled="loading"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i class="bi" :class="loading ? 'bi-arrow-repeat animate-spin' : 'bi-arrow-clockwise'"></i>
          {{ refreshButtonLabel }}
        </button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead class="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :class="[
                'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400',
                column.headerClass,
              ]"
            >
              <slot :name="`header-${column.key}`" :column="column">
                {{ column.label }}
              </slot>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
          <tr v-if="loading">
            <td
              :colspan="columns.length"
              class="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
            >
              <div class="flex flex-col items-center justify-center gap-2">
                <div
                  class="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-slate-600 dark:border-t-blue-500"
                ></div>
                {{ loadingText }}
              </div>
            </td>
          </tr>

          <tr v-else-if="rows.length === 0">
            <td
              :colspan="columns.length"
              class="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
            >
              <div class="flex flex-col items-center justify-center gap-2">
                <i class="bi bi-inbox text-3xl opacity-20"></i>
                {{ emptyText }}
              </div>
            </td>
          </tr>

          <tr
            v-else
            v-for="(row, rowIndex) in rows"
            :key="getRowKey(row, rowIndex)"
            class="transition hover:bg-slate-50 dark:hover:bg-slate-800/30"
          >
            <td
              v-for="column in columns"
              :key="`${getRowKey(row, rowIndex)}-${column.key}`"
              :class="[
                'whitespace-nowrap px-4 py-4 text-sm text-slate-700 dark:text-slate-300',
                column.class,
              ]"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="row[column.key]"
                :column="column"
                :row-index="rowIndex"
              >
                <template v-if="column.key === 'ACTIONS'">
                  <div class="flex items-center gap-2">
                    <button
                      v-if="showEditAction && (!isEditVisible || isEditVisible(row))"
                      @click="$emit('edit', row)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1"
                      title="تعديل"
                    >
                      <i class="bi bi-pencil-square text-lg"></i>
                    </button>
                    <button
                      v-if="showDeleteAction && (!isDeleteVisible || isDeleteVisible(row))"
                      @click="$emit('delete', row)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1"
                      title="حذف"
                    >
                      <i class="bi bi-trash text-lg"></i>
                    </button>
                  </div>
                </template>
                <template v-else>
                  {{ row[column.key] ?? '-' }}
                </template>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="showPagination"
      class="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div class="flex items-center gap-2">
        <span class="text-sm text-slate-600 dark:text-slate-400">عدد العناصر في الصفحة:</span>
        <select
          :value="limit"
          @change="(e) => $emit('update:limit', Number((e.target as HTMLSelectElement).value))"
          class="text-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md py-1 px-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option :value="10">10</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
          <option :value="200">200</option>
          <option :value="500">500</option>
        </select>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-sm text-slate-600 dark:text-slate-400">
          عرض {{ total === 0 ? 0 : (page - 1) * limit + 1 }} إلى
          {{ Math.min(page * limit, total) }} من {{ total }} عنصر
        </span>
        <div class="flex gap-1 items-center">
          <button
            @click="$emit('update:page', page - 1)"
            :disabled="page <= 1"
            class="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            السابق
          </button>
          <span
            class="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded"
          >
            {{ page }}
          </span>
          <button
            @click="$emit('update:page', page + 1)"
            :disabled="page >= totalPages"
            class="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
export interface BaseTableColumn {
  key: string
  label: string
  class?: string
  headerClass?: string
}

interface Props {
  columns: BaseTableColumn[]
  rows: T[]
  rowKey?: string
  loading?: boolean
  loadingText?: string
  emptyText?: string
  showEditAction?: boolean
  showDeleteAction?: boolean
  isEditVisible?: (row: T) => boolean
  isDeleteVisible?: (row: T) => boolean
  showPagination?: boolean
  total?: number
  page?: number
  limit?: number
  totalPages?: number
  showRefreshButton?: boolean
  refreshButtonLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  loading: false,
  loadingText: 'جاري التحميل...',
  emptyText: 'لا يوجد بيانات لعرضها.',
  showEditAction: true,
  showDeleteAction: true,
  showPagination: false,
  total: 0,
  page: 1,
  limit: 50,
  totalPages: 1,
  showRefreshButton: true,
  refreshButtonLabel: 'تحديث البيانات',
})

defineEmits<{
  (e: 'edit', row: T): void
  (e: 'delete', row: T): void
  (e: 'update:page', page: number): void
  (e: 'update:limit', limit: number): void
  (e: 'refresh'): void
}>()

const getRowKey = (row: T, index: number) => {
  const value = row[props.rowKey]
  if (value === undefined || value === null || value === '') {
    return index
  }

  return String(value)
}
</script>
