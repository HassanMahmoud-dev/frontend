<template>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :class="['px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600', column.headerClass]"
            >
              <slot :name="`header-${column.key}`" :column="column">
                {{ column.label }}
              </slot>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-4 py-6 text-center text-sm text-slate-500">
              {{ loadingText }}
            </td>
          </tr>

          <tr v-else-if="rows.length === 0">
            <td :colspan="columns.length" class="px-4 py-6 text-center text-sm text-slate-500">
              {{ emptyText }}
            </td>
          </tr>

          <tr
            v-else
            v-for="(row, rowIndex) in rows"
            :key="getRowKey(row, rowIndex)"
            class="transition hover:bg-slate-50"
          >
            <td
              v-for="column in columns"
              :key="`${getRowKey(row, rowIndex)}-${column.key}`"
              :class="['whitespace-nowrap px-4 py-3 text-sm text-slate-700', column.class]"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="row[column.key]"
                :column="column"
                :row-index="rowIndex"
              >
                {{ row[column.key] ?? '-' }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface BaseTableColumn {
  key: string
  label: string
  class?: string
  headerClass?: string
}

type BaseTableRow = Record<string, unknown>

interface Props {
  columns: BaseTableColumn[]
  rows: BaseTableRow[]
  rowKey?: string
  loading?: boolean
  loadingText?: string
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  loading: false,
  loadingText: 'Loading... ',
  emptyText: 'No data found.',
})

const getRowKey = (row: BaseTableRow, index: number) => {
  const value = row[props.rowKey]
  if (value === undefined || value === null || value === '') {
    return index
  }

  return String(value)
}
</script>
