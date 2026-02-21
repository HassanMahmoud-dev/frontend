<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300"
    >
      {{ label }}
      <span v-if="required" class="inline-flex items-center ms-1">
        <!-- Success Icon (Blue Check) -->
        <i
          v-if="hasValue"
          class="bi bi-check-lg text-blue-500 transition-all duration-300 scale-110"
        ></i>
        <!-- Required Icon (Red Alert) -->
        <i v-else class="bi bi-exclamation-circle text-red-500 transition-all duration-300"></i>
      </span>
    </label>

    <div class="relative">
      <!-- Select Type -->
      <select
        v-if="type === 'select'"
        :id="id"
        :value="modelValue as any"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        :required="required"
        :disabled="disabled"
        v-bind="$attrs"
        class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:border-transparent text-slate-900 dark:text-white transition-all duration-300 outline-none appearance-none disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800"
        :class="[
          required
            ? hasValue
              ? 'bg-blue-50/30 dark:bg-blue-900/10 border-l-4 border-l-blue-500 border-r-slate-300 dark:border-r-slate-600 focus:ring-blue-500'
              : 'bg-red-50/50 dark:bg-red-900/10 border-l-4 border-l-red-500 border-r-slate-300 dark:border-r-slate-600 shadow-sm focus:ring-red-500'
            : 'bg-white dark:bg-slate-700 focus:ring-blue-500',
        ]"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="String(option.value)"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Textarea Type -->
      <textarea
        v-else-if="type === 'textarea'"
        :id="id"
        :value="modelValue as any"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        v-bind="$attrs"
        class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:border-transparent text-slate-900 dark:text-white transition-all duration-300 outline-none placeholder:text-slate-400 min-h-[100px] resize-y disabled:opacity-50"
        :class="[
          required
            ? hasValue
              ? 'bg-blue-50/30 dark:bg-blue-900/10 border-l-4 border-l-blue-500 border-r-slate-300 dark:border-r-slate-600 focus:ring-blue-500'
              : 'bg-red-50/50 dark:bg-red-900/10 border-l-4 border-l-red-500 border-r-slate-300 dark:border-r-slate-600 shadow-sm focus:ring-red-500'
            : 'bg-white dark:bg-slate-700 focus:ring-blue-500',
        ]"
      ></textarea>

      <!-- Checkbox (Toggle Slider) -->
      <label
        v-else-if="type === 'checkbox'"
        class="relative inline-flex items-center cursor-pointer"
      >
        <input
          type="checkbox"
          :id="id"
          class="sr-only peer"
          :checked="modelValue === true || modelValue === 'on'"
          @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
          :disabled="disabled"
          v-bind="$attrs"
        />
        <div
          class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"
        ></div>
        <span
          v-if="placeholder"
          class="me-3 text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {{ placeholder }}
        </span>
      </label>

      <!-- Standard Input Types -->
      <input
        v-else
        :id="id"
        :type="type"
        :value="modelValue as any"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        v-bind="$attrs"
        class="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:border-transparent text-slate-900 dark:text-white transition-all duration-300 outline-none placeholder:text-slate-400 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900"
        :class="[
          required
            ? hasValue
              ? 'bg-blue-50/30 dark:bg-blue-900/10 border-l-4 border-l-blue-500 border-r-slate-300 dark:border-r-slate-700 focus:ring-blue-500'
              : 'bg-red-50/50 dark:bg-red-900/10 border-l-4 border-l-red-500 border-r-slate-300 dark:border-r-slate-700 shadow-sm focus:ring-red-500'
            : 'bg-white dark:bg-slate-800 focus:ring-blue-500',
        ]"
      />

      <!-- Custom Arrow for Select -->
      <div
        v-if="type === 'select'"
        class="pointer-events-none absolute inset-y-0 left-3 flex items-center px-2 text-slate-500"
      >
        <i class="bi bi-chevron-down text-slate-500"></i>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface BaseInputOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue: string | number | boolean | null
  label?: string
  id?: string
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'tel'
    | 'url'
    | 'date'
    | 'select'
    | 'textarea'
    | 'checkbox'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  options?: BaseInputOption[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  id: () => `input-${Math.random().toString(36).slice(2, 9)}`,
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false,
  error: '',
  options: () => [],
})

defineEmits<{
  'update:modelValue': [value: string | number | boolean | null]
}>()

const hasValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return false
  if (typeof props.modelValue === 'string') return props.modelValue.trim().length > 0
  if (typeof props.modelValue === 'boolean') return props.modelValue
  return true
})
</script>
