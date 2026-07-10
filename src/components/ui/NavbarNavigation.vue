<script setup lang="ts">
defineProps<{
  className?: string
}>()

const emit = defineEmits<{ 'logo-click': [] }>()
</script>

<template>
  <header
    :class="className"
    :style="{
      height: '64px',
      background: 'var(--kompak-surface-white)',
      borderBottom: '1px solid var(--kompak-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-2xl)',
      flexShrink: 0,
      zIndex: 30,
      gap: 'var(--space-2xl)',
    }"
  >
    <button
      type="button"
      :style="{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        flexShrink: 0,
      }"
      @click="emit('logo-click')"
    >
      <div
        :style="{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'var(--kompak-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }"
      >
        <span :style="{ color: '#fff', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-body)' }">K</span>
      </div>
      <span
        :style="{
          fontFamily: 'var(--font-heading)',
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--kompak-text-dark)',
          letterSpacing: '-0.3px',
        }"
      >
        KOMPAK
      </span>
    </button>

    <nav
      :style="{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        flex: 1,
        minWidth: 0,
        marginLeft: 'var(--space-lg)',
      }"
    >
      <slot />
    </nav>

    <div
      v-if="$slots.actions"
      :style="{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        flexShrink: 0,
      }"
    >
      <slot name="actions" />
    </div>
  </header>
</template>
