<template>
  <div :class="['inline-flex items-center gap-2', containerClass]">
    <img :src="src" :alt="alt" :style="sizeStyle" :class="['shrink-0 object-contain', imgClass]" />

    <span
      v-if="label"
      :class="['text-sm font-semibold text-slate-900 dark:text-white', labelClass]"
      >{{ label }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import defaultLogo from '@/assets/logo.svg'

interface Props {
  src?: string
  alt?: string
  size?: number | string
  width?: number | string
  height?: number | string
  label?: string
  containerClass?: string
  imgClass?: string
  labelClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: defaultLogo,
  alt: 'Logo',
  size: 32,
  width: undefined,
  height: undefined,
  label: '',
  containerClass: '',
  imgClass: '',
  labelClass: '',
})

const toCssSize = (value: number | string) => (typeof value === 'number' ? `${value}px` : value)

const sizeStyle = computed(() => {
  const cssWidth = props.width !== undefined ? toCssSize(props.width) : toCssSize(props.size)
  const cssHeight = props.height !== undefined ? toCssSize(props.height) : toCssSize(props.size)

  return {
    width: cssWidth,
    height: cssHeight,
  }
})
</script>
