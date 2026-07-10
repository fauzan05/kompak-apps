<script setup lang="ts">
defineProps<{
  options: { value: string; label: string }[]
  modelValue?: string
  placeholder?: string
  label?: string
  description?: string
  disabled?: boolean
  className?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

function onChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLSelectElement).value)
}
</script>

<template>
  <div :class="className" style="display: flex; flex-direction: column; gap: 6px">
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
    <select
      :value="modelValue"
      :disabled="disabled"
      style="
        background: var(--kompak-card-bg);
        border: 1px solid var(--kompak-border);
        border-radius: var(--radius-md);
        padding: 9px 12px;
        font-family: var(--font-body);
        font-size: 14px;
        color: var(--kompak-text-dark);
        outline: none;
        cursor: pointer;
        appearance: none;
        background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235C6B52' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E&quot;);
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 32px;
      "
      :style="{ color: modelValue ? 'var(--kompak-text-dark)' : 'var(--kompak-text-muted)' }"
      @change="onChange"
    >
      <option value="" disabled>{{ placeholder ?? 'Pilih...' }}</option>
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
  </div>
</template>
