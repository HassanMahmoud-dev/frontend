<template>
  <div>
    <div class="border-b border-slate-200">
      <nav class="flex flex-wrap gap-2" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="String(tab.value)"
          type="button"
          :disabled="tab.disabled"
          :class="[
            'inline-flex items-center border-b-2 px-3 py-2 text-sm font-medium transition',
            isActive(tab.value)
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900',
            tab.disabled ? 'cursor-not-allowed opacity-50 hover:border-transparent hover:text-slate-600' : '',
          ]"
          @click="setActive(tab.value)"
        >
          <slot name="tab" :tab="tab" :active="isActive(tab.value)">
            {{ tab.label }}
          </slot>
        </button>
      </nav>
    </div>

    <div class="pt-4">
      <slot :name="`panel-${String(activeValue)}`" :active-value="activeValue">
        <slot name="panel" :active-value="activeValue" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type BaseTabValue = string | number

export interface BaseTabItem {
  label: string
  value: BaseTabValue
  disabled?: boolean
}

interface Props {
  tabs: BaseTabItem[]
  modelValue?: BaseTabValue
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: BaseTabValue]
  change: [value: BaseTabValue]
}>()

const fallbackValue = computed<BaseTabValue | undefined>(() => {
  const firstEnabledTab = props.tabs.find((tab) => !tab.disabled)
  return firstEnabledTab?.value
})

const activeValue = computed<BaseTabValue | undefined>(() => {
  if (props.modelValue !== undefined) {
    return props.modelValue
  }

  return fallbackValue.value
})

const isActive = (value: BaseTabValue) => activeValue.value === value

const setActive = (value: BaseTabValue) => {
  const selectedTab = props.tabs.find((tab) => tab.value === value)
  if (!selectedTab || selectedTab.disabled) {
    return
  }

  emit('update:modelValue', value)
  emit('change', value)
}
</script>
