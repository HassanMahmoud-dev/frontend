<template>
  <div
    class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
  >
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
                      v-if="showEditAction"
                      @click="$emit('edit', row)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1"
                      title="تعديل"
                    >
                      <i class="bi bi-pencil-square text-lg"></i>
                    </button>
                    <button
                      v-if="showDeleteAction"
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
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  loading: false,
  loadingText: 'جاري التحميل...',
  emptyText: 'لا يوجد بيانات لعرضها.',
  showEditAction: true,
  showDeleteAction: true,
})

defineEmits<{
  (e: 'edit', row: T): void
  (e: 'delete', row: T): void
}>()

const getRowKey = (row: T, index: number) => {
  const value = row[props.rowKey]
  if (value === undefined || value === null || value === '') {
    return index
  }

  return String(value)
}
</script>
