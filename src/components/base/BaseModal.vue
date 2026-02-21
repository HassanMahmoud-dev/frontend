<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      aria-modal="true"
      role="dialog"
      @click="onBackdropClick"
    >
      <div class="absolute inset-0 bg-slate-900/50" />

      <div
        :class="[
          'relative z-10 w-full rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900',
          sizeClass,
        ]"
      >
        <header
          v-if="title || $slots.header"
          class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800"
        >
          <div class="min-w-0 flex-1">
            <slot name="header">
              <h2 class="truncate text-lg font-semibold text-slate-900 dark:text-white">
                {{ title }}
              </h2>
            </slot>
          </div>

          <button
            v-if="showClose"
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            @click="close"
          >
            <span class="sr-only">Close</span>
            <i class="bi bi-x-lg" aria-hidden="true" />
          </button>
        </header>

        <section class="px-5 py-4 text-slate-700 dark:text-slate-300">
          <slot />
        </section>

        <footer
          v-if="showFooter || $slots.footer"
          class="border-t border-slate-200 px-5 py-4 dark:border-slate-800"
        >
          <slot name="footer" :close="close">
            <div class="flex justify-end gap-3">
              <button
                type="button"
                :disabled="loading"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                @click="$emit('confirm')"
              >
                <span
                  v-if="loading"
                  class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                ></span>
                <i v-else-if="confirmIcon" :class="['bi', confirmIcon]"></i>
                {{ confirmLabel || 'تأكيد' }}
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                @click="close"
              >
                <i v-if="cancelIcon" :class="['bi', cancelIcon]"></i>
                {{ cancelLabel || 'إلغاء' }}
              </button>
            </div>
          </slot>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface Props {
  modelValue: boolean
  title?: string
  size?: ModalSize
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  showClose?: boolean
  showFooter?: boolean
  confirmLabel?: string
  cancelLabel?: string
  confirmIcon?: string
  cancelIcon?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  closeOnBackdrop: true,
  closeOnEsc: true,
  showClose: true,
  showFooter: false,
  confirmLabel: '',
  cancelLabel: '',
  confirmIcon: 'bi-check-lg',
  cancelIcon: 'bi-x-lg',
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  confirm: []
}>()

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-md'
    case 'lg':
      return 'max-w-3xl'
    case 'xl':
      return 'max-w-5xl'
    case 'full':
      return 'max-w-[95vw]'
    default:
      return 'max-w-xl'
  }
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const onBackdropClick = (event: MouseEvent) => {
  if (!props.closeOnBackdrop) {
    return
  }

  if (event.target === event.currentTarget) {
    close()
  }
}

const onEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEsc && props.modelValue) {
    close()
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', onEscape)
      document.body.style.overflow = 'hidden'
      return
    }

    window.removeEventListener('keydown', onEscape)
    document.body.style.overflow = ''
  },
  { immediate: true },
)

onUnmounted(() => {
  window.removeEventListener('keydown', onEscape)
  document.body.style.overflow = ''
})
</script>
