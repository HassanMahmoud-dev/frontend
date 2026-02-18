<template>
  <header :class="['mb-6', wrapperClass]">
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div class="min-w-0">
        <slot>
          <h1 class="text-2xl font-semibold text-slate-900">{{ title }}</h1>
          <p v-if="subtitle" class="mt-1 text-sm text-slate-600">{{ subtitle }}</p>
        </slot>
      </div>

      <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="divider" class="mt-4 border-b border-slate-200" />
  </header>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  divider?: boolean
  wrapperClass?: string
}

withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  divider: true,
  wrapperClass: '',
})
</script>
