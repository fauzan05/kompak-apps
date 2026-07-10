<script setup lang="ts">
defineProps<{
  label?: string
  description?: string
  modelValue?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  className?: string
  style?: Record<string, string | number>
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
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
    <div
      style="
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--kompak-card-bg);
        border: 1px solid var(--kompak-border);
        border-radius: var(--radius-md);
        padding: 8px 12px;
      "
    >
      <span v-if="$slots.prefix" style="display: flex; align-items: center; flex-shrink: 0">
        <slot name="prefix" />
      </span>
      <input
        :value="modelValue"
        :placeholder="placeholder"
        :type="type ?? 'text'"
        :disabled="disabled"
        style="
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--kompak-text-dark);
          min-width: 0;
        "
        @input="onInput"
      />
      <span
        v-if="$slots.suffix"
        style="
          display: flex;
          align-items: center;
          flex-shrink: 0;
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--kompak-text-muted);
        "
      >
        <slot name="suffix" />
      </span>
    </div>
  </div>
</template>
