<template>
  <form
    :class="[
      'rounded-xl border border-slate-200 bg-white p-4 md:p-6',
      disabled ? 'pointer-events-none opacity-60' : '',
      formClass,
    ]"
    @submit.prevent="onSubmit"
  >
    <div :class="['grid gap-4', contentClass]">
      <slot />
    </div>

    <div v-if="$slots.actions" :class="['mt-6 flex items-center justify-end gap-2', actionsClass]">
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
  contentClass: '',
  actionsClass: '',
})

const emit = defineEmits<{
  submit: [event: Event]
}>()

const onSubmit = (event: Event) => {
  if (props.loading || props.disabled) {
    return
  }

  emit('submit', event)
}
</script>
