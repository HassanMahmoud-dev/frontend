<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      {{ label }}
    </label>

    <div class="relative">
      <!-- Select Type -->
      <select
        v-if="type === 'select'"
        :id="id"
        :value="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        :required="required"
        :disabled="disabled"
        v-bind="$attrs"
        class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200 outline-none appearance-none disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800"
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
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        v-bind="$attrs"
        class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200 outline-none placeholder:text-slate-400 min-h-[100px] resize-y disabled:opacity-50"
      ></textarea>

      <!-- Standard Input Types -->
      <input
        v-else
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        v-bind="$attrs"
        class="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all duration-200 outline-none placeholder:text-slate-400 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900"
      />

      <!-- Custom Arrow for Select -->
      <div
        v-if="type === 'select'"
        class="pointer-events-none absolute inset-y-0 left-3 flex items-center px-2 text-slate-500"
      >
        <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          />
        </svg>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
export interface BaseInputOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue: string | number | null
  label?: string
  id?: string
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'date' | 'select' | 'textarea'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  options?: BaseInputOption[]
}

withDefaults(defineProps<Props>(), {
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
  'update:modelValue': [value: string | number | null]
}>()
</script>
