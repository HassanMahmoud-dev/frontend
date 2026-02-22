<template>
  <div
    class="mb-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300"
  >
    <!-- Header/Toggle Section -->
    <div
      @click="isOpen = !isOpen"
      class="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"
        >
          <i class="bi bi-funnel text-lg"></i>
        </div>
        <div>
          <h3 class="text-sm font-bold text-slate-800 dark:text-white">{{ title }}</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- Optional: Active Filters Count Badge -->
        <span
          v-if="activeFiltersCount > 0"
          class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-[10px] font-bold"
        >
          {{ activeFiltersCount }} مرشحات نشطة
        </span>

        <i
          class="bi bi-chevron-down text-slate-400 transition-transform duration-300"
          :class="{ 'rotate-180': isOpen }"
        ></i>
      </div>
    </div>

    <!-- Filter Body -->
    <transition
      name="filter-collapse"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <div
        v-show="isOpen"
        class="filter-collapse-content border-t border-slate-100 dark:border-slate-700/50"
      >
        <form @submit.prevent="$emit('search')" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <slot></slot>
          </div>

          <!-- Actions -->
          <div
            class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-end gap-3"
          >
            <button
              type="submit"
              :disabled="loading"
              class="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i v-if="loading" class="bi bi-arrow-repeat animate-spin"></i>
              <i v-else class="bi bi-search"></i>
              <span>{{ searchLabel }}</span>
            </button>
            <button
              type="button"
              @click="$emit('clear')"
              class="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <i class="bi bi-arrow-counterclockwise"></i>
              <span>{{ clearLabel }}</span>
            </button>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  searchLabel?: string
  clearLabel?: string
  loading?: boolean
  activeFiltersCount?: number
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'تصفية النتائج',
  subtitle: 'ابحث وقم بتصفية الوثائق/السجلات بسهولة',
  searchLabel: 'بحث',
  clearLabel: 'إعادة ضبط',
  loading: false,
  activeFiltersCount: 0,
  defaultOpen: false,
})

defineEmits<{
  (e: 'search'): void
  (e: 'clear'): void
}>()

const isOpen = ref(props.defaultOpen)

const onBeforeEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = '0px'
}

const onEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = `${element.scrollHeight}px`
}

const onAfterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = 'auto'
}

const onBeforeLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = `${element.scrollHeight}px`
}

const onLeave = (el: Element) => {
  const element = el as HTMLElement
  void element.offsetHeight
  element.style.height = '0px'
}

const onAfterLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = ''
}
</script>

<style scoped>
.filter-collapse-content {
  overflow: hidden;
}

.filter-collapse-enter-active,
.filter-collapse-leave-active {
  transition: height 0.38s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.28s ease,
    transform 0.32s ease;
  will-change: height, opacity, transform;
}

.filter-collapse-enter-from,
.filter-collapse-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.985);
}

.filter-collapse-enter-to,
.filter-collapse-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
