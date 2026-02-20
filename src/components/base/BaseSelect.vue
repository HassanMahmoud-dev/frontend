<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      {{ label }}
    </label>

    <select
      :id="id"
      :name="name"
      v-model="selectedValue"
      :disabled="disabled"
      :required="required"
      :class="[
        'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
        'focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:focus:border-slate-600 dark:focus:ring-slate-800',
        disabled
          ? 'cursor-not-allowed bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-600'
          : '',
        selectClass,
      ]"
      @change="emitChange"
    >
      <option v-if="placeholder" :value="null" disabled>
        {{ placeholder }}
      </option>

      <option
        v-for="option in options"
        :key="String(option.value)"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type BaseSelectValue = string | number | null

export interface BaseSelectOption {
  label: string
  value: BaseSelectValue
  disabled?: boolean
}

interface Props {
  modelValue: BaseSelectValue
  options: BaseSelectOption[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
  selectClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  disabled: false,
  required: false,
  id: '',
  name: '',
  selectClass: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: BaseSelectValue]
  change: [value: BaseSelectValue]
}>()

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value: BaseSelectValue) => emit('update:modelValue', value),
})

const emitChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const selectedOption = props.options.find((option) => String(option.value) === target.value)
  emit('change', selectedOption?.value ?? null)
}
</script>
