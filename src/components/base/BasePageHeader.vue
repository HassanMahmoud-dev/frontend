<template>
  <header :class="['mb-6', wrapperClass]">
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div class="min-w-0">
        <slot>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ title }}</h1>
          <p v-if="subtitle" class="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {{ subtitle }}
          </p>
        </slot>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <slot name="actions">
          <button
            v-if="addButtonLabel"
            @click="$emit('add')"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
          >
            <i class="bi bi-plus-lg"></i>
            {{ addButtonLabel }}
          </button>
        </slot>
      </div>
    </div>

    <div v-if="divider" class="mt-4 border-b border-slate-200 dark:border-slate-800" />
  </header>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  divider?: boolean
  wrapperClass?: string
  addButtonLabel?: string
}

withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  divider: true,
  wrapperClass: '',
  addButtonLabel: '',
})

defineEmits<{
  (e: 'add'): void
}>()
</script>
