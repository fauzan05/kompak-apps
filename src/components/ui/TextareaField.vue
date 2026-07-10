<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    description?: string
    modelValue?: string
    rows?: number
    placeholder?: string
    disabled?: boolean
    className?: string
    style?: Record<string, string | number>
  }>(),
  { rows: 3 },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div :class="className" :style="{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }">
    <label
      v-if="label"
      style="font-family: var(--font-body); font-size: 14px; font-weight: 500; color: var(--kompak-text-dark)"
    >
      {{ label }}
    </label>
    <span
      v-if="description"
      style="font-family: var(--font-body); font-size: 12px; color: var(--kompak-text-muted)"
    >
      {{ description }}
    </span>
    <textarea
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      style="
        background: var(--kompak-card-bg);
        border: 1px solid var(--kompak-border);
        border-radius: var(--radius-md);
        padding: 8px 12px;
        font-family: var(--font-body);
        font-size: 14px;
        color: var(--kompak-text-dark);
        outline: none;
        resize: vertical;
      "
      @input="onInput"
    />
  </div>
</template>
