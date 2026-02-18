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
          'relative z-10 w-full rounded-xl border border-slate-200 bg-white shadow-xl',
          sizeClass,
        ]"
      >
        <header v-if="title || $slots.header" class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div class="min-w-0 flex-1">
            <slot name="header">
              <h2 class="truncate text-lg font-semibold text-slate-900">{{ title }}</h2>
            </slot>
          </div>

          <button
            v-if="showClose"
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            @click="close"
          >
            <span class="sr-only">Close</span>
            <i class="bi bi-x-lg" aria-hidden="true" />
          </button>
        </header>

        <section class="px-5 py-4">
          <slot />
        </section>

        <footer v-if="$slots.footer" class="border-t border-slate-200 px-5 py-4">
          <slot name="footer" :close="close" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface Props {
  modelValue: boolean
  title?: string
  size?: ModalSize
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  showClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  closeOnBackdrop: true,
  closeOnEsc: true,
  showClose: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
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

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onEscape)
  document.body.style.overflow = ''
})
</script>
