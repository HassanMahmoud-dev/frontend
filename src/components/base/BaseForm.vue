<template>
  <form
    :class="[
      'w-full transition-all duration-200',
      loading || disabled ? 'opacity-70 pointer-events-none' : '',
      formClass,
    ]"
    @submit.prevent="handleSubmit"
  >
    <!-- Form Content Slot -->
    <div :class="['space-y-5', contentClass]">
      <slot />
    </div>

    <!-- Form Actions Slot (Buttons, etc.) -->
    <div v-if="$slots.actions" :class="['mt-8 flex items-center gap-3', actionsClass]">
      <slot name="actions" :loading="loading" :disabled="disabled" />
    </div>
  </form>
</template>

<script setup lang="ts">
interface Props {
  loading?: boolean
  disabled?: boolean
  formClass?: string
  contentClass?: string
  actionsClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  formClass: '',
  contentClass: 'space-y-4',
  actionsClass: 'flex-row-reverse',
})

const emit = defineEmits<{
  submit: [event: Event]
}>()

const handleSubmit = (event: Event) => {
  if (props.loading || props.disabled) return
  emit('submit', event)
}
</script>
